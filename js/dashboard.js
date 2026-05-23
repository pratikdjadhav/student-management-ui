checkAuth();
document.getElementById("welcomeUser").innerText = "👋 " + sessionStorage.getItem("username");

async function loadDashboard() {
    try {
        const headers = { "Authorization": "Bearer " + getToken() };

        const studentsRes = await fetch(`${API_URL}/api/students?page=0&size=100`, { headers });
        if (studentsRes.status === 401) { logout(); return; }
        const studentsData = await studentsRes.json();
        document.getElementById("totalStudents").innerText = studentsData.totalElements;

        const coursesRes = await fetch(`${API_URL}/api/courses`, { headers });
        const courses = await coursesRes.json();
        document.getElementById("totalCourses").innerText = courses.length;

        const collectedRes = await fetch(`${API_URL}/api/students/fees/collected`, { headers });
        const collected = await collectedRes.json();
        document.getElementById("totalCollected").innerText = "₹" + collected.toLocaleString('en-IN');

        const pendingRes = await fetch(`${API_URL}/api/students/fees/pending`, { headers });
        const pending = await pendingRes.json();
        document.getElementById("totalPending").innerText = "₹" + pending.toLocaleString('en-IN');

        const tbody = document.getElementById("recentStudents");
        const students = studentsData.content;
        if (students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No students yet!</td></tr>`;
            return;
        }
        tbody.innerHTML = students.slice(0, 5).map((s, i) => `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${s.name}</strong></td>
                <td>${s.email}</td>
                <td><span class="badge bg-primary">${s.courseName || 'N/A'}</span></td>
                <td class="text-success">₹${s.paidFees ? s.paidFees.toLocaleString('en-IN') : 0}</td>
                <td><span class="badge ${s.pendingFees > 0 ? 'bg-danger' : 'bg-success'}">
                    ₹${s.pendingFees ? s.pendingFees.toLocaleString('en-IN') : 0}</span></td>
            </tr>
        `).join("");
    } catch (error) { console.error("Error:", error); }
}

loadDashboard();
