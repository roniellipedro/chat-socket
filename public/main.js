const socket = io();

let username = '';
let userList = [];

let pageLogin = document.querySelector('#pageLogin');
let pageChat = document.querySelector('#pageChat');

let inputNameLogin = document.querySelector('#inputNameLogin');
let inputTextChat = document.querySelector('#inputTextChat');

pageLogin.style.display = 'flex';
pageChat.style.display = 'none';

function renderUserList() {
    let div = document.querySelector('.pageChatAreaUserList');
    div.innerHTML = '';

    userList.forEach(i => {
        div.innerHTML += `<div>${i}</div>`;
    });
}

inputNameLogin.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        let name = inputNameLogin.value.trim();
        if (name != '') {
            username = name;
            document.title = `Chat (${username})`;
            socket.emit('join-request', username);
        }
    }
})

socket.on('user-ok', (connectedUsers) => {
    pageLogin.style.display = 'none';
    pageChat.style.display = 'flex';
    inputTextChat.focus();

    userList = connectedUsers;
    renderUserList();
})
