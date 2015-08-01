'use strict';
var fs = require('fs');
var changeCase = require('change-case');

module.exports = function swagger2express(options, app){
  var apiDoc = options.swaggerDoc;
  var controllerDir = options.controllerDir;
  var controllers = {};

  var controllerFiles = fs.readdirSync(controllerDir);
  for(var i = 0; i < controllerFiles.length; i++){
    var controllerName = controllerFiles[i].replace(/\.js$/, '');
    controllers[controllerName] = require('../' + controllerDir + '/' + controllerName);
  }

  for(var route in apiDoc.paths){
    var routeFormatted = route.replace('{', ':');
    routeFormatted = routeFormatted.replace('}', '');
    for(var verb in apiDoc.paths[route]) {
      var controller = apiDoc.paths[route][verb]['x-api-controller'];
      controller = changeCase.lowerCaseFirst(controller);
      var methodName = apiDoc.paths[route][verb].operationId;

      switch(verb) {
        case 'get':
          app.get(routeFormatted, controllers[controller].get);
          break;
        case 'put':
          app.put(routeFormatted, controllers[controller].put);
          break;
        case 'post':
          app.post(routeFormatted, controllers[controller].post);
          break;
        case 'delete':
          app.del(routeFormatted, controllers[controller].del);
          break;
        default:
          break;
      }
    }
  }

  return app;
};
