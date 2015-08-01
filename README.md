# Swagger 2 Express

Dynamically generate express routes for your REST API, using your Swagger JSON.

See http://swagger.io




### Use

```
npm install swagger2express
mkdir -p api/controllers
touch api/controllers/people.js
```

```
var swaggerDoc = require('./swagger.json');
var PORT = 3000;
var express = require('express');
var app = express();
var options = {
  swaggerDoc: swaggerDoc,
  controllerDir: 'api/controllers'
}
swagger2express(options, app);
app.listen(PORT);
```

### Options

*swaggerDoc* - The object containing the Swagger JSON

*controllerDir* - The path to your controllers. Requests are routed to controllers based on the value of *x-api-controller* and controller methods based on *operationId*. There should be one controller per unique path in Swagger JSON, that handles each verb for that path. Each controller should export a handler for each REST verb:

 .get(res, res){}

 .post(req, res){}

 .put(req, res){}

 .del(req, res){}



### Why

This can be used to generate express routes for your application from your swagger document. This reduces duplication, as you already have your swagger document, right?

