// deleteItem.js
const { ddbDocClient } = require('./ddbClient');
const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');

async function deleteStudent(rollNo) {
  const params = { TableName: 'Students', Key: { rollNo } };
  await ddbDocClient.send(new DeleteCommand(params));
  console.log('Deleted student:', rollNo);
}

async function deleteAttendance(subject, date, rollNo) {
  const params = {
    TableName: 'AttendanceRecords',
    Key: { subject_date: `${subject}#${date}`, rollNo }
  };
  await ddbDocClient.send(new DeleteCommand(params));
  console.log('Deleted attendance for', rollNo, subject, date);
}

// Example:
deleteStudent('S010').catch(console.error);
// deleteAttendance('Math','2025-03-12','S001').catch(console.error);

