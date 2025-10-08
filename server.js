// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand, QueryCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); 

// DynamoDB client setup
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const STUDENTS_TABLE = process.env.STUDENTS_TABLE;
const ATTENDANCE_TABLE = process.env.ATTENDANCE_TABLE;
const JWT_SECRET = process.env.JWT_SECRET || "a-default-secret-key-for-testing";


// =================================================================
// TEACHER DASHBOARD ROUTES
// =================================================================

app.get("/students", async (req, res) => {
  try {
    const params = { TableName: STUDENTS_TABLE };
    const data = await ddbDocClient.send(new ScanCommand(params));
    res.json(data.Items || []);
  } catch (err) {
    console.error("Error getting students:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

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


// =================================================================
// STUDENT PORTAL ROUTES
// =================================================================

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Student Login Endpoint
app.post("/login", async (req, res) => {
  const { rollNo, email } = req.body;
  if (!rollNo || !email) return res.status(400).json({ error: "Roll Number and Email are required." });

  try {
    const { Item: student } = await ddbDocClient.send(new GetCommand({ TableName: STUDENTS_TABLE, Key: { rollNo } }));
    if (!student || student.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ rollNo: student.rollNo, name: student.name }, JWT_SECRET, { expiresIn: "8h" });
    res.json({
      message: "Login successful!",
      token: token,
      user: { name: student.name, rollNo: student.rollNo },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
});

// Get Logged-in Student's Aggregated Attendance
app.get("/my-attendance", verifyToken, async (req, res) => {
  const studentRollNo = req.user.rollNo;

  // 1. Define the master list of all subjects.
  const allSubjects = [
    'Data Structures',
    'Object Oriented Programming',
    'Discrete Mathematics',
    'Digital Electronics',
    'Professional Communication',
    'Data Structures Lab',
    'OOP Lab'
  ];

  try {
    const scanParams = {
      TableName: ATTENDANCE_TABLE,
      FilterExpression: "rollNo = :rollNo",
      ExpressionAttributeValues: { ":rollNo": studentRollNo },
    };
    const { Items } = await ddbDocClient.send(new ScanCommand(scanParams));
    
    // 2. Process the attendance records that were found.
    const summary = {};
    Items.forEach(item => {
      const subjectName = item.subject_date.split('#')[0];
      if (!summary[subjectName]) {
        summary[subjectName] = { name: subjectName, total: 0, attended: 0, code: `CS-${Math.floor(Math.random() * 1000) + 2000}` };
      }
      summary[subjectName].total++;
      if (item.status === "Present") {
        summary[subjectName].attended++;
      }
    });

    // 3. Merge the master list with the found records.
    allSubjects.forEach(subjectName => {
        if (!summary[subjectName]) {
            summary[subjectName] = { name: subjectName, total: 0, attended: 0, code: `CS-${Math.floor(Math.random() * 1000) + 2000}` };
        }
    });

    // 4. Send the complete list to the frontend.
    res.json(Object.values(summary));

  } catch (err) {
    console.error("Error fetching student attendance:", err);
    res.status(500).json({ error: "Failed to fetch attendance data." });
  }
});


// =================================================================
// START SERVER
// =================================================================

app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 3000}`);
});