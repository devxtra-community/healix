import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../config/db.js";

const TABLE_NAME = "OrderTable";

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();

  const res = await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: "ORDER_COUNTER",
        SK: `YEAR#${year}`,
      },
      UpdateExpression: "ADD #current :inc",
      ExpressionAttributeNames: {
        "#current": "current",
      },
      ExpressionAttributeValues: {
        ":inc": 1,
      },
      ReturnValues: "UPDATED_NEW",
    }),
  );

  const count = res.Attributes?.current as number;

  return `ORD-${year}-${String(count).padStart(6, "0")}`;
}
