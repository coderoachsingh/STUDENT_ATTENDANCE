// batchWrite.js
const { ddbDocClient } = require('./ddbClient');
const { BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

const students = [
  { rollNo: 'S001', name: 'Arman Singh', subject: 'Mathematics', semester: 'Sem 1', email: 'arman.singh@example.com' },
  { rollNo: 'S002', name: 'Priya Das', subject: 'Physics', semester: 'Sem 1', email: 'priya.das@example.com' },
  { rollNo: 'S003', name: 'Ravi Kumar', subject: 'Chemistry', semester: 'Sem 1', email: 'ravi.kumar@example.com' }
];

async function batchWrite(tableName, items) {
  const chunkSize = 25;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const requestItems = {};
    requestItems[tableName] = chunk.map(it => ({ PutRequest: { Item: it } }));

    const params = { RequestItems: requestItems };
    const res = await ddbDocClient.send(new BatchWriteCommand(params));
    // Retry unprocessed items (simple single retry)
    if (res.UnprocessedItems && Object.keys(res.UnprocessedItems).length) {
      console.log('Retrying unprocessed items...');
      await ddbDocClient.send(new BatchWriteCommand({ RequestItems: res.UnprocessedItems }));
    }
    console.log(`Wrote ${chunk.length} items to ${tableName}`);
  }
}

batchWrite('Students', students).catch(console.error);
