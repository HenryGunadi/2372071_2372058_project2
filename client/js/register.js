// document.getElementById("register-form").addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;
//     const pass = document.getElementById("pass").value;

//     const res = await fetch("http://localhost:8080/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, pass })
//     });

//     const data = await res.json();
//     alert(data.message);
//     console.log("login success")
// });