var express = require('express');

module.exports = function(app) {
	app.use('/public', express.static('public'));

	app.get('/socket.io.js', function(req,res) {
		res.sendFile(req.app.get('path') + '/bin/www/socket.io.js');
	});

	app.get('/socket', function(req,res) {
		res.sendFile(req.app.get('path') + '/bin/www/socket.html');
	});

	app.get('/upload', function(req,res) {
		res.sendFile(req.app.get('path') + '/bin/www/upload.html');
	});

	/* Allow external SCCS files */
	app.get('/*.woff2', function(req,res) {
		res.sendFile(req.app.get('path') + '/public/js/' + req.params[0] + '.woff2');
	});

	app.get('*', function(req,res) {
		// TODO: MINIFY THE HTML AND PUT IT IN PUBLIC
		res.sendFile(req.app.get('path') + '/src/views/index.html');
	});
}
