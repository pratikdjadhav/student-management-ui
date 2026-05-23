checkAuth();
document.getElementById("welcomeUser").innerText = "👋 " + sessionStorage.getItem("username");

let currentPage = 0;

async function loadCourses() {
    const response = await fetch(`${API_URL}/api/courses`, {
        headers: { "Authorization": "Bearer " + getToken() }
    });
    const courses = await response.json();
    const filter = document.getElementById("courseFilter");
    const select = document.getElementById("studentCourse");
    filter.innerHTML = '<option value="">All Courses</option>';
    select.innerHTML = '<option value="">Select Course</option>';
    courses.forEach(c => {
        filter.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

async function loadStudents(page = 0) {
    currentPage = page;
    const size = document.getElementById("pageSize").value;
    const sortBy = document.getElementById("sortBy").value;
    try {
        const response = await fetch(`${API_URL}/api/students?page=${page}&size=${size}&sortBy=${sortBy}`, {
            headers: { "Authorization": "Bearer " + getToken() }
        });
        if (response.status === 401) { logout(); return; }
        const data = await response.json();
        renderStudents(data);
    } catch (error) { console.error("Error:", error); }
}

async function filterByCourse() {
    const courseId = document.getElementById("courseFilter").value;
    if (!courseId) { loadStudents(); return; }
    try {
        const response = await fetch(`${API_URL}/api/students/course/${courseId}`, {
            headers: { "Authorization": "Bearer " + getToken() }
        });
        const students = await response.json();
        const tbody = document.getElementById("studentsTable");
        if (students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">No students in this course!</td></tr>`;
            document.getElementById("pageInfo").innerText = "";
            document.getElementById("pagination").innerHTML = "";
            return;
        }
        tbody.innerHTML = students.map((s, i) => studentRow(s, i + 1)).join("");
        document.getElementById("pageInfo").innerText = `${students.length} students found`;
        document.getElementById("pagination").innerHTML = "";
    } catch (error) { console.error("Error:", error); }
}

function studentRow(s, num) {
    return `<tr>
        <td>${num}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.email}</td>
        <td>${s.phone || 'N/A'}</td>
        <td><span class="badge bg-primary">${s.courseName || 'N/A'}</span></td>
        <td>₹${s.courseFees ? s.courseFees.toLocaleString('en-IN') : 0}</td>
        <td class="text-success fw-bold">₹${s.paidFees ? s.paidFees.toLocaleString('en-IN') : 0}</td>
        <td><span class="badge ${s.pendingFees > 0 ? 'bg-danger' : 'bg-success'}">
            ₹${s.pendingFees ? s.pendingFees.toLocaleString('en-IN') : 0}</span></td>
        <td><span class="badge ${s.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}">${s.status || 'ACTIVE'}</span></td>
        <td>
            <button class="btn btn-warning btn-sm me-1" onclick="openEditModal(${s.id})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger btn-sm" onclick="deleteStudent(${s.id})"><i class="fas fa-trash"></i></button>
        </td>
    </tr>`;
}

function renderStudents(data) {
    const tbody = document.getElementById("studentsTable");
    if (data.content.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">No students yet!</td></tr>`;
        return;
    }
    tbody.innerHTML = data.content.map((s, i) => studentRow(s, (data.number * data.size) + i + 1)).join("");
    document.getElementById("pageInfo").innerText = `Showing ${data.numberOfElements} of ${data.totalElements} students`;

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    if (!data.first) pagination.innerHTML += `<button class="btn btn-outline-primary btn-sm" onclick="loadStudents(${data.number - 1})"><i class="fas fa-chevron-left"></i> Prev</button>`;
    pagination.innerHTML += `<span class="btn btn-primary btn-sm disabled">${data.number + 1} / ${data.totalPages}</span>`;
    if (!data.last) pagination.innerHTML += `<button class="btn btn-outline-primary btn-sm" onclick="loadStudents(${data.number + 1})">Next <i class="fas fa-chevron-right"></i></button>`;
}

async function addStudent() {
    const name = document.getElementById("studentName").value;
    const email = document.getElementById("studentEmail").value;
    const phone = document.getElementById("studentPhone").value;
    const address = document.getElementById("studentAddress").value;
    const courseId = document.getElementById("studentCourse").value;
    const paidFees = document.getElementById("studentPaidFees").value;
    const enrollmentDate = document.getElementById("studentEnrollmentDate").value;
    const status = document.getElementById("studentStatus").value;

    if (!name || !email || !phone) {
        document.getElementById("studentError").classList.remove("d-none");
        document.getElementById("studentError").innerText = "Name, email and phone are required!";
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/students`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ name, email, phone, address,
                paidFees: paidFees ? parseFloat(paidFees) : 0,
                enrollmentDate: enrollmentDate || null,
                status: status,
                courseId: courseId ? parseInt(courseId) : null })
        });
        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById("addStudentModal")).hide();
            ["studentName","studentEmail","studentPhone","studentAddress","studentPaidFees","studentEnrollmentDate"].forEach(id => document.getElementById(id).value = "");
            document.getElementById("studentStatus").value = "ACTIVE";
            document.getElementById("studentError").classList.add("d-none");
            loadStudents();
        } else {
            const error = await response.json();
            document.getElementById("studentError").classList.remove("d-none");
            document.getElementById("studentError").innerText = error.message || "Error adding student!";
        }
    } catch (error) { console.error("Error:", error); }
}

async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/api/students/${id}`, {
            headers: { "Authorization": "Bearer " + getToken() }
        });
        const s = await response.json();
        document.getElementById("editStudentId").value = s.id;
        document.getElementById("editStudentName").value = s.name;
        document.getElementById("editStudentEmail").value = s.email;
        document.getElementById("editStudentPhone").value = s.phone || "";
        document.getElementById("editStudentAddress").value = s.address || "";
        document.getElementById("editStudentPaidFees").value = s.paidFees || 0;
        document.getElementById("editStudentEnrollmentDate").value = s.enrollmentDate || "";
        document.getElementById("editStudentStatus").value = s.status || "ACTIVE";

        const coursesRes = await fetch(`${API_URL}/api/courses`, { headers: { "Authorization": "Bearer " + getToken() } });
        const courses = await coursesRes.json();
        const sel = document.getElementById("editStudentCourse");
        sel.innerHTML = '<option value="">Select Course</option>';
        courses.forEach(c => sel.innerHTML += `<option value="${c.id}" ${s.courseId === c.id ? 'selected' : ''}>${c.name}</option>`);

        new bootstrap.Modal(document.getElementById("editStudentModal")).show();
    } catch (error) { console.error("Error:", error); }
}

async function updateStudent() {
    const id = document.getElementById("editStudentId").value;
    const name = document.getElementById("editStudentName").value;
    const email = document.getElementById("editStudentEmail").value;
    const phone = document.getElementById("editStudentPhone").value;
    const address = document.getElementById("editStudentAddress").value;
    const courseId = document.getElementById("editStudentCourse").value;
    const paidFees = document.getElementById("editStudentPaidFees").value;
    const enrollmentDate = document.getElementById("editStudentEnrollmentDate").value;
    const status = document.getElementById("editStudentStatus").value;

    try {
        const response = await fetch(`${API_URL}/api/students/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ name, email, phone, address,
                paidFees: paidFees ? parseFloat(paidFees) : 0,
                enrollmentDate: enrollmentDate || null,
                status: status,
                courseId: courseId ? parseInt(courseId) : null })
        });
        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById("editStudentModal")).hide();
            loadStudents(currentPage);
        } else {
            const error = await response.json();
            document.getElementById("editStudentError").classList.remove("d-none");
            document.getElementById("editStudentError").innerText = error.message || "Error updating student!";
        }
    } catch (error) { console.error("Error:", error); }
}

async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
        await fetch(`${API_URL}/api/students/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + getToken() }
        });
        loadStudents(currentPage);
    } catch (error) { console.error("Error:", error); }
}

loadCourses();
loadStudents();
