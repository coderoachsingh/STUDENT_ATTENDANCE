window.onload = function() {
    // This data would eventually come from your backend (e.g., AWS Amplify)
    const attendanceData = [
        { code: "CS-2001", name: "Data Structures", total: 45, attended: 42 },
        { code: "CS-2003", name: "Object Oriented Programming", total: 48, attended: 45 },
        { code: "MA-2011", name: "Discrete Mathematics", total: 50, attended: 35 },
        { code: "EC-2001", name: "Digital Electronics", total: 42, attended: 40 },
        { code: "HS-2001", name: "Professional Communication", total: 25, attended: 24 },
        { code: "CS-2091", name: "Data Structures Lab", total: 30, attended: 29 },
        { code: "CS-2093", name: "OOP Lab", total: 30, attended: 21 },
    ];

    const tableBody = document.getElementById('edit-attendance-body');
    const form = document.getElementById('edit-attendance-form');
    const successMessage = document.getElementById('success-message');

    // Function to load the data into the editable table
    function loadEditableTable() {
        tableBody.innerHTML = '';
        attendanceData.forEach(subject => {
            const row = `
                <tr>
                    <td>${subject.code}</td>
                    <td>${subject.name}</td>
                    <td><input type="number" class="total-classes" value="${subject.total}" data-code="${subject.code}"></td>
                    <td><input type="number" class="attended-classes" value="${subject.attended}" data-code="${subject.code}"></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // This is where you would call your AWS Amplify API to save the data
    function saveAttendanceData(updatedData) {
        console.log("--- Preparing to save data to the cloud ---");
        console.log(updatedData);
        // ** FUTURE AWS AMPLIFY INTEGRATION GOES HERE **
        // Example: await API.put('yourApiName', '/attendance', { body: updatedData });
        
        // Simulate a successful save for now
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedData = [];
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const totalInput = row.querySelector('.total-classes');
            const attendedInput = row.querySelector('.attended-classes');
            const subjectCode = totalInput.getAttribute('data-code');
            
            // Find the original subject to get its name
            const originalSubject = attendanceData.find(s => s.code === subjectCode);

            updatedData.push({
                code: subjectCode,
                name: originalSubject.name,
                total: parseInt(totalInput.value, 10),
                attended: parseInt(attendedInput.value, 10)
            });
        });

        saveAttendanceData(updatedData).then(() => {
            // Show a success message to the user
            successMessage.textContent = 'Changes saved successfully!';
            successMessage.style.opacity = 1;
            setTimeout(() => {
                successMessage.style.opacity = 0;
            }, 3000); // Hide message after 3 seconds
        });
    });

    // Initial load of the data
    loadEditableTable();
};
