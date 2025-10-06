// getItem.js
const { ddbDocClient } = require('./ddbClient');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');

async function getStudent(rollNo) {
  const params = {
    TableName: 'Students',
    Key: { rollNo }
  };
  const { Item } = await ddbDocClient.send(new GetCommand(params));
  console.log('Get result:', Item);
}

getStudent('S001').catch(console.error);
