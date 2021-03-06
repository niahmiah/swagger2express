'use strict';
var fs = require('fs');
var changeCase = require('change-case');

module.exports = function swagger2express(options, app){
  var apiDoc = options.swaggerDoc;
  var controllerDir = options.controllerDir;
  var modelDir = options.modelDir;
  var controllers = {};

  var controllerFiles = fs.readdirSync(controllerDir);
  for(var i = 0; i < controllerFiles.length; i++){
    var controllerName = controllerFiles[i].replace(/\.js$/, '');
    var Controller = require('../../' + controllerDir + '/' + controllerName);
    controllers[controllerName] = new Controller();
  }

  for(var route in apiDoc.paths){
    var routeFormatted = route.replace('{', ':');
    routeFormatted = routeFormatted.replace('}', '');
    for(var verb in apiDoc.paths[route]) {
      var controller = apiDoc.paths[route][verb]['x-api-controller'];
      controller = changeCase.lowerCaseFirst(controller);
      var methodName = apiDoc.paths[route][verb].operationId;

      var ctrlOptions = {
        modelDir: modelDir,
        name: controller
      };

      switch(verb) {
        case 'get':
          app.get(routeFormatted, controllers[controller].get(ctrlOptions));
          break;
        case 'put':
          app.put(routeFormatted, controllers[controller].put(ctrlOptions));
          break;
        case 'post':
          app.post(routeFormatted, controllers[controller].post(ctrlOptions));
          break;
        case 'delete':
          app.del(routeFormatted, controllers[controller].del(ctrlOptions));
          break;
        default:
          break;
      }
    }
  }

  return app;
};
