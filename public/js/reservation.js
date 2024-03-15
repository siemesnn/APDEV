 
function getSelectedSeat() {
    // Get all radio button elements with the name "selected_seat"
    const seatRadios = document.querySelectorAll('input[name="selected_seat"]:checked');

    // Iterate over the selected radio buttons
    for (const radio of seatRadios) {
        // Return the ID of the selected radio button
        alert(radio.value)
    }

    // Return null if no radio button is selected
    return null;
}


document.getElementById('reserve-button').addEventListener('click', function(event) {
    event.preventDefault(); // This prevents the default form submission
    
    const dates = document.getElementById('dates').value;
    const start_time = document.getElementById('start_time').value;
    const end_time = document.getElementById('end_time').value;
    const lab_id = document.getElementById('lab_id').textContent;
    const selected_seat = getSelectedSeat();
    const anonCheckbox = document.getElementById('anon-checkbox');
    const anon = anonCheckbox.checked ? 'True' : 'False';
    

    // Pass lab_id in the request body
    const requestBody = {
        dates,
        start_time,
        end_time,
        anon,
        selected_seat,
        lab_id
    };


    fetch('/api/labs/reserve/' + lab_id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody) // Pass the requestBody as JSON string
    }).then(response => response.json())
    .then(data => {
        alert("Reservation successful")
        window.location.href = '/home';
    })

});




