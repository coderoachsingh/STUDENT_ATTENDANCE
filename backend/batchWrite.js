// batchWrite.js
const { ddbDocClient } = require('./ddbClient'); // Assumes ddbClient.js is configured for SDK v3
const { BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

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
      studentAttendance[subject] = [];
      const totalClasses = Math.floor(Math.random() * 10) + 15; // 15-24 classes
      const presentClasses = Math.floor(Math.random() * (totalClasses - 10)) + 10; // 10 to (total-1) present

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
      semester: 'Sem 2', // Assuming this is for a new semester
      attendance: studentAttendance,
    });
  }
  return finalStudents;
};

// This is the final array that will be sent to DynamoDB
const students = generateFullStudentData();


// --- BATCH WRITE FUNCTION ---
async function batchWrite(tableName, items) {
  const chunkSize = 25;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const requestItems = {
      [tableName]: chunk.map(item => ({ PutRequest: { Item: item } }))
    };

    const params = { RequestItems: requestItems };

    try {
        console.log(`Writing chunk ${Math.floor(i / chunkSize) + 1} (${chunk.length} items) to ${tableName}...`);
        const res = await ddbDocClient.send(new BatchWriteCommand(params));

        if (res.UnprocessedItems && Object.keys(res.UnprocessedItems).length > 0) {
            console.warn('Warning: some items were unprocessed. Retrying once...');
            await ddbDocClient.send(new BatchWriteCommand({ RequestItems: res.UnprocessedItems }));
        }
    } catch (err) {
        console.error("Error during batch write:", err);
        throw err;
    }
  }
  console.log('All students written successfully.');
}

// --- EXECUTION BLOCK ---
(async () => {
    console.log('--- IMPORTANT ---');
    console.log('This script will OVERWRITE items in the "Students" table with the same primary key (rollNo).\n');
    try {
        await batchWrite('Students', students);
    } catch (err) {
        console.error('Failed to seed students:', err);
    }
})();
