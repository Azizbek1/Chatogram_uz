$chat2__form_btn = $('.chat2__form_btn');
$chat2__from_control = $('.form-control');
const chat__messages = document.querySelector('.chat__messages');
const roomName = document.querySelector('#room_name');
const roomUsers = document.querySelector('#users');
const socket = io();

// Username bilan room ni kalitlarini oldik 
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// console.log(username, room);


socket.emit("joinRoom", {username, room});


// hona va foydalanuvchilar 
socket.on("roomUser", ({room, users}) => {
    outputRoom(room);
    outputUsers(users);
})


socket.on("message", (data) => {
    outputMessage(data)
    // console.log(data);
    scroll();
})

$chat2__form_btn.on('click', (e) => {
    e.preventDefault();
    const msg = $chat2__from_control.val();
    // console.log(msg);

    socket.emit("chatMessage", msg);
    $chat2__from_control.val("");
    scroll();
   
})
  // Scroll 
function scroll() {
    chat__messages.scrollTop = chat__messages.scrollHeight;
}  

function outputMessage (message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
        <div class="meta">
            <span class="meta__time"> ${message.time} </span>
            <span class="meta__username"> ${message.username} </span>
            <div class="meta__text"> ${message.text} </div>
        </div>
    `;
    document.querySelector(".chat__messages").appendChild(div);
    
}

// Honani frontga chiqarish
function outputRoom (room) {
    roomName.innerText =  room;
// roomUsers
}
function outputUsers(users) {
    roomUsers.innerHTML = `
        ${users.map(user => `<li> ${user.username} </li>`).join('')}
    `
}