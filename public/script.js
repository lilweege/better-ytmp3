let socket = io();
let startTime;

const addLineToDiv = (info, dest) => {
	let div = document.createElement('div');
	div.innerHTML = info + "\n";
	document.getElementById(dest).appendChild(div);
}

document.getElementById("download").addEventListener("click", () => {
	startTime = new Date(Date.now());
	let out = document.getElementById("playlists").value.split("\n");
	socket.emit("downloadRequest", out);
	document.getElementById("info").innerHTML = "Starting.\n";
});

socket.on("downloadUpdate", (data) => {
	addLineToDiv(data, "info");
});

socket.on("downloadFinish", (dir) => {
	addLineToDiv(`Finished in ${(new Date(Date.now()) - startTime)/1000} secs.`, "info");
	window.location.href = window.origin + `/${dir}`;
});
