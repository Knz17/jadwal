// Ambil elemen DOM
const form = document.getElementById("schedule-form");
const scheduleBody = document.getElementById("schedule-body");

// Fungsi untuk menambah baris ke tabel
function addRowToTable(activity) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${activity.time}</td>
        <td>${activity.activity}</td>
        <td>${activity.deadline || "-"}</td>
        <td class="${
            activity.priority === "high"
                ? "high-priority"
                : activity.priority === "medium"
                ? "medium-priority"
                : "low-priority"
        }">
            ${activity.priority === "high" ? "Tinggi" : activity.priority === "medium" ? "Sedang" : "Rendah"}
        </td>
        <td>${activity.notes || "-"}</td>
    `;

    scheduleBody.appendChild(row);
}

// Fungsi untuk menyimpan data ke Local Storage
function saveToLocalStorage(activity) {
    let schedule = JSON.parse(localStorage.getItem("schedule")) || [];
    schedule.push(activity);
    localStorage.setItem("schedule", JSON.stringify(schedule));
}

// Fungsi untuk memuat data dari Local Storage
function loadSchedule() {
    const schedule = JSON.parse(localStorage.getItem("schedule")) || [];
    schedule.forEach(addRowToTable);
}

// Fungsi untuk menangani submit form
function addSchedule(event) {
    event.preventDefault();

    // Ambil nilai input
    const time = document.getElementById("time").value;
    const activity = document.getElementById("activity").value;
    const deadline = document.getElementById("deadline").value || "-";
    const priority = document.getElementById("priority").value;
    const notes = document.getElementById("notes").value || "-";

    const newActivity = { time, activity, deadline, priority, notes };

    // Simpan ke Local Storage
    saveToLocalStorage(newActivity);

    // Tambahkan ke tabel
    addRowToTable(newActivity);

    // Reset form
    form.reset();
}


// Event listeners
document.addEventListener("DOMContentLoaded", loadSchedule);
form.addEventListener("submit", addSchedule);
