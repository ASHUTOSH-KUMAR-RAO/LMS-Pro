import { Webhook } from "svix";
import User from "../models/User.js";
import {Purchase} from "../models/Purchase.js";
import Course from "../models/Course.js";
import Stripe from "stripe";

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

// Initialize Stripe instance once
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const clerkWebhooks = async (req, res) => {
  try {
    // 🔐 Step 1: Webhook security check - Svix verify karta hai
    // ⚠️ Kyun zaroori? Koi fake webhook bhej ke database mess kar sakta hai
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    if (
      !req.headers["svix-id"] ||
      !req.headers["svix-timestamp"] ||
      !req.headers["svix-signature"]
    ) {
      return res
        .status(400)
        .json({ error: "❌ Missing required Svix headers" });
    }

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // 📦 Step 2: Webhook data extract karte hain
    // 📨 Clerk bhejta hai: event type aur user data
    const { data, type } = req.body;

    // Validate required data
    if (!data || !type) {
      return res.status(400).json({ error: "❌ Invalid webhook payload" });
    }

    switch (type) {
      case "user.created": {
        // 🎉 Real-time user signup notification
        // 🔄 Step 3: Clerk ka data format convert karte hain apne database ke liye

        // Validate required fields
        if (!data.id || !data.email_addresses?.[0]?.email_address) {
          return res.status(400).json({
            error: "❌ Missing required user data (id or email)",
          });
        }

        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name:
            `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
            "Anonymous User",
          imageUrl: data.image_url || null,
          createdAt: new Date(),
        };

        // ⚡ Step 4: Instant database sync - jaise hi user signup kara, database mein create
        // Check if user already exists to avoid duplicates
        const existingUser = await User.findById(data.id);
        if (existingUser) {
          return res.json({
            message: "ℹ️ User already exists, skipping creation",
          });
        }

        await User.create(userData);

        console.log(`✅ New user created: ${userData.email}`);
        res.json({
          message: "✅ User synced via webhook successfully!",
        });
        break;
      }

      case "user.updated": {
        if (!data.id) {
          return res
            .status(400)
            .json({ error: "❌ Missing user ID for update" });
        }

        const userData = {
          email: data.email_addresses?.[0]?.email_address,
          name:
            `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
            "Anonymous User",
          imageUrl: data.image_url || null,
          updatedAt: new Date(),
        };

        // Remove undefined values
        Object.keys(userData).forEach((key) => {
          if (userData[key] === undefined) {
            delete userData[key];
          }
        });

        const updatedUser = await User.findByIdAndUpdate(data.id, userData, {
          new: true,
          runValidators: true,
        });

        if (!updatedUser) {
          return res
            .status(404)
            .json({ error: "❌ User not found for update" });
        }

        console.log(`✅ User updated: ${updatedUser.email}`);
        res.json({
          message: "✅ User updated via webhook successfully!",
        });
        break;
      }

      case "user.deleted": {
        if (!data.id) {
          return res
            .status(400)
            .json({ error: "❌ Missing user ID for deletion" });
        }

        const deletedUser = await User.findByIdAndDelete(data.id);

        if (!deletedUser) {
          return res
            .status(404)
            .json({ error: "❌ User not found for deletion" });
        }

        console.log(`✅ User deleted: ${deletedUser.email}`);
        res.json({
          message: "✅ User deleted via webhook successfully!",
        });
        break;
      }

      default:
        // 🔮 Future events ke liye placeholder
        console.log(`📨 Unhandled webhook event: ${type}`);
        res.json({
          message: "📨 Webhook event received but not processed",
        });
        break;
    }
  } catch (error) {
    // ❌ Webhook verification fail ya database error
    console.error("🚨 Webhook failed:", error.message);

    // More specific error handling
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "❌ Data validation failed",
        details: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        error: "❌ Duplicate user data",
        details: "User already exists",
      });
    }

    res.status(500).json({
      error: "❌ Webhook processing failed",
      message: error.message,
    });
  }
};

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    // Validate required headers and body
    if (!sig) {
      return response.status(400).json({
        error: "❌ Missing Stripe signature header",
      });
    }

    if (!request.body) {
      return response.status(400).json({
        error: "❌ Missing request body",
      });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("🚨 Missing STRIPE_WEBHOOK_SECRET environment variable");
      return response.status(500).json({
        error: "❌ Server configuration error",
      });
    }

    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`🚨 Webhook signature verification failed: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        console.log(
          `💰 Processing successful payment: ${event.data.object.id}`
        );

        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Get checkout session
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        if (!sessions.data.length) {
          console.error(
            `🚨 No checkout session found for payment intent: ${paymentIntentId}`
          );
          return response.status(404).json({
            error: "❌ Checkout session not found",
          });
        }

        const session = sessions.data[0];
        const { purchaseId } = session.metadata || {};

        if (!purchaseId) {
          console.error(`🚨 Missing purchaseId in session metadata`);
          return response.status(400).json({
            error: "❌ Purchase ID not found in session metadata",
          });
        }

        // Get purchase data
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error(`🚨 Purchase not found: ${purchaseId}`);
          return response.status(404).json({
            error: "❌ Purchase record not found",
          });
        }

        // Prevent duplicate processing
        if (purchaseData.status === "completed") {
          console.log(`ℹ️ Purchase already completed: ${purchaseId}`);
          return response.json({
            received: true,
            message: "Purchase already completed",
          });
        }

        // Get user and course data
        const [userData, courseData] = await Promise.all([
          User.findById(purchaseData.userId),
          Course.findById(purchaseData.courseId.toString()),
        ]);

        if (!userData) {
          console.error(`🚨 User not found: ${purchaseData.userId}`);
          return response.status(404).json({
            error: "❌ User not found",
          });
        }

        if (!courseData) {
          console.error(`🚨 Course not found: ${purchaseData.courseId}`);
          return response.status(404).json({
            error: "❌ Course not found",
          });
        }

        // Check if user is already enrolled to prevent duplicates
        const isAlreadyEnrolled = courseData.enrolledStudents.some(
          (studentId) => studentId.toString() === userData._id.toString()
        );

        if (!isAlreadyEnrolled) {
          courseData.enrolledStudents.push(userData._id);
        }

        const isAlreadyEnrolledInUser = userData.enrolledCourses.some(
          (courseId) => courseId.toString() === courseData._id.toString()
        );

        if (!isAlreadyEnrolledInUser) {
          userData.enrolledCourses.push(courseData._id);
        }

        // Update all records
        await Promise.all([
          courseData.save(),
          userData.save(),
          Purchase.findByIdAndUpdate(purchaseId, {
            status: "completed",
            completedAt: new Date(),
          }),
        ]);

        console.log(
          `✅ Payment successful - User ${userData.email} enrolled in ${courseData.title}`
        );
        break;
      }

      case "payment_intent.payment_failed": {
        console.log(`❌ Processing failed payment: ${event.data.object.id}`);

        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        if (!sessions.data.length) {
          console.error(
            `🚨 No checkout session found for failed payment: ${paymentIntentId}`
          );
          break;
        }

        const session = sessions.data[0];
        const { purchaseId } = session.metadata || {};

        if (!purchaseId) {
          console.error(
            `🚨 Missing purchaseId in failed payment session metadata`
          );
          break;
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error(
            `🚨 Purchase not found for failed payment: ${purchaseId}`
          );
          break;
        }

        // Update purchase status to failed
        purchaseData.status = "failed";
        purchaseData.failedAt = new Date();
        purchaseData.failureReason =
          paymentIntent.last_payment_error?.message || "Payment failed";

        await purchaseData.save(); // For Saving The Data in MongoDB

        console.log(`❌ Payment failed for purchase: ${purchaseId}`);
        break;
      }

      default:
        console.log(`📨 Unhandled Stripe event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.json({ received: true });
  } catch (error) {
    console.error(`🚨 Error processing Stripe webhook: ${error.message}`);

    // More specific error handling
    if (error.name === "ValidationError") {
      return response.status(400).json({
        error: "❌ Data validation failed",
        details: error.message,
      });
    }

    if (error.name === "CastError") {
      return response.status(400).json({
        error: "❌ Invalid ID format",
        details: error.message,
      });
    }

    response.status(500).json({
      error: "❌ Webhook processing failed",
      message: error.message,
    });
  }
};
