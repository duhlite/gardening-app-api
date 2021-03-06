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
    UpdateExpression: "SET #n = :n, #l = :l, #w = :w, #p = :p",
    ExpressionAttributeNames: {
      '#n' : 'name',
      '#l' : 'bedLength',
      '#w' : 'bedWidth',
      '#p' : 'plants'
    },
    ExpressionAttributeValues: {
      ":n": data.name,
      ":l": data.lengthDimension,
      ":w": data.widthDimension,
      ":p": data.plants
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
