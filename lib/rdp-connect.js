'use strict';

var fs = require('fs');

function deleteRdpCredentials(ip) {
    let promise = new Promise((resolve, reject) => {
        const ls = window.require('child_process').spawn('cmdkey.exe', ['/delete:TERMSRV/' + ip]);

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
        const ls = window.require('child_process').spawn('cmdkey.exe', ['/generic:TERMSRV/' + ip, '/user:' + username, '/pass:' + password]);

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
    if (typeof (config.deleteCredentialsAfter) === 'undefined' || config.deleteCredentialsAfter === true) {
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
    let promise = Promise.resolve().then(() => {
        return deleteRdpCredentials(config.address);
    }).then(() => {
        return storeRdpCredentials(config.address, config.username, config.password);
    }).then(() => {
        return new Promise((resolve, reject) => {
            const spawnOptions = {
                detached: true,
                stdio: 'ignore',
                windowsHide: true
            };

            try {
                window.require('child_process').spawn(
                    'mstsc.exe',
                    [filePath, '/v', config.address],
                    spawnOptions).unref();
                // TODO: комманда mstsc.exe не имеет сигнала о завершение. То есть она завершаеться сразу, после начала работы.
                setTimeout(function () {
                    cleanup(config, filePath);
                    resolve();
                }, 5000);
            } catch (error) {
                reject('Error mstsc.exe create');
            }
        });
    }).catch((err) => {
        cleanup(config, filePath);
    });
    return promise;
}

module.exports = rdpConnect;
