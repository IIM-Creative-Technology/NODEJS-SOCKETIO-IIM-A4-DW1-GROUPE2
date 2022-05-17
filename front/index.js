async function signup() {
    const userElement = document.getElementById('username-signup');
    const passwordElement = document.getElementById('password-signup');
    const user = userElement.value;
    const password = passwordElement.value;
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: user,
            password
        })
    };

    const res = await fetch('http://localhost:4000/api/auth/signup', options)
    const { response } = await res.json();
    console.log('response', response)
    if (response) {
        localStorage.setItem('token', response);
        window.location.href = "chatroom.html";
    }
}

async function login() {
    const userElement = document.getElementById('username');
    const passwordElement = document.getElementById('password');
    const user = userElement.value;
    const password = passwordElement.value;

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: user,
            password
        })
    };

    const res = await fetch('http://localhost:4000/api/auth/login', options)
    const { response } = await res.json();
    if (response.token) {
        localStorage.setItem('token', response.token);
        window.location.href = "chatroom.html";
    }
}

const disconnect = () => {
    localStorage.clear()
    window.location.href = "index.html"
}

const getToken = () => localStorage.getItem('token');
