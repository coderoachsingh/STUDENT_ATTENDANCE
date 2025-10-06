// seedStudents.js
require('dotenv').config();
const AWS = require('aws-sdk');

const REGION = process.env.AWS_REGION || 'ap-south-1';
AWS.config.update({ region: REGION });

// If you set AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY in .env they will be used.
// If you used `aws configure`, the SDK will pick credentials from the shared config.
const doc = new AWS.DynamoDB.DocumentClient();

const TABLE = 'Students';

// Put your students array here (plain JS types)
const students = [
  { rollNo: 'S001', name: 'Arman Singh', subject: 'Mathematics', semester: 'Sem 1', email: 'arman.singh@example.com' },
  { rollNo: 'S002', name: 'Priya Das', subject: 'Physics', semester: 'Sem 1', email: 'priya.das@example.com' },
  { rollNo: 'S003', name: 'Ravi Kumar', subject: 'Chemistry', semester: 'Sem 1', email: 'ravi.kumar@example.com' },
  { rollNo: 'S004', name: 'Simran Kaur', subject: 'Biology', semester: 'Sem 1', email: 'simran.kaur@example.com' },
  { rollNo: 'S005', name: 'Rahul Sharma', subject: 'Computer Science', semester: 'Sem 1', email: 'rahul.sharma@example.com' }
];

// DynamoDB batchWrite limit is 25 items per request — we chunk to be safe
async function batchWriteItems(tableName, items) {
  const CHUNK_SIZE = 25;
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE);
    const requestItems = {};
    requestItems[tableName] = chunk.map(item => ({ PutRequest: { Item: item } }));

    const params = { RequestItems: requestItems };

    console.log(`Writing chunk ${i / CHUNK_SIZE + 1} (${chunk.length} items) ...`);
    try {
      const res = await doc.batchWrite(params).promise();
      if (Object.keys(res.UnprocessedItems || {}).length) {
        console.warn('Warning: some items were unprocessed — retrying once...');
        // simple retry for unprocessed items
        await doc.batchWrite({ RequestItems: res.UnprocessedItems }).promise();
      }
    } catch (err) {
      console.error('Batch write error:', err);
      throw err;
    }
  }
  console.log('All students written successfully.');
}

(async () => {
  try {
    await batchWriteItems(TABLE, students);
  } catch (err) {
    console.error('Failed to seed students:', err);
  }
})();
