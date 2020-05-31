import {APIGatewayEvent, Context} from 'aws-lambda';

const handler = async (event: APIGatewayEvent, context: Context) => {
  const { name } = event.queryStringParameters;
  
  if(!name) {
    return {
      statusCode: 200,
      body: "Name param needed."
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: `Hello ${name}!`
    })
  };
};

export { handler };