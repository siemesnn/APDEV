 
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



// Function to generate date options for the next 7 days
function generateDateOptions() {
    const select = document.getElementById('dates');
    const today = new Date();

    for (let i = 0; i < 8; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const option = document.createElement('option');
        option.value = date.toISOString().split('T')[0];
        option.textContent = date.toDateString();
        select.appendChild(option);
    }
}

// Function to generate time options with 1-hour intervals for start time and 30-minute intervals for end time
function generateTimeOptions() {
    const selectStartTime = document.getElementById('start_time');
    const selectEndTime = document.getElementById('end_time');

    const startTime = new Date();
    startTime.setHours(8, 0, 0); // Set start time to 8:00 AM

    const endTime = new Date();
    endTime.setHours(18, 0, 0); // Set end time to 6:00 PM

    const intervalStart = 60 * 60 * 1000; // 1 hour in milliseconds
    const intervalEnd = 30 * 60 * 1000; // 30 minutes in milliseconds

    while (startTime < endTime) {
        // Add start time option
        const startOption = document.createElement('option');
        startOption.value = startTime.toTimeString().split(' ')[0];
        startOption.textContent = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        selectStartTime.appendChild(startOption);

    // Check if adding another interval will exceed the end time
    if (startTime.getTime() + intervalEnd <= endTime.getTime()) {
        // Add end time option
        const endTimeAdjusted = new Date(startTime.getTime() + intervalEnd);
        const endOption = document.createElement('option');
        endOption.value = endTimeAdjusted.toTimeString().split(' ')[0];
        endOption.textContent = endTimeAdjusted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        selectEndTime.appendChild(endOption);
    }

    // Move to the next hour for start time
    startTime.setTime(startTime.getTime() + intervalStart);

    // Convert start time and end time 
}
}

generateDateOptions();
generateTimeOptions();

// Declare global variable to store last clicked seat ID
let lastClickedSeatId = null;

// Function to toggle seat status
function toggleSeatStatus(seatId) {
    const seat = document.getElementById(seatId);

    // Check if the seat is available and not taken
    if (seat.src.endsWith('available.png') && !seat.src.endsWith('taken.png')) {
        // Deselect the previously selected seat if any
        if (lastClickedSeatId !== null) {
            const previousSelectedSeat = document.getElementById(lastClickedSeatId);
            previousSelectedSeat.src = '/assets/available.png';
        }
        // Set lastClickedSeatId to the current seatId
        lastClickedSeatId = seatId;
        // Change image to selected.png
        seat.src = '/assets/selected.png';
    } else if (seat.src.endsWith('selected.png')) {
        // Deselect the seat if it is already selected
        lastClickedSeatId = null;
        // Change image back to available.png
        seat.src = '/assets/available.png';
    }
    // Update the value of the hidden input field with the ID of the last clicked seat
    document.getElementById('selected-seat').value = lastClickedSeatId || '';
}

//Function to show the pop up
function showPopup(seatId) {
    const popup = document.getElementById(`popup-${seatId}`);
    popup.style.display = 'block' ? 'none' : 'block';
}

// Function to hide popup
function hidePopup(seatId) {
    const popup = document.getElementById(`popup-${seatId}`);
    popup.style.display = 'none';
}

function navigateTo(url) {
    window.location.href = url;
}
 //when button is hovered, background color changes
document.querySelector('.reserve-button').addEventListener('mouseover', function() {
this.style.backgroundColor = 'light';
});

document.querySelector('.reserve-button').addEventListener('mouseout', function() {
this.style.backgroundColor = '';
}); 


document.addEventListener('DOMContentLoaded', () => {
    // Fetch request to retrieve the lab details 

    const reserve_button = document.querySelector('.reserve-button');

    reserve_button.addEventListener('click', async (e) => {
        const selected_seat = lastClickedSeatId;
        const date = document.getElementById('dates').value;
        let start_time = document.getElementById('start_time').value;
        let end_time = document.getElementById('end_time').value;


        start_time = start_time.split(':').slice(0, 2).join(':');
        end_time = end_time.split(':').slice(0, 2).join(':');

        const labId = document.getElementById('lab_id').textContent;

        const seatNumber = parseInt(selected_seat);
        
        // log all the values
        console.log('Lab ID:', labId);
        console.log('Date:', date);
        console.log('Start Timsdaasde:', start_time);
        console.log('End Timesdasd:', end_time);
        console.log('Selected Seat:', seatNumber);

        // fetch request /api/labs/reserve/:labId
        const response = await fetch(`/api/labs/reserve/${labId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, start_time, end_time, seatNumber })
        });

        // Check if the reservation was successful
        if (response.ok) {
            // Redirect to the home page
            alert("Reservation successful");
            window.location.href = '/home';
        } else {
            // Handle errors or show a message to the user
            const data = await response.json();
            alert(data.message);
        }
    });
});


