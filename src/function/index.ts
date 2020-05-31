import {APIGatewayEvent, Context} from 'aws-lambda';
import fetch from 'node-fetch';

interface Todo {
  "userId": number,
  "id": number,
  "title": string,
  "completed": boolean
}

const handler = async (event: APIGatewayEvent, context: Context) => {
  const { todo } = event.queryStringParameters;
  
  if(!todo) {
    return {
      statusCode: 200,
      body: "todo param needed."
    }
  }
  try {
    const response: Todo[] =
      await fetch(`https://jsonplaceholder.typicode.com/todos/${todo}`).then(res => res.json());

    return {
      statusCode: 200,
      body: JSON.stringify({
        response
      })
    };
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    }
  }
};

export { handler };
