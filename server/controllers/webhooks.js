import { Webhook } from "svix";
import User from "../models/User.js";

/*
🚀 WEBHOOK EXPLANATION 🚀

📢 Webhook ka main purpose: Real-time event notifications
   Jab external service mein kuch hota hai, wo reverse API call kar ke inform karta hai,
   aur isiliye hum isko event notification system hai

🔄 Webhook kya hai aur kyun use kar rahe hain?
   • Webhook = Real-time notification system
   • Jaise hi Clerk mein koi user activity hoti hai (signup/update)
   • Clerk automatically hamare server ko inform kar deta hai
   • Iska faayda: Humein bar bar Clerk API check nahi karna padta

❓ Webhook ki zarurat kyun padi?
   🚫 Problem: Clerk mein user data hai, lekin hamare database mein nahi
   ✅ Solution: Jab bhi Clerk mein user signup kare, webhook se pata chal jaye
   🎯 Result: Dono databases sync mein rahenge automatically
*/

export const clerkWebhooks = async (req, res) => {
  try {
    // 🔐 Step 1: Webhook security check - Svix verify karta hai
    // ⚠️ Kyun zaroori? Koi fake webhook bhej ke database mess kar sakta hai
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // 📦 Step 2: Webhook data extract karte hain
    // 📨 Clerk bhejta hai: event type aur user data
    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        // 🎉 Real-time user signup notification
        // 🔄 Step 3: Clerk ka data format convert karte hain apne database ke liye
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        // ⚡ Step 4: Instant database sync - jaise hi user signup kara, database mein create
        await User.create(userData);
        res.json({
          message: "✅ User synced via webhook successfully!",
        });
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({
          message: "✅ User update via webhook successfully!",
        });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({ message: "✅ User deleted via webhook successfully!" });
        break;
      }

      default:
        // 🔮 Future events ke liye placeholder
        res.json({
          message: "📨 Webhook event received but not processed",
        });
        break;
    }
  } catch (error) {
    // ❌ Webhook verification fail ya database error
    console.error("🚨 Webhook failed:", error);
    res.status(400).json({
      error: "❌ Webhook processing failed",
    });
  }
};
