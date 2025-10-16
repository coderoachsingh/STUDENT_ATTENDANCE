document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("loginError");
  const loginButton = e.target.querySelector('button[type="submit"]');

  // --- Reset UI state ---
  errorBox.classList.add("hidden");
  loginButton.disabled = true;
  loginButton.textContent = 'Logging in...';

  try {
    // FIX: Changed URL to be absolute, pointing to your backend on port 3000
    const response = await fetch('https://student-attendance-gh4e.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed.');
    }
    
    // On success, save the token to localStorage
    localStorage.setItem("teacherAuthToken", data.token);
    
    // Redirect to the dashboard page on success
    window.location.href = "index.html";

  } catch (error) {
    // --- Handle errors ---
    errorBox.textContent = error.message;
    errorBox.classList.remove("hidden");
    loginButton.disabled = false;
    loginButton.textContent = 'Log in';
  }
});
