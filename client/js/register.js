document.getElementById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
            alert("Register failed");
            return;
        }

        const data = await res.json();
        alert(data.message);

        window.location.href = "login.html";
        console.log("Register success");
    } catch (err) {
        alert("error:", err);
    }
});
