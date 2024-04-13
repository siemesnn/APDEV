
document.addEventListener('DOMContentLoaded', () => {
    const register = document.getElementById('register-form');

    register.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Submit the form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confPass = document.getElementById('confPassword').value; 
        const role = document.getElementById('role').value;

        // Check if the password and confirm password fields match
        if (password !== confPass) {
            alert("Passwords do not match!");
            return;
        }

        // Check if email is valid it should be @dlsu.edu.ph ending ONLY
        if (email.slice(-12) !== "@dlsu.edu.ph") {
            alert("Email is not a valid DLSU email address!");
            return;
        }

        // Console log each 
        console.log(name, email, username, password, confPass, role);

        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    confirmPassword: confPass,
                    role: role
                }
            )
        })
        .then(response => {
            if (response.ok) {
                alert("Registration successful!");
                window.location.href = '/';
            } else {
                alert("Registration failed. Please try again.");
            }
        })
        .catch(
            console.log("Error occurred while registering.")
        )
    });
});