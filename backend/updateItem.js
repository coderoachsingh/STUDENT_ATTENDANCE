// updateItem.js
const { ddbDocClient } = require('./ddbClient');
const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');

async function updateStudentEmail(rollNo, newEmail) {
  const params = {
    TableName: 'Students',
    Key: { rollNo },
    UpdateExpression: 'SET #e = :email',
    ExpressionAttributeNames: { '#e': 'email' },
    ExpressionAttributeValues: { ':email': newEmail },
    ReturnValues: 'ALL_NEW'
  };
  const res = await ddbDocClient.send(new UpdateCommand(params));
  console.log('Updated student:', res.Attributes);
}

// Example: update attendance status in AttendanceRecords
async function updateAttendanceStatus(subject, date, rollNo, status) {
  const key = `${subject}#${date}`;
  const params = {
    TableName: 'AttendanceRecords',
    Key: { subject_date: key, rollNo },
    UpdateExpression: 'SET #s = :status',
    ExpressionAttributeNames: { '#s': 'status' },
    ExpressionAttributeValues: { ':status': status },
    ReturnValues: 'ALL_NEW'
  };
  const res = await ddbDocClient.send(new UpdateCommand(params));
  console.log('Updated attendance:', res.Attributes);
}

// Call either function:
updateStudentEmail('S001','arman.new@example.com').catch(console.error);
// updateAttendanceStatus('Data Structures','2025-03-12','S001','Absent').catch(console.error);

