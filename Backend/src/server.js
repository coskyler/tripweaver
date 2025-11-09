import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import tripRouter from "./routes/trip.js";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const app = express();

app.use(
  cors({
    origin: ["https://tourweaver.coskyler.com", "http://localhost:3000"],
  })
);
app.use(express.json());

/*/ verify auth via firebase
app.use(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (.+)$/);

  if (!match) return res.status(401).json({ error: "Missing auth token" });

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}); /*/

// protected routes
app.use("/tours", tripRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(80, () => console.log("Server running on port 80"));