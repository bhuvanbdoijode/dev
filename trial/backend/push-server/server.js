const express = require("express");
const bodyParser = require("body-parser");
const webpush = require("web-push");

const app = express();
app.use(bodyParser.json());

// Replace with your generated VAPID keys
const publicVapidKey = "BC1oBFQ_qEbXAahPvL8MsZ5AVQS2QW1y4sDdoq_PWM_MPdC-lW3_1q47cE5pkKD9ObKAvy0TWpTYiti2c5cbmGo";
const privateVapidKey = "vWs3T-qQkouDvo23USjgmzoS2KdxCjzli4fBXM2VW3g";

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  publicVapidKey,
  privateVapidKey
);

let subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
  console.log("New subscription added:", subscription);
});

app.post("/sendNotification", async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  try {
    const sendPromises = subscriptions.map(sub =>
      webpush.sendNotification(sub, payload).catch(err => console.error(err))
    );
    await Promise.all(sendPromises);
    res.status(200).json({ message: "Notifications sent!" });
  } catch (err) {
    console.error("Error sending notification", err);
    res.sendStatus(500);
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
