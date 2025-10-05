document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the values from the input fields
    const studentIdInput = document.getElementById('student-id').value;
    const passwordInput = document.getElementById('password').value;
    
    // Get the elements for showing feedback to the user
    const errorMessage = document.getElementById('error-message');
    const loginBox = document.querySelector('.login-box');

    // Define the correct credentials
    const correctId = '21051234';
    const correctPassword = 'password123'; // This was the corrected line

    // Clear any previous error messages
    errorMessage.textContent = '';
    loginBox.classList.remove('error', 'success');

    // Check if the entered credentials are correct
    if (studentIdInput === correctId && passwordInput === correctPassword) {
        // If correct, show a success animation
        loginBox.classList.add('success');
        
        // Wait for 1 second for the animation to play, then redirect
        setTimeout(() => {
            window.location.href = 'http://127.0.0.1:5500/index.html'; // Redirect to the dashboard
        }, 1000);

    } else {
        // If incorrect, show an error message
        errorMessage.textContent = 'Invalid Student ID or Password.';
        loginBox.classList.add('error'); // Add an error animation
    }
});