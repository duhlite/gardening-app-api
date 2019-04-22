import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      bedId: event.pathParameters.id
    },
    UpdateExpression: "SET #p = list_append(:vals, #p)",
    ExpressionAttributeNames: {
        '#p' : 'plants'
    },
    ExpressionAttributeValues: {
      ":vals": [
          {'myPlant':
            {"name": data.name, "species": data.speciesName, "speciesId":     data.speciesId, "sowing": data.sowing, "maturation": data.maturation,   "year": data.year}
          }
        ]
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
     console.log(e);
     callback(null, failure({ status: false }));
  }
}
