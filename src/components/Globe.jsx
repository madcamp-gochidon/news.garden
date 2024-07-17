import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Globe = ({ onCountryClick, isInitial }) => {
  const ref = useRef();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(ref.current).append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g");

    const initialRotation = [10, 30];
    const projection = d3.geoOrthographic()
      .scale(Math.min(width, height) / 2 - 50)
      .translate([width / 2, height / 2])
      .clipAngle(90);
      // .rotate(initialRotation);

    const path = d3.geoPath().projection(projection);

    d3.json("src/data/world.geojson")
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

    let rotationActive = isInitial;

    const drag = d3.drag()
      .on("start", () => {
        rotationActive = false; // Stop rotation on drag start
      })
      .on("drag", (event) => {
        const rotate = projection.rotate();
        const k = 90 / (2 * Math.PI);
        projection.rotate([rotate[0] + event.dx / k, rotate[1] - event.dy / k]);
        g.selectAll("path").attr("d", path);
      });

    svg.call(drag);

    const zoom = d3.zoom()
      .scaleExtent([0.5, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      svg.attr("width", '100%')
         .attr("height", '100%')
         .attr("viewBox", `0 0 ${newWidth} ${newHeight}`);
      projection
        .scale(Math.min(newWidth, newHeight) / 2 - 50)
        .translate([newWidth / 2, newHeight / 2]);
      g.selectAll("path").attr("d", path);
    };

    window.addEventListener('resize', handleResize);

    if (isInitial) {
      // Add rotation animation
      let rotationSpeed = 100; // initial speed
      const rotate = () => {
        if (!rotationActive) return true; // Stop animation if rotationActive is false
        const rotate = projection.rotate();
        rotationSpeed *= 0.98; // gradually slow down
        if (rotationSpeed < 0.001) return true; // stop animation when speed is very low
        projection.rotate([rotate[0] + rotationSpeed, rotate[1]]);
        g.selectAll("path").attr("d", path);
        return false;
      };

      // Use d3.interval to stop rotation after some time
      const interval = d3.interval(() => {
        if (rotate()) {
          interval.stop(); // Stop the interval if rotation animation is finished
        }
      }, 20);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onCountryClick, isInitial]);

  return (
    <div id="globe-container" ref={ref} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column' }}>
      </div>
    </div>
  );
};

export default Globe;