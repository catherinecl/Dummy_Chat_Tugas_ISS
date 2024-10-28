const http = require("http"); // server pakai library http
const socketIO = require("socket.io");

const server = http.createServer();
const io = socketIO(server); //web server yg sudah ada koneksi socketio

// akan ter-trigger saat ada koneksi dari client
io.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected`); // untuk membedakan client 1 dengan yg lain

    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} disconnected`)
    })

    // buat channel
    socket.on("message", (data) => {
        let {username, message, checksum} = data;
        console.log(`Receiving message from ${username}: ${message}`);

        // message = message + "(modified by server)";

        io.emit("message", {username, message, checksum}); //server nerima data kirim kembali ke client dengan cara broadcast
    });
});


const port = 3000;
server.listen(port, () =>{
    console.log(`Server running on port ${port}`)
}); //mendengarkan semua request yg port nya 3000
