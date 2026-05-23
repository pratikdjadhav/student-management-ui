checkAuth();
document.getElementById("welcomeUser").innerText = "👋 " + sessionStorage.getItem("username");

async function loadCourses() {
    try {
        const response = await fetch(`${API_URL}/api/courses`, {
            headers: { "Authorization": "Bearer " + getToken() }
        });
        if (response.status === 401) { logout(); return; }
        const courses = await response.json();
        const tbody = document.getElementById("coursesTable");
        if (courses.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No courses yet!</td></tr>`;
            return;
        }
        tbody.innerHTML = courses.map((c, i) => `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${c.name}</strong></td>
                <td>${c.duration || 'N/A'}</td>
                <td>${c.description || 'N/A'}</td>
                <td><strong class="text-primary">₹${c.fees ? c.fees.toLocaleString('en-IN') : 0}</strong></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteCourse(${c.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    } catch (error) { console.error("Error:", error); }
}

async function addCourse() {
    const name = document.getElementById("courseName").value;
    const duration = document.getElementById("courseDuration").value;
    const description = document.getElementById("courseDescription").value;
    const fees = document.getElementById("courseFees").value;
    if (!name) {
        document.getElementById("courseError").classList.remove("d-none");
        document.getElementById("courseError").innerText = "Course name is required!";
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/courses`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ name, duration, description, fees: fees ? parseFloat(fees) : 0 })
        });
        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById("addCourseModal")).hide();
            document.getElementById("courseName").value = "";
            document.getElementById("courseDuration").value = "";
            document.getElementById("courseDescription").value = "";
            document.getElementById("courseFees").value = "";
            document.getElementById("courseError").classList.add("d-none");
            loadCourses();
        } else {
            document.getElementById("courseError").classList.remove("d-none");
            document.getElementById("courseError").innerText = "Course already exists!";
        }
    } catch (error) { console.error("Error:", error); }
}

async function deleteCourse(id) {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
        await fetch(`${API_URL}/api/courses/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + getToken() }
        });
        loadCourses();
    } catch (error) { console.error("Error:", error); }
}

loadCourses();
