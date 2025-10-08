// public/teacher/Dashboard Logic.js

document.addEventListener('DOMContentLoaded', () => {
  const subjectSelect = document.getElementById('subject');
  const dateSelect = document.getElementById('date');
  const loadStudentsBtn = document.getElementById('loadStudents');
  const studentTableContainer = document.getElementById('studentTableContainer');
  const studentTableBody = document.getElementById('studentTable');
  const submitAttendanceBtn = document.getElementById('submitAttendance');

  const API_BASE_URL = 'http://localhost:3000';

  loadStudentsBtn.addEventListener('click', async () => {
    const subject = subjectSelect.value;
    const date = dateSelect.value;

    if (!subject || !date) {
      alert('Please select both a subject and a date.');
      return;
    }

    studentTableContainer.classList.remove('hidden');
    studentTableBody.innerHTML = '<tr><td colspan="3">Loading students...</td></tr>';

    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      
      if (!response.ok) {
        throw new Error(`The server responded with an error: ${response.status}`);
      }

      const students = await response.json();
      
      studentTableBody.innerHTML = ''; 

      if (students.length === 0) {
        studentTableBody.innerHTML = '<tr><td colspan="3">No students found in the database.</td></tr>';
        return;
      }

      students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.rollNo}</td>
          <td>${student.name}</td>
          <td>
            <select class="status-select" data-rollno="${student.rollNo}">
              <option value="Present" selected>Present</option>
              <option value="Absent">Absent</option>
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
            // ✅ FINAL FIX IS HERE: Convert the rollNo from a string to a number
            const rollNo = statusSelect.dataset.rollno;
            const status = statusSelect.value;
            const name = row.cells[1].textContent;
            attendanceData.push({ rollNo, name, status });
        }
    });

    try {
        const response = await fetch(`${API_BASE_URL}/markAttendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject, date, records: attendanceData }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || `Server responded with an error: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message);

    } catch (error) {
        console.error('Error submitting attendance:', error);
        alert(`Failed to submit attendance. Reason: ${error.message}`);
    }
  });
});