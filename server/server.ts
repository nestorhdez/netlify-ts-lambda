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

  const functions = readdirSync('./src').map(async dir => {
    let { handler } = await import(`../src/${dir}/${dir}`);
    return { dir, handler }
  });

  for await (const {dir, handler} of functions) {
    app.all(`/${dir}/`, async (req: Request, res: Response) => {
      const lambdaEvent = {
        body: req.body,
        queryStringParameters: req.query,
        httpMethod: req.method,
        headers: req.headers,
        path: req.path,
        pathParameters: req.params
      }

      try {
        const { body, statusCode } = await handler((lambdaEvent as APIGatewayEvent), ({} as Context));
        const responseParsed = parseResponse(body);
        res.status(statusCode).json(responseParsed);
      } catch(error) {
        res.status(400).json({error});
      }
    });
  }

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

})();
