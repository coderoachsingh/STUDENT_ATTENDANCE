// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); 

// DynamoDB client setup
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const STUDENTS_TABLE = process.env.STUDENTS_TABLE;
const ATTENDANCE_TABLE = process.env.ATTENDANCE_TABLE;

// ✅ Get all students for a subject
app.get("/students", async (req, res) => {
  try {
    const subject = req.query.subject;
    const params = { TableName: STUDENTS_TABLE };
    const data = await ddbDocClient.send(new ScanCommand(params));
    const filtered = subject ? data.Items.filter(s => s.subject === subject) : data.Items;
    res.json(filtered);
  } catch (err) {
    console.error("Error getting students:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// ✅ Save attendance for selected date
app.post("/markAttendance", async (req, res) => {
  try {
    const { subject, date, records } = req.body;

    for (const record of records) {
      const params = {
        TableName: ATTENDANCE_TABLE,
        Item: {
          subject_date: `${subject}#${date}`,
          rollNo: record.rollNo,
          name: record.name,
          status: record.status,
          markedAt: new Date().toISOString()
        },
      };
      await ddbDocClient.send(new PutCommand(params));
    }

    res.json({ message: "Attendance marked successfully!" });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

// ✅ Get attendance for a subject/date
app.get("/attendance", async (req, res) => {
  try {
    const { subject, date } = req.query;
    const key = `${subject}#${date}`;
    const params = {
      TableName: ATTENDANCE_TABLE,
      KeyConditionExpression: "subject_date = :sd",
      ExpressionAttributeValues: { ":sd": key },
    };
    const data = await ddbDocClient.send(new QueryCommand(params));
    res.json(data.Items);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

app.listen(process.env.PORT || 5500, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 5500}`);
});
