// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ Configure AWS DynamoDB
AWS.config.update({
  region: "ap-south-1", // Mumbai region (you can change)
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "AttendanceRecords"; // create this in DynamoDB

// 🧾 Save attendance
app.post("/mark", async (req, res) => {
  const { studentName, subject, date, status } = req.body;

  const params = {
    TableName: TABLE_NAME,
    Item: {
      studentName,
      subject,
      date,
      status,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.json({ success: true, message: "Attendance marked successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📊 Fetch attendance (optional)
app.get("/attendance", async (req, res) => {
  const params = { TableName: TABLE_NAME };
  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
