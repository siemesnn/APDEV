document.addEventListener('DOMContentLoaded', () => {
  
    const editRes = document.getElementById('editReservationButton');
    const deleteRes = document.getElementById('cancelReservationButton');

 // Attach event listener to the delete button
deleteRes.addEventListener('click', async (e) => {
    e.preventDefault();

    // Retrieve selected row data
    const rowData = getSelectedRowData();

    const lab_id = rowData.lab_id
    const seatNumber = rowData.seatNumber
    const date = rowData.date
    const start_time = rowData.start_time
    const end_time = rowData.end_time
    const username = rowData.reserved_by

    console.log(lab_id, seatNumber,date, start_time, end_time, username)

    if (!rowData) {
        alert("Please select a reservation to delete");
        return;
    }
    try {
        const response = await fetch('/api/labs/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({lab_id, seatNumber, date, start_time, end_time, username}) // Send the entire rowData object as JSON
        });

        if (response.ok) {
            // Handle successful deletion
            alert("Reservation successfully cancelled!");
            // Optionally, you can redirect or reload the page after successful deletion
            window.location.reload();
        } else {
            // Handle error response
            const errorMessage = await response.text();

            console.log(rowData)

            alert(`Failed to cancel reservation: ${errorMessage}`);
        }
    } catch (error) {
        // Handle network errors or other exceptions
        console.error('Error occurred while cancelling reservation:', error);
        alert('An error occurred while cancelling reservation. Please try again later.');
    }
});

    
    
    // Function to retrieve data from the selected row
    function getSelectedRowData() {
    // Get all the rows in the table
    var rows = document.querySelectorAll(".reservations-table tbody tr");
   
    const editReservationButton = document.getElementById('editReservationButton')
     
    editReservationButton.addEventListener('click', function() {
        // Find the selected row
        const selectedRow = document.querySelector(".selected");
          
        // Check if a row is selected
        if (selectedRow) {
            // Retrieve data from the selected row
            return {
                date: selectedRow.cells[2].textContent,
                start_time: selectedRow.cells[3].textContent,
                end_time: selectedRow.cells[4].textContent,
                lab_id: selectedRow.cells[0].textContent,
                reserved_by: selectedRow.cells[5].textContent.trim(),
                seatNumber: selectedRow.cells[1].textContent,
            };
        } else {
            // If no row is selected, return null
            return null;
        }
    }

    // Event listener for the edit reservation button
    editReservationButton.addEventListener('click', function() {
        // Retrieve selected row data
        const rowData = getSelectedRowData();

        // Check if a row is selected
        if (rowData) {
            // Log the data
            console.log(rowData);

            // Now you can use rowData for further processing like editing the reservation
        } else {
            alert("Please select a reservation to edit");
        }
    });

    // Get all the rows in the table
    const rows = document.querySelectorAll(".reservations-table tbody tr");

    // Event listener for each row
    rows.forEach(function(row) {
        row.addEventListener('click', function() {
            // Remove the 'selected' class from all rows
            rows.forEach(function(row) {
                row.classList.remove("selected");
            });
            
            // Add the 'selected' class to the clicked row
            row.classList.add("selected");

            // Retrieve data from the selected row
            const rowData = {
                lab_id: row.cells[0].textContent,
                seatNumber: row.cells[1].textContent,
                date: row.cells[2].textContent,
                start_time: row.cells[3].textContent,
                end_time: row.cells[4].textContent,
                reservationName: row.cells[5].textContent
            };

            // Now you can use rowData for further processing like editing or deleting the reservation
        });
    });

        // Event listener for the edit reservation button
editReservationButton.addEventListener('click', function() {
    // Retrieve selected row data
    const rowData = getSelectedRowData();

    // Check if a row is selected
    if (rowData) {
        // Redirect to the edit reservation page with query parameters
        window.location.href = `/editReservation/${rowData.lab_id}/${rowData.seatNumber}/${rowData.date}/${rowData.start_time}/${rowData.end_time}/${rowData.reserved_by}`;

    } else {
        alert("Please select a reservation to edit");
    }
});

});
