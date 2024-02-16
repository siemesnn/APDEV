document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        // Create POST request to /api/users/login
        // NANA WAS HERE HEHEHEHEHEHEHHE
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username.value, password: password.value })
        })
        // If response is status 200, redirect to /home
        .then(response => {
            if (response.status === 200) {
                window.location.href = `/home?username=${encodeURIComponent(username.value)}`;
            } else {
                alert('Invalid username or password');
                window.location = '/';
            }
        }).catch(error => {
            console.error(error);
        });
    });
})