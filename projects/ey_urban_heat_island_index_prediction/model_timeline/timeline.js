document.addEventListener("DOMContentLoaded", function () {
    const googleSheetsURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_4xxQUryQ7qP1XOoO91WQvirxS_cZSQ2MUp199RzpgUWdw6i8TNIQCWTWtMJ75-UoUcoWxK1PlObr/pub?output=csv";

    fetch(googleSheetsURL)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            let entries = data.feed.entry;
            let events = entries.map(entry => {
                return {
                    start_date: { 
                        year: entry.gsx$year.$t, 
                        month: 1, 
                        day: 1 
                    },
                    text: { 
                        headline: `Trial ${entry.gsx$trial.$t} - ${entry.gsx$modelname.$t}`, 
                        text: `<b>Features:</b> ${entry.gsx$features.$t} <br> 
                               <b>Notes:</b> ${entry.gsx$notes.$t} <br>
                               <b>R² Score:</b> ${entry.gsx$r2score.$t}`
                    }
                };
            });

            new TL.Timeline("timeline-embed", { title: { text: { headline: "ML Model Performance Timeline" } }, events });
        })
        .catch(error => console.error("Error loading Google Sheets JSON:", error));
});
