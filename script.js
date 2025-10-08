// script.js
window.onload = async function() {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    // --- SECURITY CHECK ---
    // If no token/user, redirect to login page.
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // --- DYNAMIC USER INFO ---
    // Update all "Welcome, John Doe" text with the real user's name
    document.querySelectorAll('.welcome-text').forEach(el => el.textContent = `Welcome, ${user.name}`);
    
    // Update profile page placeholders if on that page
    if (document.getElementById('profile-content')) {
        document.querySelector('.profile-name-info h2').textContent = user.name;
        document.querySelector('.profile-name-info p').textContent = `Student ID: ${user.rollNo}`;
    }

    // --- DATA FETCHING ---
    let attendanceData = [];
    try {
        const response = await fetch('http://localhost:3000/my-attendance', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // If token is expired or invalid, server will send 403
            if (response.status === 403) {
                alert('Your session has expired. Please log in again.');
                logout(); // Call logout function
                return;
            }
            throw new Error('Could not fetch attendance data.');
        }
        
        attendanceData = await response.json();

    } catch (error) {
        console.error("Fetch error:", error);
        // Display an error in the UI
        if (document.getElementById('dashboard-content')) {
            document.getElementById('dashboard-content').innerHTML = `<h2>Error loading data. Please try again later.</h2>`;
        }
        if (document.getElementById('attendance-data-body')) {
            document.getElementById('attendance-data-body').innerHTML = `<tr><td colspan="6">Error loading data.</td></tr>`;
        }
        return;
    }

    // --- RENDER FUNCTIONS (no changes needed here) ---
    function renderDashboardStats() {
        let totalClasses = 0;
        let totalAttended = 0;
        let lowAttendanceCount = 0;
        attendanceData.forEach(subject => {
            totalClasses += subject.total;
            totalAttended += subject.attended;
            if (subject.total > 0 && (subject.attended / subject.total) * 100 < 75) {
                lowAttendanceCount++;
            }
        });
        const overallPercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
        
        document.getElementById('overall-attendance-stat').textContent = `${overallPercentage.toFixed(2)}%`;
        document.getElementById('low-attendance-stat').textContent = lowAttendanceCount;
        document.getElementById('total-subjects-stat').textContent = attendanceData.length;
    }

    function renderAttendanceTable() {
        const tableBody = document.getElementById('attendance-data-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        if (attendanceData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No attendance records found yet.</td></tr>`;
            return;
        }
        attendanceData.forEach((subject, index) => {
            const percentage = subject.total > 0 ? (subject.attended / subject.total) * 100 : 0;
            let percentageClass = percentage < 75 ? 'attendance-danger' : (percentage < 85 ? 'attendance-warning' : 'attendance-good');
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${subject.code}</td>
                    <td>${subject.name}</td>
                    <td>${subject.total}</td>
                    <td>${subject.attended}</td>
                    <td><span class="percentage-cell ${percentageClass}">${percentage.toFixed(2)}%</span></td>
                </tr>`;
            tableBody.innerHTML += row;
        });
    }

    function renderAttendanceChart() {
        const chartCanvas = document.getElementById('attendanceChart');
        if (!chartCanvas) return;
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: attendanceData.map(s => s.name),
                datasets: [{
                    label: 'Attendance %',
                    data: attendanceData.map(s => s.total > 0 ? (s.attended / s.total) * 100 : 0),
                    backgroundColor: attendanceData.map(s => {
                        const perc = s.total > 0 ? (s.attended / s.total) * 100 : 0;
                        return perc < 75 ? '#dc3545' : (perc < 85 ? '#ffc107' : '#28a745');
                    }),
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage (%)' } } }
            }
        });
    }

    // --- LOGOUT FUNCTIONALITY ---
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    }

    document.querySelectorAll('.logout-btn').forEach(button => {
        button.addEventListener('click', logout);
    });

    // --- PAGE-SPECIFIC INITIALIZATION ---
    if (document.getElementById('dashboard-content')) {
        renderDashboardStats();
        renderAttendanceTable();
    }
    if (document.getElementById('attendance-content')) {
        renderAttendanceTable();
    }
};