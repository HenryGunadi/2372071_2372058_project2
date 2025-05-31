document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-form").addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            console.log(data.message);
            if (!res.ok) {
                alert("Login failed");
                return;
            }
            alert(data.message);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            const staff = ["admin", "committee", "finance"];
            if (staff.includes(data.user.role)) {
                window.location.href = "/staffDashboard";
            } else {
                window.location.href = "/dashboard";
            }
            console.log("login success");
        } catch (err) {
            alert("error:", err);
        }
    });
});
