'use strict';

module.exports = function(app, call) {
  //Used by OpenAPI to provide the check of the json file + the visual
  //representation of the specification.
  var openApi = require('swagger-tools');

  //======================================================================
  //Custom imports.
  //======================================================================
  var options = {
    controllers : './api/controllers'
  };
  var specification = require('./api/specification/swaggerv3.json');

  /* Necessary to validate the swagger.json file. And to start the api server. */
  openApi.initializeMiddleware(specification, function(middleware) {
    app.use(middleware.swaggerMetadata());
    // Validate swagger request.
    app.use(middleware.swaggerValidator());
    // Route validate requests to appropriate controller.
    app.use(middleware.swaggerRouter(options));
    // Serve swagger documents and ui.
    app.use(middleware.swaggerUi());

    //Server settings are completed.
    call(app);
  });
}
