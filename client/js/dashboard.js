document.getElementById("testing").addEventListener("click", async function (e) {
    e.preventDefault();

    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:8080/api/event/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        if (!res.ok) {
            window.location.href = "login.html";
            return;
        }
        alert("EventRegister");
        console.log("login success");
    } catch (err) {
        alert("error: ", err);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:8080/api/dashboard/view", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (res.ok) {
            const authBtn = document.getElementById("auth-button");
            authBtn.outerHTML = `
                <div id="auth-dropdown" class="dropdown">
                    <button class="btn btn-primary dropdown-toggle" type="button" id="profileMenu" data-bs-toggle="dropdown" aria-expanded="false">
                    Profile
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="profileMenu">
                    <li><a class="dropdown-item" href="/profile.html">View Profile</a></li>
                    <li><a class="dropdown-item" href="#" id="logout-button">Logout</a></li>
                    </ul>
                </div>
                `;

            document.addEventListener("click", function (e) {
                if (e.target && e.target.id === "logout-button") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                }
            });

            console.log("GET response on page load:", data.message);
        }
    } catch (err) {
        console.error("Error during initial GET request:", err);
    }
});
