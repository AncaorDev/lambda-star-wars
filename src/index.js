const dynamoDB = require('../utils/dynamoDB');
const axios = require('axios');
const AWS = require("aws-sdk");
const region = "us-east-1";
const { translateFieldsVehicles } = require('../utils/translations');

module.exports.create = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { path, item } = requestBody;
    let data;
    if(!path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Path is required' }),
      };
    }
    if(!item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Item is required' }),
      };
    }
    const url = 'https://swapi.py4e.com/api/'+path+'/'+item;
    const response = await axios.get(url);

    if(path === 'vehicles') {
      data = translateFieldsVehicles(response.data);
      const { exists: exists_table } = await verifyExistTable(path);
      if(!exists_table) {
        createTableVehicle()
      }
      const params = {
        TableName: path,
        Item: data,
      };
      await dynamoDB.put(params).promise();
    }
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Element created successfully' , item : data }),
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

module.exports.list = async (event) => {
  const path = event.queryStringParameters.path
  try {
    const params = {
      TableName: path,
    };
    const result = await dynamoDB.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};


async function verifyExistTable(table) {
  try {
    const listTables = await tablesList();
    if(listTables.success) {
      const tables = listTables.data;
      return {
        success : true,
        exists :  tables.includes(table)
      };
    }
  } catch (error) {
    return {
      success : false
    }
  }
}

function tablesList() {
  AWS.config.update({
    region: region
  });
  var dynamodb = new AWS.DynamoDB();
  return new Promise((resolve, reject) => {
    dynamodb.listTables({}, (err, data) => {
      if (err) {
        reject(err.stack)
      }
      resolve({
        success : true,
        data : data.TableNames
      })
    });
  });
}

function createTableVehicle() {
  AWS.config.update({
    region: region
  });
  var dynamodb = new AWS.DynamoDB();

  var tableName = "vehicles";

  var params = {
      TableName : tableName,
      KeySchema: [
          { AttributeName: "modelo", KeyType: "HASH"},
          { AttributeName: "nombre", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
          { AttributeName: "modelo", AttributeType: "S" },
          { AttributeName: "nombre", AttributeType: "S" },
      ],
      ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10
      }
  };
  dynamodb.createTable(params, function(err, data) {
      if (err) {
          console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
      }
  });
}