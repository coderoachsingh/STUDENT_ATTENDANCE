// createItem.js
const { ddbDocClient } = require('./ddbClient');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

async function putStudent(student) {
  const params = {
    TableName: 'Students',
    Item: student
  };
  await ddbDocClient.send(new PutCommand(params));
  console.log('Inserted:', student);
}

const student = {
  rollNo: 'S010',
  name: 'Test Student',
  subject: 'Data Structures',
  semester: 'Sem 1',
  email: 'test.student@example.com'
};

putStudent(student).catch(console.error);
