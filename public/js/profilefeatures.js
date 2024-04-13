document.addEventListener('DOMContentLoaded', () => {
   
function navigateTo(url) {
    window.location.href = url;
}

// Get a reference to the button
const deleteAccountButton = document.getElementById("deleteAccountButton");

// Add event listener to the button
deleteAccountButton.addEventListener("click", async function() {
// Show the confirmation dialog
const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");

// If the user confirms, proceed with account deletion
if (confirmed) {
    try {
        // Make an AJAX request to the backend route that deletes reservations associated with the user
        const reservationResponse = await fetch('/api/labs/deleteUserRes', {
            method: 'DELETE'
        });

        // Check if the reservation deletion was successful
        if (reservationResponse.ok) {
            // If reservation deletion is successful, delete the user account
            const accountResponse = await fetch('/api/users/delete', {
                method: 'DELETE'
            });

            // Check if the account deletion was successful
            if (accountResponse.ok) {
                alert("Your account and all associated reservations have been deleted.");
                window.location.href = '/';
                 // Temporary alert for demonstration
            } else {
                alert("Failed to delete your account. Please try again later.");
            }
        } else {
            alert("Failed to delete reservations associated with your account. Please try again later.");
        }

    } catch (error) {
        console.error("Error occurred while deleting account:", error);
        alert("An error occurred while deleting your account. Please try again later.");
    }
} else {
    alert("Account deletion canceled.");
}
});


const changePasswordButton = document.getElementById("changePasswordButton");
const passwordChangeModal = document.getElementById("passwordChangeModal");
const newPasswordInput = document.getElementById("newPasswordInput");
const confirmPasswordChangeButton = document.getElementById("confirmPasswordChangeButton");
const cancelPasswordChangeButton = document.getElementById("cancelPasswordChangeButton");
const closePasswordChangeModal = document.getElementById("closePasswordChangeModal");

changePasswordButton.addEventListener("click", function() {
    passwordChangeModal.style.display = "block";
});

closePasswordChangeModal.addEventListener("click", function() {
    passwordChangeModal.style.display = "none";
});

cancelPasswordChangeButton.addEventListener("click", function() {
    passwordChangeModal.style.display = "none";
});

confirmPasswordChangeButton.addEventListener("click", function() {
    const newPassword = newPasswordInput.value;
    if (newPassword.trim() === "") {
        alert("Please enter a valid password.");
        return;
    }
    // Here you can perform password change logic
    // For demonstration, we're just showing an alert
    alert("Password changed successfully.");
    passwordChangeModal.style.display = "none";
    // You can also clear the input field if needed
    newPasswordInput.value = "";
})
});
