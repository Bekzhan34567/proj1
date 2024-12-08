const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      localStorage.setItem("token", data.token); // Сохраняю JWT
      window.location.href = "entries.html"; // Перенаправление на страницу записей
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred while logging in.");
  }
});
