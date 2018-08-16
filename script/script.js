var width = $(".canvas").width(),
    height = $(".canvas").height(),
    padding = 1.5, // separation between same-color circles
    clusterPadding = 6, // separation between different-color circles
    maxRadius = 25;

var svg = d3.select('.canvas').append('svg')
  .attr('width', width)
  .attr('height', height);

var force = d3.layout.force()
    .gravity(.6)
    .distance(100)
    .charge(-400)
    .size([width, height]);

var customBio = d3.select('.bio')    ;

d3.json("SeminarFinalProject/diagram.json", function(error, graph){
    if (error) throw error;

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter()
            .append("line")
            .attr("class","link")
            .style("stroke-width","3px")
            .style("stroke","grey")
            .style("opacity", ".5")
            .style("stroke-linecap","arrow");

    var node = svg.selectAll(".node")
        .data(graph.nodes)
            .enter()
                .append("g")
                .attr("class","node")
                .on('click', click)
                .call(force.drag);

                node.append("circle")
                .attr("class", "node")
                .attr("r", function (d){
                    if (d.value < 15){return (d.value * 2)} 
                    else {return d.value}})
                .style("fill", "green")
                .style("opacity", ".8")
                ;
                

                node.append("title")
                    .text(function(d) { return d.name; });

                node.append('text')
                    .attr("dx", function(d){return d.value * 2})
                    .attr("dy",".5em")
                    .attr("font-size",function(d){
                        if(d.value > 15){return 1.5+'em'}
                        else if(d.value > 4){return d.value/8 + 'em'}
                            else{return .5 + 'em'}
                    })
                    .text(function(d) { return d.name});
    

    link.append("title")
        .text(function(d){return d.paper;});

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

            });

      function click(d) {

    d3.select('.bio')
        .style('visibility','visible');
    customBio.select('.name')
        .html(d.name);

    //inject data into content of tooltip
    var table = customBio.select('.data-table')

      table.select('.group')
        .html('Group')
      table.select('.groupValue')
        .html(d.group)

     if (d.papers){ 
            table.select('.papers')
                .html('Papers Written')
            table.select('.papersValue')
                .html(d.papers)}
        else {table.select('.papers')
                .html(d.papers)
            table.select('.papersValue')
                .html(d.papers)}


      if(d.college[0].undergrad && d.college[0].undergradYear){
            table.select('.undergrad')
                .html('Undergraduate School')
            table.select('.undergradValue')
                .html(d.college[0].undergrad + ' in ' + d.college[0].undergradYear)
    } else if (d.college[0].undergrad) { table.select('.undergrad')
                .html('Undergraduate School')
            table.select('.undergradValue')
                .html(d.college[0].undergrad)}
        else {table.select('.undergrad')
                .html(d.college[0].undergrad)
            table.select('.undergradValue')
                .html(d.college[0].undergrad)}
      
      if(d.college[0].graduate && d.college[0].graduateYear){
            table.select('.graduate')
                .html('Graduate School')
            table.select('.graduateValue')
                .html(d.college[0].graduate + ' in ' + d.college[0].graduateYear)
      }else if(d.college[0].graduate){ 
            table.select('.graduate')
                .html('Graduate School')
            table.select('.graduateValue')
                .html(d.college[0].graduate)}
        else{ 
            table.select('.graduate')
                .html(d.college[0].graduate)
            table.select('.graduateValue')
                .html(d.college[0].graduate)}

    if(d.college[0].phd && d.college[0].phdYear){
      table.select('.phd')
        .html('PhD')
      table.select('.phdValue')
        .html(d.college[0].phd + ' in ' + d.college[0].phdYear)
    } else if (d.college[0].phd){
      table.select('.phd')
        .html('PhD')
      table.select('.phdValue')
        .html(d.college[0].phd)}
    else{table.select('.phd')
        .html(d.college[0].phd)
      table.select('.phdValue')
        .html(d.college[0].phd)}



}

function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}




});


