<template>
  <meta charset="utf-8">
  <h1 class="title">resizable icon cloud</h1>	
    <div id="d3-box">
      <div id="d3-graph">
        
      </div>
    </div>
</template>

<script>
import * as d3 from "d3";
import * as json from "../assets/data.json";

export default {
  name: 'AppBody',
  mounted: function() {
    function responsivefy(svg) {
        
        // get container + svg aspect ratio
        var container = d3.select('#d3-graph'),
            width = window.innerWidth,
            height = window.innerHeight,
            aspect = width / height;
            console.log('size of container: ', width, height, container)
        // add viewBox and preserveAspectRatio properties,
        // and call resize so that svg resizes on inital page load
        svg.attr("viewBox", "0 -100 " + width + " " + height)
            .attr("perserveAspectRatio", "xMinYMid")
            .call(resize);

        // to register multiple listeners for same event type, 
        // you need to add namespace, i.e., 'click.foo'
        // necessary if you call invoke this function for multiple svgs
        // api docs: https://github.com/mbostock/d3/wiki/Selections#on
        d3.select(window).on("resize." + container.attr("id"), resize);

        // get width of container and resize svg to fit it
        function resize() {
            var targetWidth = window.innerWidth;
            svg.attr("width", targetWidth);
            svg.attr("height", Math.round(targetWidth / aspect));
        }
    }

    
    //var width = window.innerWidth;
    // var height = window.innerHeight;
    
    var width = window.innerWidth;
    var height = window.innerHeight / 2;

    console.log('size of container d3-graph: ', width, height)
      
    var nodes = json;
    
    var root = nodes[0];
    root.radius = 0;
    root.fixed = true;

    const forceX = d3.forceX().strength(0.01)
    const forceY = d3.forceY().strength(0.01)

    var svg = d3.select("#d3-graph").append("svg:svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)
    .call(responsivefy);

    var defs = svg.append("defs")

    defs.selectAll('.nodes-pics')
      .data(nodes)
    .enter().append("pattern")
      .attr("id", function(d) { return d.id; })
      .attr("width", "100%")
      .attr("height", "100%")
      .append("image")
      .attr("href", function(d) {
      const imagePath = d.image;
      return imagePath;
    })
      .attr("width", 100)
      .attr("height", 100);

      svg.selectAll("circle")
          .data(nodes)
        .enter().append("circle")
          .attr("r", function(d) { return d.radius; })        
          .attr("fill", function(d) { return "url(#" + d.id + ")" })
          .attr("transform", "translate(" + width / 2 + ", " + height / 2 +")");
      
      var force = d3.forceSimulation()
      .velocityDecay(0.3)
      .force("x", forceX)
      .force("y", forceY)
      .force("collide", d3.forceCollide().radius(function(d){
        if(d === root){
          return Math.random() * 50 + 50;
        }
        return d.radius + 0.5;
      }).iterations(5))

      .nodes(nodes).on("tick", ticked);

      

      function ticked() {
          svg.selectAll("circle")
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
      }

      svg.on("mousemove", function() {
          var p1 = d3.pointer(event);
          root.fx = p1[0] - width / 2;
          root.fy = p1[1] - height / 2;
          force.alphaTarget(0.2).restart(); //reheat the simulation
      });
  }
}  
</script>
