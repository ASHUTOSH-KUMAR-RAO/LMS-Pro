import express from "express";

import cors from "cors";

import "dotenv/config"; // todo=> Express mein hum log extra package install karte hai env file ke liye,But next js mein aisa kuch nhi hota hai ,aur dekha jaye to isi choti-choti chijo ke wajah se aaj kaal modern dev mein next js use ho raha hai.
import connectDb from "./config/mongodb.js";
import { clerkWebhooks } from "./controllers'/webhooks.js";

const app = express();

// Connecting Our Database :-

await connectDb();

app.use(cors()); //! Basically sabko pta hai ki hum cors ko isiliye use krte hai kyuki hum apne backend ko kisi bhi type ke website ke domain se connect kr sekte hai ,aur yedi hum ye nhi krte hai to "CORS ERROR ata hai "

//? Our Routes :-
app.get("/", (req, res) => res.send("Api Is Working"));

app.post("/clerk", express.json(), clerkWebhooks);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Is Ruining on Port is :- ${PORT}`);
});
