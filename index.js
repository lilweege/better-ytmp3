// miscellaneous functions
const ts = () => {
	let t = new Date(Date.now());
	return `${t.getFullYear()}-${nf(t.getMonth())}-${nf(t.getDate())} ${nf(t.getHours())}:${nf(t.getMinutes())}:${nf(t.getSeconds())}`;
};
const nf = (n) => n.toString().padStart(2, '0');

const deleteFolderRecursive = (path) => {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach((file, index) => {
			var curPath = path + "/" + file;
			if (fs.lstatSync(curPath).isDirectory()) {
				deleteFolderRecursive(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};


// setup server
const express = require('express')
const app = express()
const http = require('http');
const serv = http.Server(app);
const fs = require('fs');
const port = process.env.PORT || 8080;
const spawn = require("child_process").spawn;
const location = '/public';
const d = "dl";

app.get('/', (req, res) => {
	res.sendFile(__dirname + location + '/index.html');
});
app.get(`/${d}/`, (req, res) => {
	res.download(`./${d}.zip`);
});

app.use(location, express.static(__dirname + location));
serv.listen(port);
console.log(`🖥 [${ts()}]: Server running on port ${port}.`);


const io = require("socket.io") (serv, {});

io.sockets.on("connection", (socket) => {
	console.log(`✔ [${ts()}]: ${socket.id} connected.`);

	socket.on("disconnect", () => {
		console.log(`❌ [${ts()}]: ${socket.id} disconnected.`);
	});

	socket.on("downloadRequest", (playlists) => {

		const py = spawn('python', ['-u', './pyt/test.py', d].concat(playlists));

		py.stdout.on('data', (data) => {
			socket.emit("downloadUpdate", data.toString());
		});

		py.stderr.on('data', (data) => {
			socket.emit("downloadUpdate", "An error has occured: " + data);
		});

		py.stdout.on('end', () => {
			socket.emit("downloadFinish", d);
			deleteFolderRecursive(`./${d}`);
		});
	});
});
