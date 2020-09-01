const socketio = require('socket.io');
const moment = require("moment");
const io = socketio();

const users = [];

io.sockets.on("connection", (socket) => {
    console.log("Foydalanuvchi kirdi");
    const bot = "SERVEDAN";

    socket.on("joinRoom", ({ username, room})=> {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room)

        socket.emit("message", formatMessage(bot, "Hush kelibsiz Chatogramga"));
        /* Brocast */
        socket.broadcast.to(user.room).emit("message", formatMessage("USER", `${user.username} foydalanuvchi bog'landi`));


        // foydalamuvchilarni honaga yuborish     
        io.to(user.room).emit("roomUser", {
            room: user.room,
            users: getRoomUsers(user.room)
        })


    })
    
    socket.on("chatMessage", (msg) => {
        const user = getUser(socket.id);
         io.to(user.room).emit("message", formatMessage(user.username, msg))   
    })

    /* disconect */
    socket.on("disconnect", () => {
        const user = userExit(socket.id);
        if(user){
            io.to(user.room).emit("message", formatMessage(bot, `${user.username} Foydalanuvchi chatni tark qildi`))
            
            // foydalamuvchilarni honaga yuborish    
            io.to(user.room).emit("roomUser", {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })

})

// Voxtlari 
function formatMessage(username, text) {
    return {
        username,
        text, 
        time: moment().format('h:mm a')
    }
}

// Jatga kirgan foydalanuvchi
function userJoin(id, username, room){
    const user = {id, username, room};
    users.push(user);
    return user;
}

// hodagini aydisi 
function getUser(id) {
    return users.find(user => user.id === id )
}

// foydalanuvchi tark qilganda 
function userExit (id) {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// foydalanuvchi honaga kirganda 
function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = io