// student-frontend/script.js
window.onload = async function() {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    // --- SECURITY CHECK ---
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // --- DYNAMIC USER INFO ---
    document.querySelectorAll('.welcome-text').forEach(el => el.textContent = `Welcome, ${user.name}`);
    if (document.getElementById('profile-content')) {
        document.querySelector('.profile-name-info h2').textContent = user.name;
        document.querySelector('.profile-name-info p').textContent = `Student ID: ${user.rollNo}`;
        // You can add more profile fields here if needed
    }

    // --- DATA FETCHING (Only if on a page that needs attendance) ---
    if (!document.getElementById('dashboard-content') && !document.getElementById('attendance-content')) {
        // If we are on a page like profile.html, we don't need to fetch attendance
        return; 
    }

    let attendanceData = [];
    try {
        // FIX: Added the /my-attendance endpoint to the live Render URL
        const response = await fetch('https://student-attendance-gh4e.onrender.com/my-attendance', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                alert('Your session has expired. Please log in again.');
                logout();
                return;
            }
            throw new Error('Could not fetch attendance data.');
        }
        
        attendanceData = await response.json();

    } catch (error) {
        console.error("Fetch error:", error);
        if (document.getElementById('dashboard-content')) {
            document.getElementById('dashboard-content').innerHTML = `<h2>Error loading data. Please try again later.</h2>`;
        }
        if (document.getElementById('attendance-data-body')) {
            document.getElementById('attendance-data-body').innerHTML = `<tr><td colspan="6">Error loading data.</td></tr>`;
        }
        return;
    }

    // --- RENDER FUNCTIONS ---
    function renderDashboardStats() {
        let totalClasses = 0, totalAttended = 0, lowAttendanceCount = 0;
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
            let percentageClass = 'attendance-good';
            if (percentage < 75) percentageClass = 'attendance-danger';
            else if (percentage < 85) percentageClass = 'attendance-warning';
            
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
        renderAttendanceTable(); // Render table on dashboard too
    }
    if (document.getElementById('attendance-content')) {
        renderAttendanceTable();
    }
};