var buildRdpFile = require('./rdp-file');
var rdpConnect = require('./rdp-connect');

function rdp(config) {
	return buildRdpFile(config).then(function(filePath) {
		return rdpConnect(config, filePath);
    });
}

module.exports = rdp;