// queryAttendance.js
const { ddbDocClient } = require('./ddbClient');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');

async function queryAttendance(subject, date) {
  const key = `${subject}#${date}`; // e.g. "Math#2025-03-12"
  const params = {
    TableName: 'AttendanceRecords',
    KeyConditionExpression: 'subject_date = :sd',
    ExpressionAttributeValues: { ':sd': key }
  };
  const data = await ddbDocClient.send(new QueryCommand(params));
  console.log(`Attendance for ${key}:`, data.Items || []);
}

queryAttendance('Math','2025-03-12').catch(console.error);
