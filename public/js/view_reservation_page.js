document.addEventListener('DOMContentLoaded', () => {

    // Get all the rows in the table
    var rows = document.querySelectorAll(".reservations-table tbody tr");

    const editReservationButton = document.getElementById('editReservationButton')

    editReservationButton.addEventListener('click', function() {
        // Find the selected row
        const selectedRow = document.querySelector(".selected");

        // Check if a row is selected
        if (selectedRow) {
            // Retrieve data from the selected row
            var rowData = {
                lab_id: selectedRow.cells[0].textContent,
                seatNumber: selectedRow.cells[1].textContent,
                date: selectedRow.cells[2].textContent,
                start_time: selectedRow.cells[3].textContent,
                end_time: selectedRow.cells[4].textContent,
                reservationName: selectedRow.cells[5].textContent
            };

            // Log the data
            console.log(rowData);

            // Now you can use rowData for further processing like editing the reservation
        } else {
            alert("Please select a reservation to edit");
            // Log each data

        }
    });

    // Add event listener to each row
    rows.forEach(function(row) {
        row.addEventListener('click', function() {
            // Remove the 'selected' class from all rows
            rows.forEach(function(row) {
                row.classList.remove("selected");
            });
            
            // Add the 'selected' class to the clicked row
            row.classList.add("selected");

            // Retrieve data from the selected row
            var rowData = {
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
});
