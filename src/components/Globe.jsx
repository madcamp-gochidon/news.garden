import React, { useEffect, forwardRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';

const Globe = forwardRef(({ onCountryClick }, ref) => {
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(ref.current).append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g");

    const projection = d3.geoOrthographic()
      .scale(300)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    d3.json("src/data/word.geojson")
      .then(world => {
        g.selectAll("path")
          .data(world.features)
          .enter().append("path")
          .attr("d", path)
          .attr("stroke", "#000")
          .attr("fill", "#ccc")
          .on("click", (event, d) => {
            const [[x0, y0], [x1, y1]] = path.bounds(d);
            const dx = x1 - x0;
            const dy = y1 - y0;
            const x = (x0 + x1) / 2;
            const y = (y0 + y1) / 2;
            const scale = 0.8 / Math.max(dx / width, dy / height);
            const translate = [width / 2 - scale * x, height / 2 - scale * y];

            console.log(dx, dy, x, y, scale, translate);

            g.transition().duration(1500)
              .attr("transform", `translate(${translate[0]}, ${translate[1]}) scale(${scale})`)
              .on("end", () => {
                onCountryClick(d);
                g.style("visibility", "hidden");
              });
          });

        const graticule = d3.geoGraticule();
        g.append("path")
          .datum(graticule)
          .attr("d", path)
          .attr("stroke", "#ccc")
          .attr("fill", "none");
      });

    const drag = d3.drag()
      .on("drag", (event) => {
        const rotate = projection.rotate();
        const k = 90 / (2 * Math.PI);
        projection.rotate([rotate[0] + event.dx / k, rotate[1] - event.dy / k]);
        g.selectAll("path").attr("d", path);
      });

    svg.call(drag);
  }, [onCountryClick, ref]);

  return (
    <div id="globe-container" ref={ref} style={{ width: '100vw', height: '100vh' }} />
  );
});

export default Globe;