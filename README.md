node-rdp
========

The configuration object can contain the following parameters:

* `address`: address to connect to (defaults to the empty string `''`)
* `username`: username to use for connection (defaults to the empty string `''`)
* `password`: password to use for connection (defaults to the empty string `''`)
* `deleteCredentialsAfter`: deletes credentials and temporary files after disconnection (defaults to `true`)
* `safeMode`: enables a "safe mode" for handling the connection (see [caveats](#caveats)) (defaults to `false`)
* `autoReconnect`: auto-reconnect after an erroneous disconnection (defaults to `true`)
* `fullscreen`: launch as a fullscreen application (defaults to `true`)
* `colors`: color depth in bits (defaults to `32`)
* `compression`: determines if the connection must be compressed (defaults to `true`)
* `connectionType`: the type of the connection, can be one of `'modem'`, `'low'`, `'satellite'`, `'high'`, `'wan'`, `'lan'`, `'auto'` (defaults to `'auto'`)
* `networkAutoDetect`: set some connection parameters automatically depending on the detected network type (defaults to `true`)
* `bandwidthAutoDetect`: set some connection parameters automatically depending on the detected bandwidth type (defaults to `true`)
* `showWallpaper`: show the wallpaper on the remote computer (defaults to `false`)
* `fontSmoothing`: enable font smoothing (defaults to `false`)
* `desktopComposition`: enable desktop composition, useful for Aero (defaults to `false`)
* `showDraggedWindow`: show full window contents while dragging (defaults to `false`)
* `showMenuAnimations`: show menu animations (defaults to `false`)
* `showThemes`: show themes (defaults to `true`)
* `showBlinkingCursor`: show blinking cursor on input controls (defaults to `true`)
* `audioPlayMode`: determine which audio stream is played, can be one of `'local'`, `'remote'`, `'none'` (defaults to `'local'`)
* `audioCaptureMode`: enable capturing audio on the local computer (defaults to `false`)
* `enableLocalPrinters`: enable local printers on the remote computer (defaults to `true`)
* `enableLocalCOMPorts`: enable local COM ports on the remote computer (defaults to `false`)
* `enableSmartCards`: enable local smart cards on the remote computer (defaults to `true`)
* `enableClipboard`: enable clipboard sharing between the local and remote computers (defaults to `true`)
* `enablePlugAndPlayDevices`: determine a subset of Plug And Play devices (separated by a semi-colon `;`) based on the specified HIDs or the wildcard `*` (defaults to the empty string `''`)
* `enableDrives`: determine a subset of local drives (separated by a semi-colon `;`) for use on the remote computer, based on the labels or the wildcard `*` (defaults to the empty string `''`)
* `enablePos`: enable local Point of Service on the remote computer (defaults to `false`)
* `launch`: application to launch upon connection (defaults to the empty string `''`)
* `launchWorkingDirectory`: working directory for the application to be launched upon connection (defaults to the empty string `''`)

The basic usage is shown below:

```javascript
var rdp = require('node-rdp');
 
rdp({
	address: 'terminal.scloud.ru',
	username: 'servicecom\\ipozdnyakov',
	password: 'Aa123123',
	colors: 16,
	fontSmoothing: 0,
	enableLocalPrinters: 1,
	enableLocalCOMPorts: 1,
	enableSmartCards: 0,
	enableClipboard: 1,
	enablePos: 0,
	autoReconnect: 1,
	enableDrives: '*',
	port: '3389',
	
	//launch: '||1cestart (1)',
	//launchPath: '||1cestart (1)',//указать полный путь к программе 
	//launchProgramName: '1С Предприятие 8.3',
	//launchMode: 1,
}).then(function() {
	console.log('At this, point, the connection has terminated.');
});
```
