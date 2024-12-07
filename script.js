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

    // Kirim data ke GitHub
    sendToGitHub(newActivity);

    // Reset form
    form.reset();
}

// Fungsi untuk mengirim data ke GitHub
async function sendToGitHub(activity) {
    const repoOwner = "USERNAME"; // Ganti dengan nama pengguna GitHub
    const repoName = "REPOSITORY"; // Ganti dengan nama repository
    const token = "YOUR_PERSONAL_ACCESS_TOKEN"; // Ganti dengan token akses GitHub Anda

    const filePath = "data.json"; // Nama file yang akan digunakan untuk menyimpan data
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Ambil data yang ada di GitHub
    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github.v3+json"
        }
    });

    let existingData = [];
    if (response.ok) {
        const fileData = await response.json();
        const decodedContent = atob(fileData.content);
        existingData = JSON.parse(decodedContent);
    }

    // Tambahkan aktivitas baru ke data yang ada
    existingData.push(activity);

    // Encode data ke base64 untuk mengunggah ke GitHub
    const encodedData = btoa(JSON.stringify(existingData));

    // Update file di GitHub
    const updateResponse = await fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
            message: "Update schedule data",
            content: encodedData,
            sha: response.ok ? response.json().sha : undefined
        })
    });

    if (updateResponse.ok) {
        console.log("Data berhasil diperbarui di GitHub");
    } else {
        console.error("Terjadi kesalahan saat memperbarui data di GitHub");
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", loadSchedule);
form.addEventListener("submit", addSchedule);
