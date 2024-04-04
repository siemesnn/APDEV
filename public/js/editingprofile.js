document.addEventListener('DOMContentLoaded', () => {
   
    const description = document.getElementById('descriptionInput');
    const pictureURL = document.getElementById('pictureURLInput');
    const save = document.getElementById('saveChanges');

    save.addEventListener('click', async (e) => {
        e.preventDefault();
        const response = await fetch('/api/users/editDescription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: description.value })
        });

        if (response.ok) {
            alert("Description updated successfully");
            window.location.href = '/profile';
        } else {
            alert("Failed to update description");
        }

        const response_profilepic = await fetch('/api/users/editPFP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pictureURL: pictureURL.value })
        });

        if (response_profilepic.ok) {
            alert("Profile picture updated successfully");
        }

    });


});