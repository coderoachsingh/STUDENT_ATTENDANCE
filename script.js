window.onload = function() {
    // --- DATA (Simulates fetching from a backend) ---
    const attendanceData = [
        { code: "CS-2001", name: "Data Structures", total: 45, attended: 42 },
        { code: "CS-2003", name: "Object Oriented Programming", total: 48, attended: 45 },
        { code: "MA-2011", name: "Discrete Mathematics", total: 50, attended: 35 },
        { code: "EC-2001", name: "Digital Electronics", total: 42, attended: 40 },
        { code: "HS-2001", name: "Professional Communication", total: 25, attended: 24 },
        { code: "CS-2091", name: "Data Structures Lab", total: 30, attended: 29 },
        { code: "CS-2093", name: "OOP Lab", total: 30, attended: 21 },
    ];

    // --- RENDER FUNCTIONS ---
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
        if (!tableBody) return; // Exit if table is not on this page
        tableBody.innerHTML = '';
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
        if (!chartCanvas) return; // Exit if chart is not on this page
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
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });
    }

    // --- LOGOUT FUNCTIONALITY ---
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Redirect to the login page
            window.location.href = 'login.html';
        });
    }

    // --- PAGE-SPECIFIC INITIALIZATION ---
    // Check which page is currently loaded and run the appropriate functions
    if (document.getElementById('dashboard-content')) {
        renderDashboardStats();
        renderAttendanceChart();
    }
    if (document.getElementById('attendance-content')) {
        renderAttendanceTable();
    }
};

const students = document.querySelectorAll(".student");
const saveBtn = document.getElementById("save");

let attendance = {};

students.forEach((stu) => {
  const name = stu.querySelector("span").textContent;
  const presentBtn = stu.querySelector(".present");
  const absentBtn = stu.querySelector(".absent");

  presentBtn.addEventListener("click", () => {
    attendance[name] = "Present";
    presentBtn.style.backgroundColor = "#2ecc71";
    absentBtn.style.backgroundColor = "#f44336";
  });

  absentBtn.addEventListener("click", () => {
    attendance[name] = "Absent";
    absentBtn.style.backgroundColor = "#e74c3c";
    presentBtn.style.backgroundColor = "#4caf50";
  });
});

saveBtn.addEventListener("click", async () => {
  const subject = document.getElementById("subject").value;
  const date = document.getElementById("date").value;

  if (!date) {
    alert("Please select a date!");
    return;
  }

  for (const student in attendance) {
    await fetch("/mark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: student,
        subject,
        date,
        status: attendance[student],
      }),
    });
  }

  alert("✅ Attendance saved successfully!");
});
