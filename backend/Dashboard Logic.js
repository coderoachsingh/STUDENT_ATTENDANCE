document.addEventListener('DOMContentLoaded', () => {
  const subjectSelect = document.getElementById('subject');
  const dateSelect = document.getElementById('date');
  const loadStudentsBtn = document.getElementById('loadStudents');
  const studentTableContainer = document.getElementById('studentTableContainer');
  const studentTableBody = document.getElementById('studentTable');
  const submitAttendanceBtn = document.getElementById('submitAttendance');

  // Your backend server's address.
  // Make sure your server.js is running.
  const API_BASE_URL = 'http://localhost:5500/api';

  /**
   * 1. LOAD STUDENTS LOGIC
   * Fetches student attendance for a given subject and date from the backend.
   */
  loadStudentsBtn.addEventListener('click', async () => {
    const subject = subjectSelect.value;
    const date = dateSelect.value;

    if (!subject || !date) {
      alert('Please select both a subject and a date.');
      return;
    }

    // Show a loading message while fetching data
    studentTableContainer.classList.remove('hidden');
    studentTableBody.innerHTML = '<tr><td colspan="3">Loading students...</td></tr>';

    try {
      // Call the backend API to get the student list
      const response = await fetch(`${API_BASE_URL}/attendance?subject=${encodeURIComponent(subject)}&date=${date}`);
      
      if (!response.ok) {
        throw new Error(`The server responded with an error: ${response.status}`);
      }

      const students = await response.json();
      
      studentTableBody.innerHTML = ''; // Clear the table before adding new rows

      // If no records exist, it might be the first time marking for this day.
      if (students.length === 0) {
        alert('No attendance has been marked for this day yet. Loading all students for this subject.');
        // You would typically fetch all students enrolled in the subject here.
        // For now, we'll just show a message.
        studentTableBody.innerHTML = '<tr><td colspan="3">You can now mark attendance for this new day.</td></tr>';
        // You would need another API endpoint to fetch all students for a subject to populate this.
        return;
      }

      // If students are found, create a table row for each one
      students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.rollNo}</td>
          <td>${student.name}</td>
          <td>
            <select class="status-select" data-rollno="${student.rollNo}">
              <option value="Present" ${student.status === 'Present' ? 'selected' : ''}>Present</option>
              <option value="Absent" ${student.status === 'Absent' ? 'selected' : ''}>Absent</option>
            </select>
          </td>
        `;
        studentTableBody.appendChild(row);
      });

    } catch (error) {
      console.error('Error fetching student data:', error);
      alert('Failed to load student data. Please make sure your backend server is running.');
      studentTableBody.innerHTML = '<tr><td colspan="3">Could not load data. Is the server running?</td></tr>';
    }
  });

  /**
   * 2. SUBMIT ATTENDANCE LOGIC
   * Gathers all the statuses from the table and sends them to the backend to be saved.
   */
  submitAttendanceBtn.addEventListener('click', async () => {
    const subject = subjectSelect.value;
    const date = dateSelect.value;
    const rows = studentTableBody.querySelectorAll('tr');
    
    if (!subject || !date || rows.length === 0) {
        alert("Please load students before submitting.");
        return;
    }

    const attendanceData = [];
    rows.forEach(row => {
        const statusSelect = row.querySelector('.status-select');
        if (statusSelect) {
            const rollNo = statusSelect.dataset.rollno;
            const status = statusSelect.value;
            const name = row.cells[1].textContent; // Get the student's name from the table
            attendanceData.push({ rollNo, name, status });
        }
    });

    try {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject, date, records: attendanceData }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with an error: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message); // Show success message from the server

    } catch (error) {
        console.error('Error submitting attendance:', error);
        alert('Failed to submit attendance. Please try again.');
    }
  });
});

