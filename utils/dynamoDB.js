const AWS = require('aws-sdk');
const region = "us-east-1";
AWS.config.update({
  region: region
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB;