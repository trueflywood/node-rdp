'use strict';

var fs = require('fs');
var childProcess = require('child_process');
var spawnSync = childProcess.spawnSync;
const { spawn } = require('child_process');

function deleteRdpCredentials(ip) {
	let promise = new Promise((resolve, reject) => {
		const ls = spawn('cmdkey.exe', ['/delete:TERMSRV/' + ip]);

		ls.on('close', (code) => {
			resolve();
		});
		ls.on('error', (code) => {
			reject('Error cmdkey.exe delete');
		});
	});
	return promise;
}

//асторизация
function storeRdpCredentials(ip, username, password) {
	ip = ip.replace(/:.*/g, '');
	let promise = new Promise((resolve, reject) => {
		const ls = spawn('cmdkey.exe', ['/generic:TERMSRV/' + ip, '/user:' + username, '/pass:' + password]);

		ls.on('exit', (code) => {
			resolve();
		});
		ls.on('error', (code) => {
			reject('Error cmdkey.exe create');
		});
	});
	return promise;
}

function deleteRdpFile(filePath) {
	let promise = new Promise((resolve, reject) => {
		fs.unlinkSync(filePath, function (err) {
			if (err) reject(err);
			resolve();
		});
	});
	return promise;
}

function cleanup(config, filePath) {
	let promise = Promise.resolve();
	if (typeof(config.deleteCredentialsAfter) === 'undefined' || config.deleteCredentialsAfter === true) {
		promise = promise.then(() => {
			return deleteRdpCredentials(config.address);
		});
	}
	promise = promise.then(() => {
		return deleteRdpFile(filePath);
	});
	return promise;
}

function rdpConnect(config, filePath) {
	// update the latest RDP credentials for the connection
	let proc = null;
	let promise = Promise.resolve().then(() => {
		return deleteRdpCredentials(config.address);
	}).then(() => {
		return storeRdpCredentials(config.address, config.username, config.password);
	}).then(() => {
		return new Promise((resolve, reject) => {
			proc = spawn('mstsc.exe', [filePath, '/v', config.address]);
			proc.on('exit', function() {
				resolve();
			});
			proc.on('error', (code) => {
				reject('Error mstsc.exe create');
			});
		});
	}).then(() => {
		//TODO: комманда mstsc.exe не имеет сигнала о завершение. То есть она завершаеться сразу, после начала работы.
		setTimeout(function() {
		  cleanup(config, filePath);
		}, 5000);
	}).catch((err) => {
		cleanup(config, filePath);
		if(proc) {
			if (!proc.killed) {
				proc.kill();
			}
		}
	});
	return promise;
}

module.exports = rdpConnect;
