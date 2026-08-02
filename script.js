var tennisData;
var circles;
var annotationLayer;
var xScale;
var yScale;
var currentScene=0;
var scenes=[
    {
        title: "Scene 1: The Federer and Nadal Rivalry (2003-2010)",
        description: "From 2003 through 2010, Roger Federer established one of the greatest periods of dominance in tennis history while Rafael Nadal emerged as his fiercest rival. Together they won 25 of 32 Grand Slam titles and produced iconic matches such as the 2008 Wimbledon final.",
        statMain: "25 of 32 Grand Slam titles",
        statDetail: "(78%) were won by Federer or Nadal."
    },
    {
        title: "Scene 2: The Big Three Take Control (2011-2023)",
        description: "Beginning in 2011, Novak Djokovic rose to challenge Roger Federer and Rafael Nadal, completing the legendary Big Three. Together, they won 39 of the 50 Grand Slam titles between 2011 and 2023, defining one of the most dominant eras in tennis history.",
        statMain: "39 of 50 Grand Slam titles",
        statDetail: "(78%) were won by the Big Three."
    },
    {
        title: "Scene 3: A New Generation Arrives (2024-2025)",
        description: "By 2024, Carlos Alcaraz and Jannik Sinner had firmly established themselves as the next generation, winning every Grand Slam title during the 2024–2025 seasons and signaling a new era in men's tennis",
        statMain: "8 of 8 Grand Slam titles",
        statDetail: "(100%) were won by Alcaraz or Sinner."
    }
];
d3.csv("grand_slam_winners.csv").then(function(data) {
    tennisData = data;
    drawChart();
    updateScene();
});
function getColor(player) {
    if (player==="Roger Federer") {
        return "#4f78a8";
    }
    if (player==="Rafael Nadal") {
        return "#c96f3b";
    }
    if (player ==="Novak Djokovic"){
        return "#139759";
    }
    if (player ==="Carlos Alcaraz") {
        return "#765083";
    }
    if (player === "Jannik Sinner"){
        return "#c49a3a";
    }
    return "#605e5a";
}
function drawChart() {
    d3.select("#chart-area").selectAll("svg").remove();
    d3.select("#legend").html("");
    var width = 1150;
    var height = 750;
    var margin = {
        top: 50,
        right: 30,
        bottom: 70,
        left: 175
    };
    var chartWidth=width-margin.left -margin.right;
    var chartHeight=height -margin.top -margin.bottom;
    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    var chart = svg.append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    var tournaments = [
        "Australian Open",
        "French Open",
        "Wimbledon",
        "US Open"
    ];
    xScale = d3.scaleLinear()
        .domain([2003, 2025])
        .range([0, chartWidth]);
    yScale = d3.scalePoint()
        .domain(tournaments)
        .range([0, chartHeight])
        .padding(0.5);
    var xAxis = d3.axisBottom(xScale)
        .tickValues([2003,2005, 2007,2009,2011,2013,2015, 2017, 2019, 2021, 2023, 2025])
        .tickFormat(d3.format("d"));
    var yAxis = d3.axisLeft(yScale);
    chart.append("g")
        .attr("class","axis x-axis")
        .attr("transform","translate(0," + chartHeight + ")")
        .call(xAxis);
    chart.append("g")
        .attr("class","axis y-axis")
        .call(yAxis);
    chart.selectAll(".row-line")
        .data(tournaments)
        .enter()
        .append("line")
        .attr("class","row-line")
        .attr("x1", 0)
        .attr("x2", chartWidth)
        .attr("y1",function(d){return yScale(d);
        })
        .attr("y2", function(d){return yScale(d);
        })
        .attr("stroke","#e3ded3")
        .attr("stroke-width", 1);
    circles = chart.selectAll(".champion-circle")
        .data(tennisData)
        .enter()
        .append("circle")
        .attr("class", "champion-circle")
        .attr("cx",function(d) {return xScale(Number(d.Year));})
        .attr("cy",function(d) {return yScale(d.Tournament);
        })
        .attr("r",10)
        .attr("fill",function(d) {
            if (currentScene===0){
        if (d.Winner==="Roger Federer") {return "#4f78a8";
        }
        if (d.Winner==="Rafael Nadal") {
            return "#c96f3b";}
        return "#605e5a";
    }
    if (currentScene===1){return getColor(d.Winner);
    }
    if (currentScene===2){
        if (d.Winner==="Carlos Alcaraz"){
            return "#765083";
        }
        if (d.Winner==="Jannik Sinner"){
            return "#c49a3a";
        }
        return "#605e5a";
    }
        })
        .attr("stroke","#fffdf8")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(event,d){
            d3.select(this)
                .attr("r", 13)
                .attr("stroke", "#222222")
                .attr("stroke-width", 2);
            d3.select("#tooltip")
                .style("display", "block")
                .html(
                    "<strong>" + d.Year + " " + d.Tournament + "</strong><br>" +
                    "Winner: " + d.Winner + "<br>" +
                    "Runner-up: " + d.runner_up + "<br>" +
                    "Surface: " + d.Surface + "<br>" +
                    "Score: " + d.Score
                );
        })
        .on("mousemove",function(event){
            d3.select("#tooltip")
                .style("left", event.pageX + 14 + "px")
                .style("top", event.pageY - 20 + "px");
        })
        .on("mouseout",function(){
            d3.select("#tooltip")
                .style("display","none");
            updateCircleAppearance();
        });
    svg.append("text")
        .attr("x", margin.left +chartWidth/2)
        .attr("y", height - 15)
        .attr("text-anchor","middle")
        .attr("fill", "#536159")
        .attr("font-size", "18px")
        .text("Year");
    svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("x", -(margin.top + chartHeight / 2))
        .attr("y", 25)
        .attr("text-anchor","middle")
        .attr("fill", "#536159")
        .attr("font-size", "16px")
        .text("Grand Slam Tournament");
    annotationLayer =chart.append("g")
        .attr("class","annotation-layer");
    drawLegend();
}
function drawLegend(){
    d3.select("#legend").html("");
    var legendData;
    if (currentScene===0){
        legendData=[
            { name: "Roger Federer", color: "#4f78a8"},
            { name: "Rafael Nadal", color: "#c96f3b"},
            { name: "Other Champions", color: "#605e5a"}
        ];
    }
    else if (currentScene===1){
        legendData=[
            {name: "Roger Federer", color: "#4f78a8"},
            {name: "Rafael Nadal", color: "#c96f3b"},
            {name: "Novak Djokovic", color: "#139759"},
            {name: "Other Champions", color: "#605e5a"}
        ];
    }
    else {
        legendData=[
            {name: "Carlos Alcaraz", color: "#765083"},
            {name: "Jannik Sinner", color: "#c49a3a"},
            {name: "Other Champions", color: "#605e5a" }
        ];
    }
    var legend=d3.select("#legend")
        .selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("div")
        .attr("class", "legend-item");
    legend.append("span")
        .attr("class", "legend-color")
        .style("background-color", function(d) {
            return d.color;
        });
    legend.append("span")
        .text(function(d) {
            return d.name;
        });
}
function updateScene(){
    d3.select("#scene-title")
        .text(scenes[currentScene].title);
    d3.select("#scene-description")
        .text(scenes[currentScene].description);
    d3.select("#scene-stat-main")
    .text(scenes[currentScene].statMain);
    d3.select("#scene-stat-detail")
    .text(scenes[currentScene].statDetail);
    d3.select("#scene-counter")
        .text("Scene " + (currentScene + 1) + " of " + scenes.length);
    d3.select("#previous-btn")
        .property("disabled", currentScene === 0);
    d3.select("#next-btn")
        .property("disabled", currentScene === scenes.length - 1);
    updateCircleAppearance();
    updateAnnotation();
    drawLegend();
}
function updateCircleAppearance(){
    circles.transition()
        .duration(600)
        .attr("opacity", function(d) {
            var year = Number(d.Year);
            if (currentScene===0){
                if (year >=2003 && year<=2010) {
                    return 1;
                }
                return 0.18;
            }
            if (currentScene===1){
                if (year >= 2011&&year<=2023){
                    return 1;
                }
                return 0.18;
            }
            if (currentScene===2){
                if (year>=2024 &&year<= 2025){
                    return 1;
                }
                if (year >=2024){
                    return 0.45;
                }
                return 0.12;
            }
        })
        .attr("r",function(d){
            var year = Number(d.Year);
            if (currentScene===0 && year >=2003 && year <=2010){
                return 11;
            }
            if (currentScene ===1 && year>= 2011 && year<= 2023) {
                return 11; }
            if (currentScene ===2 && year>=2024 && year<= 2025){
                return 12;}
            return 8;
        })
        .attr("fill", function(d){
            if (currentScene===0){
                if (d.Winner==="Roger Federer") {
                    return "#4f78a8";}
                if (d.Winner==="Rafael Nadal") {return "#c96f3b";
                }
                return "#605e5a";
            }
            if (currentScene===1){
                if (d.Winner ==="Roger Federer"){
                    return "#4f78a8";
                }
                if (d.Winner ==="Rafael Nadal") {
                    return "#c96f3b";
                }
                if (d.Winner ==="Novak Djokovic") {
                    return "#139759";
                }
                return "#605e5a";
            }
            if (currentScene===2){
                if (d.Winner ==="Carlos Alcaraz") {
                    return "#765083";
                }
                if (d.Winner==="Jannik Sinner") {
                    return "#c49a3a";
                }
                return "#605e5a";
            }
        })
        .attr("stroke","#fffdf8")
        .attr("stroke-width",1.5);
}
function updateAnnotation(){
    annotationLayer.selectAll("*").remove();
    if (currentScene===0){
        drawSceneOneAnnotation();}
    if (currentScene===1){
        drawSceneTwoAnnotation();}
    if (currentScene===2){
        drawSceneThreeAnnotation();}
}
function drawSceneOneAnnotation(){
    var targetX = xScale(2003);
    var targetY = yScale("Wimbledon");
    annotationLayer.append("line")
        .attr("x1", targetX)
        .attr("y1", targetY)
        .attr("x2", targetX + 120)
        .attr("y2", targetY - 70)
        .attr("stroke", "#6c4a78")
        .attr("stroke-width", 2);
    annotationLayer.append("text")
        .attr("x", targetX + 130)
        .attr("y", targetY - 75)
        .attr("class", "annotation-text")
        .text("Federer's 2003 Wimbledon title begins the era.");
}
function drawSceneTwoAnnotation(){
    var nadalX = xScale(2017);
    var nadalY = yScale("French Open");
    annotationLayer.append("line")
        .attr("x1", nadalX)
        .attr("y1", nadalY)
        .attr("x2",nadalX- 150)
        .attr("y2",nadalY - 70)
        .attr("stroke", "#6c4a78")
        .attr("stroke-width",2);
    annotationLayer.append("text")
        .attr("x", nadalX - 160)
        .attr("y",nadalY -75)
        .attr("text-anchor", "end")
        .attr("class", "annotation-text")
        .text("Nadal continued his historic dominance at the French Open.");
    var djokovicX =xScale(2019);
    var djokovicY=yScale("Australian Open");
    annotationLayer.append("line")
        .attr("x1",djokovicX)
        .attr("y1",djokovicY)
        .attr("x2",djokovicX - 150)
        .attr("y2",djokovicY - 65)
        .attr("stroke", "#6c4a78")
        .attr("stroke-width", 2);
    annotationLayer.append("text")
        .attr("x", djokovicX - 160)
        .attr("y",djokovicY - 70)
        .attr("text-anchor","end")
        .attr("class", "annotation-text")
        .text("Djokovic built dominant runs at the Australian Open and Wimbledon.");
}
function drawSceneThreeAnnotation(){
    var targetX =xScale(2024);
    var targetY =yScale("Australian Open");
    annotationLayer.append("line")
        .attr("x1", targetX)
        .attr("y1",targetY)
        .attr("x2", targetX - 200)
        .attr("y2",targetY - 65)
        .attr("stroke", "#6c4a78")
        .attr("stroke-width", 2);
    annotationLayer.append("text")
        .attr("x", targetX -210)
        .attr("y",targetY- 70)
        .attr("text-anchor","end")
        .attr("class","annotation-text")
        .text("Alcaraz and Sinner win every Grand Slam in 2024–2025.");
}
d3.select("#previous-btn")
    .on("click",function(){
        if(currentScene>0){
            currentScene =currentScene -1;
            updateScene();}
    });
d3.select("#next-btn")
    .on("click",function(){
        if (currentScene< scenes.length -1) {
            currentScene=currentScene +1;
            updateScene(); }
    });