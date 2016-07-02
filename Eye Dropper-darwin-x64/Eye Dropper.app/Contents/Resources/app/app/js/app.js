const electron = require('electron');
const clipboard = electron.clipboard;
const remote = electron.remote;
const notifier = require('node-notifier');
const path = require('path');

let robot = require('robotjs');

document.querySelector('body').addEventListener('click', () => {
	samplePixel();
});

function samplePixel() {
	let mouse = robot.getMousePos();
	console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);

	let color = robot.getPixelColor(mouse.x, mouse.y)

	console.log("Colour sampled: " + color);
	clipboard.writeText('#' + color);

	notifier.notify({
		title: 'Eye Dropper',
		message: '#' + color + " has been copied to your clipboard",
		sound: false,
	});

	remote.getCurrentWindow().close();
}
