// ddbClient.js
require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const REGION = process.env.AWS_REGION || 'ap-south-1';

const ddbClient = new DynamoDBClient({ region: REGION });

// Use the high-level Document client for native JS types
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

module.exports = { ddbDocClient };
