document.addEventListener("DOMContentLoaded", function () {
    // Replace with your published Google Sheets CSV link
    const googleSheetsURL = "https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vS_4xxQUryQ7qP1XOoO91WQvirxS_cZSQ2MUp199RzpgUWdw6i8TNIQCWTWtMJ75-UoUcoWxK1PlObr/pub?output=csv";

    fetch(googleSheetsURL)
        .then(response => response.text())
        .then(csvText => {
            let rows = csvText.trim().split("\n").map(row => row.split(","));
            let headers = rows.shift().map(h => h.trim()); // Extract column headers

            let jsonData = rows.map(row => {
                let obj = {};
                headers.forEach((header, i) => obj[header] = row[i] ? row[i].trim() : "");
                return obj;
            });

            // Convert "trial" to a pseudo-date (Trial 1 = Jan 1, 2024)
            let startDate = new Date(2024, 0, 1); // Start from Jan 1, 2024

            let events = jsonData.map((entry, index) => {
                let trialNumber = parseInt(entry["trial"], 10) || index + 1;
                let eventDate = new Date(startDate);
                eventDate.setDate(startDate.getDate() + trialNumber - 1);

                return {
                    start_date: { 
                        year: eventDate.getFullYear(),
                        month: eventDate.getMonth() + 1,
                        day: eventDate.getDate()
                    },
                    text: { 
                        headline: `Trial ${entry["trial"]} - ${entry["model name"]}`, 
                        text: `<b>Features:</b> ${entry["features"]} <br> 
                               <b>Notes:</b> ${entry["notes"]} <br>
                               <b>R² Score:</b> ${entry["r2 score"]}`
                    }
                };
            });

            // Initialize Timeline.js
            new TL.Timeline("timeline-embed", { title: { text: { headline: "ML Model Performance Timeline" } }, events });
        })
        .catch(error => console.error("Error loading Google Sheets CSV:", error));
});
