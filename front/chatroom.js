window.addEventListener('DOMContentLoaded', async (event) => {
    const sio = io('http://localhost:4000', { transports: ['websocket'] });
    const messageForm = document.getElementById('send-container')
    const messageInput = document.getElementById('message-input')
    const messageContainer = document.getElementById('message-container')

    const getToken = () => localStorage.getItem('token');
    const token = getToken();
    if (!token) {
        window.location.href = 'index.html'
    }
    const getUser = async () => {
        const options = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'auth-token': token
            },
        };
        const res = await fetch('http://localhost:4000/api/user/get-user', options);
        const response = await res.json();
        return response;
    }
    const user = await getUser();
    if (!user) {
        window.location.href = 'index.html'
    }

    sio.on('chat-message', data => {
        console.log('data', data)
        appendMessage(data.message)
    })

    messageForm.addEventListener('submit', e => {
        e.preventDefault()
        const message = messageInput.value
        appendMessage(`${user.username}: ${message}`)
        sio.emit('send-chat-message', message)
        messageInput.value = ''
    })

    const disconnect = () => {
        localStorage.clear()
        window.location.href = "index.html"
    }

    function appendMessage(message) {
        console.log('message', message)
        const messageElement = document.createElement('div')
        messageElement.innerText = message
        messageContainer.append(messageElement)
    }
})