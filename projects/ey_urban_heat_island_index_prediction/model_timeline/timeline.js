// Path to the local CSV file
const csvFilePath = "model_timeline.csv";

// Load the CSV file
d3.csv(csvFilePath).then(function(data) {
    // Convert necessary fields to numbers
    data.forEach(d => {
        d.trial = +d.trial;
        d["r2 score"] = +d["r2 score"];
    });

    // Set dimensions for the SVG container
    const width = 800, height = 400, margin = { top: 20, right: 20, bottom: 40, left: 50 };

    // Create the SVG element
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Set up the x and y scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.trial))
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d["r2 score"]) - 0.05, d3.max(data, d => d["r2 score"]) + 0.05])
        .range([height - margin.bottom, margin.top]);

    // Line generator for the path
    const line = d3.line()
        .x(d => xScale(d.trial))
        .y(d => yScale(d["r2 score"]))
        .curve(d3.curveMonotoneX);

    // Draw the line chart
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Tooltip setup for displaying notes on hover
    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "lightgray")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("display", "none");

    // Draw circles for each trial point
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.trial))
        .attr("cy", d => yScale(d["r2 score"]))
        .attr("r", 5)
        .attr("fill", "red")
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`<strong>Trial ${d.trial}</strong><br>Score: ${d["r2 score"]}<br>Note: ${d.notes}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", event => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.style("display", "none"));

    // Draw axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(data.length).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));
});
