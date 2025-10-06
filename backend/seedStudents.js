// seedStudents.js
require('dotenv').config();
const AWS = require('aws-sdk');

const REGION = process.env.AWS_REGION || 'ap-south-1';
AWS.config.update({ region: REGION });

const doc = new AWS.DynamoDB.DocumentClient();
const TABLE = 'Students';

// 1. DEFINE THE NEW MASTER LIST OF SUBJECTS
const subjects = [
  'Data Structures',
  'Object Oriented Programming',
  'Discrete Mathematics',
  'Digital Electronics',
  'Professional Communication',
  'Data Structures Lab',
  'OOP Lab'
];

// 2. DEFINE THE BASE STUDENT DETAILS
const studentDetails = [
  { rollNo: 'S001', name: 'Arman Singh', email: 'arman.singh@example.com' },
  { rollNo: 'S002', name: 'Priya Das', email: 'priya.das@example.com' },
  { rollNo: 'S003', name: 'Ravi Kumar', email: 'ravi.kumar@example.com' },
  { rollNo: 'S004', name: 'Simran Kaur', email: 'simran.kaur@example.com' },
  { rollNo: 'S005', name: 'Rahul Sharma', email: 'rahul.sharma@example.com' }
];

// 3. GENERATE THE FULL STUDENT RECORDS WITH MOCK ATTENDANCE DATA
const generateFullStudentData = () => {
  const finalStudents = [];

  for (const detail of studentDetails) {
    const studentAttendance = {};

    // For each subject, create a list of random attendance records.
    for (const subject of subjects) {
      studentAttendance[subject] = []; // This will be a list of attendance objects
      const totalClasses = Math.floor(Math.random() * 10) + 15; // Total classes between 15-24
      const presentClasses = Math.floor(Math.random() * (totalClasses - 10)) + 10; // Present between 10 and (total-1)

      for (let i = 0; i < totalClasses; i++) {
        // Using ISO strings for dates is a common best practice
        const date = new Date(2025, 8, i + 1).toISOString(); 
        const status = i < presentClasses ? 'Present' : 'Absent';
        studentAttendance[subject].push({ date, status });
      }
    }

    // Combine student details with the generated attendance map
    finalStudents.push({
      ...detail,
      semester: 'Sem 2', // Updated semester
      attendance: studentAttendance, // This is a Map in DynamoDB
    });
  }
  return finalStudents;
};

// This is the final array that will be sent to DynamoDB
const students = generateFullStudentData();


// --- HELPER FUNCTION TO WRITE DATA TO DYNAMODB ---
// (No changes needed here, it handles the batch writing process)
async function batchWriteItems(tableName, items) {
  const CHUNK_SIZE = 25; // DynamoDB limit
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE);
    const requestItems = {
      [tableName]: chunk.map(item => ({ PutRequest: { Item: item } }))
    };

    const params = { RequestItems: requestItems };

    console.log(`Writing chunk ${Math.floor(i / CHUNK_SIZE) + 1} (${chunk.length} items)...`);
    try {
      const res = await doc.batchWrite(params).promise();
      if (Object.keys(res.UnprocessedItems || {}).length) {
        console.warn('Warning: some items were unprocessed. Retrying once...');
        await doc.batchWrite({ RequestItems: res.UnprocessedItems }).promise();
      }
    } catch (err) {
      console.error('Batch write error:', err);
      throw err;
    }
  }
  console.log('All students written successfully.');
}


// --- EXECUTION BLOCK ---
(async () => {
  console.log('--- IMPORTANT ---');
  console.log('This script is designed to seed a DynamoDB table with new student data.');
  console.log('It does not delete existing items, but it WILL OVERWRITE items with the same primary key (rollNo).\n');
  
  try {
    await batchWriteItems(TABLE, students);
  } catch (err) {
    console.error('Failed to seed students:', err);
  }
})();
