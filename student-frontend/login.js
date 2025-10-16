// student-frontend/login.js
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const rollNoInput = document.getElementById("rollNo");
  const emailInput = document.getElementById("email");
  const errorBox = document.getElementById("loginError");
  const loginButton = e.target.querySelector('button[type="submit"]');

  const rollNo = rollNoInput.value.trim().toUpperCase();
  const email = emailInput.value.trim().toLowerCase();
  
  errorBox.classList.add("hidden");
  loginButton.disabled = true;
  loginButton.textContent = 'Logging in...';

  try {
    // FIX: Added the /login endpoint to the live Render URL
    const response = await fetch('https://student-attendance-gh4e.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rollNo, email }),
    });

    // Check if the response is valid JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Received an invalid response from the server.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed.');
    }
    
    // On successful login, save the token and user info
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
    
    // Redirect to the dashboard
    window.location.href = "index.html";

  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove("hidden");
    loginButton.disabled = false;
    loginButton.textContent = 'Log in';
  }
});