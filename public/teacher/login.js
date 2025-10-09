document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("loginError");
  const loginButton = e.target.querySelector('button[type="submit"]');

  errorBox.classList.add("hidden");
  loginButton.disabled = true;
  loginButton.textContent = 'Logging in...';

  try {
    const response = await fetch('/teacher-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed.');
    }
    
    // On success, save the token
    localStorage.setItem("teacherAuthToken", data.token);
    
    // Redirect to the dashboard
    window.location.href = "index.html";

  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove("hidden");
    loginButton.disabled = false;
    loginButton.textContent = 'Log in';
  }
});