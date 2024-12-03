// Inisialisasi Peta
const map = L.map('map').setView([-7.2575, 112.7521], 13);

// Variasi Basemap
const basemapLayers = {
    "OpenStreetMap": L.tileLayer.provider('OpenStreetMap.Mapnik'),
    "Satellite": L.tileLayer.provider('Esri.WorldImagery'),
    "Topographic": L.tileLayer.provider('Esri.WorldTopoMap'),
    "Dark Mode": L.tileLayer.provider('CartoDB.DarkMatter')
};

// Tambahkan basemap default
basemapLayers["OpenStreetMap"].addTo(map);

// Kontrol layer untuk memilih basemap
L.control.layers(basemapLayers).addTo(map);

// Menambahkan fitur pencarian lokasi
L.Control.geocoder().addTo(map);

// Variabel global untuk marker, koordinat, dan polyline
let marker1 = null, marker2 = null;
let lat1 = null, lon1 = null, lat2 = null, lon2 = null;
let line = null; // Polyline untuk menghubungkan dua titik

// Event Klik di Peta
map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    if (!marker1) {
        // Tambahkan marker pertama
        marker1 = L.marker([lat, lng]).addTo(map).bindPopup('Titik 1').openPopup();
        lat1 = lat;
        lon1 = lng;
        document.getElementById('lat1').innerText = lat.toFixed(6);
        document.getElementById('lon1').innerText = lng.toFixed(6);
    } else if (!marker2) {
        // Tambahkan marker kedua
        marker2 = L.marker([lat, lng]).addTo(map).bindPopup('Titik 2').openPopup();
        lat2 = lat;
        lon2 = lng;
        document.getElementById('lat2').innerText = lat.toFixed(6);
        document.getElementById('lon2').innerText = lng.toFixed(6);

        // Tambahkan garis merah antara titik 1 dan titik 2
        if (line) {
            map.removeLayer(line); // Hapus garis sebelumnya jika ada
        }
        line = L.polyline([[lat1, lon1], [lat2, lon2]], { color: 'red' }).addTo(map);
    } else {
        alert('Hanya dua titik yang dapat dipilih!');
    }
});

// Fungsi untuk menghitung jarak dan bearing
document.getElementById('hitungBtn').addEventListener('click', function () {
    if (lat1 && lon1 && lat2 && lon2) {
        const toRad = (deg) => (deg * Math.PI) / 180;
        const toDeg = (rad) => (rad * 180) / Math.PI;

        const R = 6371e3; // Jari-jari bumi dalam meter
        const φ1 = toRad(lat1);
        const φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1);
        const Δλ = toRad(lon2 - lon1);

        // Haversine Formula
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const jarak = R * c; // Jarak dalam meter

        // Bearing
        const y = Math.sin(Δλ) * Math.cos(φ2);
        const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
        const initialBearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
        const finalBearing = (initialBearing + 180) % 360;

        // Tampilkan hasil
        document.getElementById('jarak').innerText = (jarak / 1000).toFixed(2) + ' km';
        document.getElementById('initialBearing').innerText = initialBearing.toFixed(2) + '°';
        document.getElementById('finalBearing').innerText = finalBearing.toFixed(2) + '°';
    } else {
        alert('Pilih kedua titik terlebih dahulu!');
    }
});

// Fungsi untuk hapus marker dan reset data
document.getElementById('hapusMarkerBtn').addEventListener('click', function () {
    if (marker1) {
        map.removeLayer(marker1);
        marker1 = null;
        lat1 = null;
        lon1 = null;
        document.getElementById('lat1').innerText = '-';
        document.getElementById('lon1').innerText = '-';
    }
    if (marker2) {
        map.removeLayer(marker2);
        marker2 = null;
        lat2 = null;
        lon2 = null;
        document.getElementById('lat2').innerText = '-';
        document.getElementById('lon2').innerText = '-';
    }

    if (line) {
        map.removeLayer(line); // Hapus garis jika ada
        line = null;
    }

    // Reset hasil kalkulasi
    document.getElementById('jarak').innerText = '-';
    document.getElementById('initialBearing').innerText = '-';
    document.getElementById('finalBearing').innerText = '-';

    alert('Marker telah dihapus dan data telah di-reset.');
});
