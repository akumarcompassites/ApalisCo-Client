
const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const server = express();

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (let key in envConfig) {
	if (Object.prototype.hasOwnProperty.call(envConfig, key)) {
		process.env[key] = envConfig[key];
	}
}

const port = Number(process.env.PORT || '8080');
const distPath = path.resolve(__dirname, 'dist');

if (process.env.NODE_ENV !== 'production') {
	const webpack = require('webpack');
	const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.config'); // include here dev webpack config file
	const compiler = webpack(config);
	server.use(webpackDevMiddleware(compiler, {
			noInfo: true,
			publicPath: config.output.publicPathdist
		}
	));
	server.use(webpackHotMiddleware(compiler));
}
server.use(express.static(distPath));

server.get('*', function(req, res) {
  res.sendFile(path.join(distPath, 'index.html'));
});

server.listen(port, () => {
	console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
