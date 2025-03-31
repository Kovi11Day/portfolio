// Load CSV data and initialize the timeline widget
document.addEventListener('DOMContentLoaded', function() {
    const csvFilePath = 'model_timeline.csv'; // The path to your CSV file

    // Load CSV using D3.js
    d3.csv(csvFilePath).then(function(data) {
        // Parse the necessary data
        data.forEach(function(d) {
            d.trial = +d.trial;            // Ensure trial is a number
            d["r2 score"] = +d["r2 score"]; // Ensure R² score is a number
        });

        // Initialize the widget with the loaded data
        initializeTimelineWidget(data);
    }).catch(function(error) {
        console.error("Error loading the CSV file:", error);
    });
});

// Function to initialize the timeline widget with loaded CSV data
function initializeTimelineWidget(data) {
    const container = document.getElementById("timeline-widget");
    const width = container.clientWidth;  // Make the timeline responsive
    const height = 200;

    // Get the max trial number for scaling
    const maxTrial = Math.max(...data.map(d => d.trial));

    // Create the scale for the x-axis (for positioning the milestones)
    const xScale = d3.scaleLinear()
        .domain([0, maxTrial])
        .range([0, width]);

    // Create the timeline line (horizontal)
    const timeline = d3.select(".timeline");

    // Create the tooltip for showing model details
    const tooltip = d3.select("#tooltip");

    // Add milestones (dots) for each trial
    const milestones = d3.select(container).selectAll(".milestone")
        .data(data)
        .enter().append("div")
        .attr("class", "milestone")
        .style("left", d => `${xScale(d.trial)}px`)
        .attr("data-trial", d => d.trial)
        .attr("data-score", d => d["r2 score"])
        .attr("data-notes", d => d.notes)
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`
                    <strong>Trial ${d.trial}</strong><br>
                    Model: ${d["model name"]}<br>
                    R² Score: ${d["r2 score"].toFixed(2)}<br>
                    Notes: ${d.notes}
                `)
                .style("top", `${event.pageY + 10}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mousemove", (event) => {
            tooltip.style("top", `${event.pageY + 10}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });
}
