'use strict';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { Application, Request, Response, Router } from 'express';

import { handler } from '../src/function/function';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const port = process.env["PORT"] || 3000;

const app: Application = express();
const router: Router = express.Router();

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

router.all('/', async (req: Request, res: Response) => {

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

app.use('/', router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
