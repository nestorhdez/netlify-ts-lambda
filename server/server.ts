import { APIGatewayEvent, Context } from 'aws-lambda';
import { Application, Request, Response } from 'express';
import { readdirSync } from 'fs';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const port = process.env["PORT"] || 3000;

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const parseResponse = (body: string): string | object => {
  let response;
  try {
    response = JSON.parse(body);
  } catch {
    response = body
  }finally {
    return response;
  }
}

(async () => {

  const endpoints: {[key: string]: ({}: APIGatewayEvent, {}: Context) => any} = {};

  console.log('\n Functions:');

  for (const dir of readdirSync('./src')) {
    console.log(`- ${dir}`);
    let { handler } = await import(`../src/${dir}/${dir}`);
    endpoints[dir] = handler;
  }

  app.all('/:endpoint', async (req: Request, res: Response) => {
    const { endpoint } = req.params;
    
    const lambdaEvent = {
      body: req.body,
      queryStringParameters: req.query,
      httpMethod: req.method,
      headers: req.headers,
      path: req.path,
      pathParameters: req.params
    }

    try {
      const { body, statusCode } = await endpoints[endpoint]((lambdaEvent as APIGatewayEvent), ({} as Context));
      const responseParsed = parseResponse(body);
      res.status(statusCode).json(responseParsed);
    } catch(error) {
      res.status(400).json({error});
    }
  });

  app.listen(port, () => {
    console.log(`\n Server is listening on: http://localhost:${port}`);
  });

})();
