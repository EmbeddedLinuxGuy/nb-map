var w = 600, // 960
    h = 500, // 500
    color = d3.scale.category20c();

var treemap;
var div = null;

function make_tree() {
    console.log(w + "," + h);
    treemap = d3.layout.treemap()
    .size([w, h])
    .sticky(true)
    .value(function(d) { return 1; });
    if (div) {
	div.remove();
    }
    div = d3.select("#chart").append("div")
	.style("position", "relative")
	.style("width", w + "px")
	.style("height", h + "px");


    d3.json("jtree.json", function(json) {
	div.data([json]).selectAll("div")
	    .data(treemap.nodes)
	    .enter().append("div")
	    .attr("class", "cell")
	    .style("background", function(d) { return d.children ? color(d.name) : null; })
	    .on("mouseover", mouseover)
	    .call(cell)
	    .text(function(d) { return d.children ? null : d.name; });
	
	d3.select("#topic").on("click", function() {
	    div.selectAll("div")
		.data(treemap.value(function(d) { return 1; }))
		.transition()
		.duration(1500)
		.call(cell);

	    d3.select("#emails").classed("active", false);
	    d3.select("#users").classed("active", false);
	    d3.select("#topic").classed("active", true);
	});
	
	d3.select("#resize").on("click", resize_treemap);

	d3.select("#emails").on("click", function() {
	    div.selectAll("div")
		.data(treemap.value(function(d) { return d.size; }))
		.transition()
		.duration(1500)
		.call(cell);
	    
	    d3.select("#topic").classed("active", false);
	    d3.select("#emails").classed("active", true);
	    d3.select("#users").classed("active", false);
	});
	
	
	d3.select("#users").on("click", function() {
	    div.selectAll("div")
		.data(treemap.value(function(d) { return d.pop; }))
		.transition()
		.duration(1500)
		.call(cell);
	    
	    d3.select("#users").classed("active", true);
	    d3.select("#emails").classed("active", false);
	    d3.select("#topic").classed("active", false);
	});
    });
}

function resize_treemap () {
    w = d3.select("#width").node().value;
    h = d3.select("#height").node().value;

    console.log("Resizing treemap");
    make_tree();
    return;

    treemap = d3.layout.treemap()
    .size([w, h])
    .sticky(true)
	.value(function(d) { return 1; });

    div.style("width", w + "px")
    .style("height", h + "px");
}

function mouseover (d) {
    d3.select("#status").text(d.name+": "+d.size+" emails from "+d.pop+" users");
}

function cell() {
  this
      .style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

make_tree();
