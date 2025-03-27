
// Versi ekspor Excel!
let totalPendapatan = 0;
const dataRekap = [];

document.getElementById("kasirForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const kasir = document.getElementById("namaKasir").value;
  const nama = document.getElementById("namaPelanggan").value;
  const layanan = document.getElementById("layanan").value;
  const diskon = parseFloat(document.getElementById("diskon").value);
  const noWA = document.getElementById("nomorWA").value;

  let harga = 0;
  switch (layanan) {
    case "Potong Rambut": harga = 30000; break;
    case "Cukur Jenggot": harga = 15000; break;
    case "Cat Rambut": harga = 70000; break;
    case "Hair Spa": harga = 50000; break;
    default: harga = 0;
  }

  const potongan = (diskon / 100) * harga;
  const total = harga - potongan;
  totalPendapatan += total;

  const isiStruk = 
    "=== STRUK BARBERSHOP ===\n" +
    `Nama Pelanggan : ${nama}\n` +
    `Layanan        : ${layanan}\n` +
    `Harga          : Rp${harga.toLocaleString()}\n` +
    `Diskon         : ${diskon}%\n` +
    `Total Bayar    : Rp${total.toLocaleString()}\n` +
    `Kasir          : ${kasir}\n` +
    "=========================";

  document.getElementById("struk").innerText = isiStruk;
  document.getElementById("rekap").innerText = 
    `💼 Total Pendapatan Hari Ini: Rp${totalPendapatan.toLocaleString()}`;

  // Simpan ke rekap data
  dataRekap.push({
    "Waktu": new Date().toLocaleString(),
    "Kasir": kasir,
    "Pelanggan": nama,
    "Layanan": layanan,
    "Harga (Rp)": harga,
    "Diskon (%)": diskon,
    "Total (Rp)": total
  });

  // Kirim ke WA pelanggan
  const pesanWA = encodeURIComponent(isiStruk);
  const urlWA = `https://wa.me/${noWA}?text=${pesanWA}`;
  window.open(urlWA, "_blank");
});

// Tombol export ke Excel
document.getElementById("exportBtn").addEventListener("click", function () {
  if (dataRekap.length === 0) {
    alert("Belum ada transaksi hari ini.");
    return;
  }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dataRekap);
  XLSX.utils.book_append_sheet(wb, ws, "Rekap Hari Ini");
  XLSX.writeFile(wb, "rekap_barbershop_hari_ini.xlsx");
});
