document.addEventListener('DOMContentLoaded', function() {

    const dates = document.getElementById('dates');
    const start_time = document.getElementById('start_time');
    const end_time = document.getElementById('end_time');
    const anoncheckbox = document.getElementById('anon-checkbox');
    const selected_seat = document.getElementById('selected_seat');


    const reserveButton = document.getElementById('reserve-button');

    reserveButton.addEventListener('click', function() {
        const anon = anoncheckbox.checked ? 'anonymous' : 'not anonymous';
        const data = {
            dates: dates.value,
            start_time: start_time.value,
            end_time: end_time.value,
            anonymous: anon,
            selected_seat: selected_seat.value
        };

        fetch(`/api/labs/reserve/${labId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                alert('Reservation successful');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Reservation failed');
            });
    });


});