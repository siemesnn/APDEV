function generateMonthName(year, month) {
    const header = document.createElement('h2');
    header.innerHTML = `${getMonthName(month)} ${year}`;
    return header;
  }

  // Function to generate the calendar table
  function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const table = document.createElement('table');
    const header = table.createTHead();
    const row = header.insertRow();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let day of daysOfWeek) {
      const cell = document.createElement('th');
      cell.innerHTML = day;
      row.appendChild(cell);
    }

    const body = table.createTBody();
    let date = 1;

    for (let i = 0; i < 6; i++) {
      const row = body.insertRow();

      for (let j = 0; j < 7; j++) {
        const cell = row.insertCell();
        if (i === 0 && j < firstDay.getDay()) {
          // Add empty cells before the first day
          continue;
        }
        if (date > daysInMonth) {
          // Stop creating cells once all days are added
          break;
        }
        cell.innerHTML = date;
        cell.addEventListener('click', function () {
          // Redirect to dynamically generated page with the selected date
          window.location.href = `/dynamicPage?year=${year}&month=${month + 1}&day=${date}`;
        });
        date++;
      }
    }

    return table;
  }

  // Function to show the calendar for a specific year and month
  function showCalendar(year, month) {
    const monthNameContainer = document.getElementById('monthNameContainer');
    monthNameContainer.innerHTML = ''; // Clear previous month name
    monthNameContainer.appendChild(generateMonthName(year, month));

    const calendarContainer = document.getElementById('calendarContainer');
    calendarContainer.innerHTML = ''; // Clear previous calendar
    const calendar = generateCalendar(year, month);
    calendarContainer.appendChild(calendar);
  }

  // Function to get the month name
  function getMonthName(month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
  }

  // Initialization
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  showCalendar(currentYear, currentMonth);
