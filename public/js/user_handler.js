document.addEventListener('DOMContentLoaded', () => {
    const logout = document.getElementById('logout')
    .addEventListener('click', async (e) => {
        e.preventDefault();
        const response = await fetch('/api/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            window.location.href = '/';
        } else {
            alert("Failed to logout");
        }
    });
});