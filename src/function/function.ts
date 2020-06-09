import {APIGatewayEvent, APIGatewayProxyResult, Context, Handler} from 'aws-lambda';

const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const { name } = event.queryStringParameters;

  if(!name) {
    return {
      statusCode: 200,
      body: "name param needed."
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      response: `Hello ${name}!`
    })
  };
};

export { handler };
