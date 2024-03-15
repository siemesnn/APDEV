document.addEventListener('DOMContentLoaded', function() {
    function handleReservation(event) {
        event.preventDefault(); // Prevent default form submission
    
        // Extract data from the form
        const dates = document.getElementById('dates').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        console.log(dates)
 
        // You can also extract other form data if needed
    
        // Perform AJAX request to submit the reservation data
        // Example using fetch API
        fetch('/api/labs/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Assuming you're sending JSON data
            },
            body: JSON.stringify({ dates, start_time: startTime, end_time: endTime })
        })
        .then(response => {
            if (response.ok) {
                // Reservation successful, handle response as needed
                // For example, show a success message to the user
                alert('Reservation successful!');
            } else {
                // Reservation failed, handle error response
                // For example, show an error message to the user
                alert('Reservation failed!');
            }
        })
        .catch(error => {
            // Error occurred during the request, handle accordingly
            console.error('Error:', error);
            alert('Reservation failed due to an error!');
        });
    }
    
})