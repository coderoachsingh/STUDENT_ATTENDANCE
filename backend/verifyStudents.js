// verifyStudents.js
require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION || 'ap-south-1' });
const doc = new AWS.DynamoDB.DocumentClient();

(async () => {
  try {
    const data = await doc.scan({ TableName: 'Students' }).promise();
    console.log('Students in table:', data.Items);
  } catch (err) {
    console.error('Scan error:', err);
  }
})();
