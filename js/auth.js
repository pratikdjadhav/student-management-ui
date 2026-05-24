const API_URL = "https://student-management-backend-production-98f6.up.railway.app";
//const API_URL = "http://localhost:8080";
function getToken() { return sessionStorage.getItem("token"); }
function getUsername() { return sessionStorage.getItem("username"); }

function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    window.location.href = "index.html";
}

function checkAuth() {
    if (!getToken()) window.location.href = "index.html";
}

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    };
}

function showLogin() {
    document.getElementById("loginForm").classList.remove("d-none");
    document.getElementById("registerForm").classList.add("d-none");
    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");
}

function showRegister() {
    document.getElementById("registerForm").classList.remove("d-none");
    document.getElementById("loginForm").classList.add("d-none");
    document.getElementById("registerTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");
}

async function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    if (!username || !password) {
        showError("loginError", "Please enter username and password!");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("username", username);
            window.location.href = "dashboard.html";
        } else {
            showError("loginError", "Invalid username or password!");
        }
    } catch (error) {
        showError("loginError", "Cannot connect to server!");
    }
}

async function register() {
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    if (!username || !email || !password) {
        showError("registerError", "Please fill all fields!");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        if (response.ok) {
            document.getElementById("registerSuccess").classList.remove("d-none");
            document.getElementById("registerSuccess").innerText =
                "Registered successfully! Please login.";
            setTimeout(() => showLogin(), 2000);
        } else {
            showError("registerError", "Username already exists!");
        }
    } catch (error) {
        showError("registerError", "Cannot connect to server!");
    }
}

function showError(id, msg) {
    const el = document.getElementById(id);
    el.classList.remove("d-none");
    el.innerText = msg;
}
