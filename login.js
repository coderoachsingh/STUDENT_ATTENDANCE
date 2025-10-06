// login.js

const demoUsers = [
  { rollNo: "S001", email: "arman.singh@example.com", name: "Arman Singh" },
  { rollNo: "S002", email: "priya.das@example.com", name: "Priya Das" },
  { rollNo: "S003", email: "ravi.kumar@example.com", name: "Ravi Kumar" },
  { rollNo: "S004", email: "simran.kaur@example.com", name: "Simran Kaur" },
  { rollNo: "S005", email: "rahul.sharma@example.com", name: "Rahul Sharma" },
];

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const rollNo = document.getElementById("rollNo").value.trim().toUpperCase();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const errorBox = document.getElementById("loginError");

  // Hide error message on new submission attempt
  if (!errorBox.classList.contains("hidden")) {
    errorBox.classList.add("hidden");
  }
  
  const user = demoUsers.find(
    (u) => u.rollNo === rollNo && u.email === email
  );

  if (user) {
    // On successful login, save user and redirect
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    // UPDATED: Changed the redirection to index.html
    window.location.href = "index.html"; 
  } else {
    // On failed login, show the error message
    errorBox.classList.remove("hidden");
  }
});