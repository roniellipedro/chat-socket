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

function addMessage(type, user, msg) {
    let div = document.querySelector('.pageChatAreaChatList');

    switch (type) {
        case 'status':
            div.innerHTML += `<div class="system-message">${msg}</div>`;
            break;
        case 'msg':
            div.innerHTML += `<div class="user-message"><span>${user}: </span>${msg}</div>`;
            break;
    }
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

inputTextChat.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        let txt = inputTextChat.value.trim();
        inputTextChat.value = '';
        if (txt != '') {
            addMessage('msg', username, txt);
            socket.emit('send-msg', txt);
        }
    }
})

socket.on('user-ok', (connectedUsers) => {
    pageLogin.style.display = 'none';
    pageChat.style.display = 'flex';
    inputTextChat.focus();

    addMessage('status', null, 'Conectado!');

    userList = connectedUsers;
    renderUserList();
})

socket.on('list-update', (data) => {
    if (data.joined) {
        addMessage('status', null, `${data.joined} entrou no chat`);
    }

    if (data.left) {
        addMessage('status', null, `${data.left} saiu do chat`);
    }

    userList = data.list;
    renderUserList();
})

socket.on('show-msg', (data) => {
    addMessage('msg', data.username, data.message);
})
