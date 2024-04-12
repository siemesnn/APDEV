document.addEventListener('DOMContentLoaded', () => {
   
    const edit_form = document.getElementById('edit_form');
    const update = document.getElementById('reserve-button');

    function getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const labId = urlParams.get('labId');
        const seatNumber = urlParams.get('seatNumber');
        return { labId, seatNumber };
    }

    const { labId, seatNumber } = getUrlParams();
    


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


    update.addEventListener('click', async (e) => {
        e.preventDefault();

        const date = document.getElementById('dates').value
        const start_time = document.getElementById('start_time').value
        const end_time = document.getElementById('end_time').value



        const response = await fetch('/api/labs/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ labId: labId, date: date.value, start_time: start_time, end_time: end_time, seatNumber: seatNumber })
        });

        if (response.ok) {
            alert("Woohoo")
        }else {
            console.log(response)
        }

    });


});