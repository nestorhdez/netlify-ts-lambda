import {APIGatewayEvent, APIGatewayProxyResult, Context, Handler} from 'aws-lambda';
import fetch from 'node-fetch';

const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const { id } = event.queryStringParameters;

  if(!id) {
    return {
      statusCode: 200,
      body: "id param needed."
    }
  }

  try {
    const todo = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then((res: any) => res.json());
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        response: todo
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
