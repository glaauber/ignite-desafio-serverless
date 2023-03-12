import { APIGatewayProxyHandler } from "aws-lambda"
import {document} from "../utils/dynamodbClient"

interface ICreateTodo {
    id: string,
    user_id: string,
    title: string,
    done: boolean,
    deadline: Date
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const {id, user_id, title, done, deadline} = JSON.parse(event.body) as ICreateTodo
    
    await document.put({
        TableName: "todos",
        Item: {
            id,
            user_id,
            title,
            done,
            deadline
        }
    }).promise()

    const response = await document.query({
        TableName: "todos",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }).promise();


    
    return {
        statusCode: 201,
        body: JSON.stringify({
            message: response.Items[0]
        })
    }
}


/*
id
user_id
title
done
deadline
*/