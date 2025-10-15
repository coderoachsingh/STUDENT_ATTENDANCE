// login.js
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const rollNo = document.getElementById("rollNo").value.trim().toUpperCase();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const errorBox = document.getElementById("loginError");
  const loginButton = e.target.querySelector('button[type="submit"]');
  
  errorBox.classList.add("hidden");
  loginButton.disabled = true;
  loginButton.textContent = 'Logging in...';

  try {
    // FIX: Added the /login endpoint to the URL
    const response = await fetch('http://attendance-portal-env.eba-yfcf6gga.ap-south-1.elasticbeanstalk.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rollNo, email }),
    });

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