document.addEventListener("DOMContentLoaded", async function() {
    const mapDiv = document.getElementById('map');
    let address = mapDiv.dataset.location; // Listing location from EJS
    const apiKey = mapToken; // Replace with your key

    // Fallback coordinates for Delhi
    const defaultCoords = { lat: 28.6139, lng: 77.2090 };

    try {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&limit=1`;
        const res = await fetch(url);
        const data = await res.json();

        let lat, lng;

        if(data.results && data.results.length > 0){
            // Found coordinates from OpenCage
            lat = data.results[0].geometry.lat;
            lng = data.results[0].geometry.lng;
        } else {
            // Fallback to Delhi
            lat = defaultCoords.lat;
            lng = defaultCoords.lng;
            address = "New Delhi, India"; // Update popup text
        }

        // Initialize map
        const map = L.map('map').setView([lat, lng], 13);

        // Load OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add marker
        L.marker([lat, lng]).addTo(map)
            .bindPopup(address)
            .openPopup();

    } catch (err) {
        console.error("Error fetching coordinates:", err);
        // Fallback to Delhi if API call fails
        const map = L.map('map').setView([defaultCoords.lat, defaultCoords.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([defaultCoords.lat, defaultCoords.lng]).addTo(map)
            .bindPopup("New Delhi, India")
            .openPopup();
    }
});
