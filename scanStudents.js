// scanStudents.js
const { ddbDocClient } = require('./ddbClient');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

async function scanStudents() {
  const params = { TableName: 'Students' };
  const data = await ddbDocClient.send(new ScanCommand(params));
  console.log('Students:', data.Items || []);
}

scanStudents().catch(console.error);
