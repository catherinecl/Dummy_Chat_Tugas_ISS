const io = require("socket.io-client"); 
const readline = require("readline");

const socket = io("http://localhost:3000") // untuk koneksi client sm server harus seperti ini

//set up readline untuk interface di terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
});

let username = "";

socket.on("connect", () => {
    console.log("Connected to the server");

    rl.question("Enter your username: ", (input) => {
        username = input;
        console.log(`Welcome, ${username} to the chat`)
        rl.prompt();

        rl.on("line", (message) =>{
            if(message.trim()){
                socket.emit("message", {username, message}) // mengirim pesan melalui web socket
            }
            rl.prompt();
        });
    }); 
});

// akan tertrigger tiap orang kirim di channel message
socket.on("message", (data) => {
    const {username: senderUsername, message: senderMessage} = data;

    if(senderUsername != username){
        console.log(`${senderUsername}: ${senderMessage}`);
        rl.prompt();
    }
})

// ter trigger kalau yg server di disconnect
socket.on("disconnect", () => {
    console.log("Server disconnected, Exiting...");
    rl.close();
    process.exit(0);
});

//kalo pencet control+c bisa close socket yg terbuka sekali saja
rl.on("SIGINT", () => {
    console.log("\nExisting...");
    socket.disconnect();
    rl.close;
    process.exit(0);
});


