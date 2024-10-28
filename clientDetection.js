const io = require("socket.io-client"); 
const readline = require("readline");
const crypto = require("crypto");  // Import crypto module

const socket = io("http://localhost:3000");

// Set up readline for terminal interface
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
        console.log(`Welcome, ${username} to the chat`);
        rl.prompt();

        rl.on("line", (message) => {
            if (message.trim()) {
                const checksum = crypto.createHash('sha256').update(message).digest('hex');
                socket.emit("message", { username, message, checksum});
            }
            rl.prompt();
        });
    });
});

socket.on("message", (data) => {
    const { username: senderUsername, message: senderMessage, checksum} = data;

    if (senderUsername !== username) {
        // Calculate hash to verify integrity
        const calculatedHash = crypto.createHash('sha256').update(senderMessage).digest('hex');

        if (calculatedHash === checksum) {
            console.log(`${senderUsername}: ${senderMessage}`);
        } else {
            console.log(`Warning: Message from ${senderUsername} may have been modified!`);
            console.log(`${senderUsername}: ${senderMessage}`);
        }
        
        rl.prompt();
    }
});

socket.on("disconnect", () => {
    console.log("Server disconnected, Exiting...");
    rl.close();
    process.exit(0);
});

rl.on("SIGINT", () => {
    console.log("\nExiting...");
    socket.disconnect();
    rl.close();
    process.exit(0);
});
