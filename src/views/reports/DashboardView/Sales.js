import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import * as d3 from 'd3'
const useStyles = makeStyles(() => ({
  root: {}
}));

const Sales = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const refBarChart = useRef(null);
  useEffect(() => {

    renderD3JsChart()
  }, [])

  const renderD3JsChart = () => {
    var m = [30, 40, 20, 220], // top right bottom left
      w = 1000 - m[1] - m[3], // width
      h = 400 - m[0] - m[2], // height
      x = d3.scale.linear().range([0, w]),
      y = 20, // bar height
      z = d3.scale.ordinal().range(["steelblue", "#ccc"]), // bar color
      duration = 750,
      delay = 25;

    var hierarchy = d3.layout.partition()
      .value(function (d) { return d.size; });

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");

    var svg = d3.select(refBarChart.current).append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    svg.append("svg:rect")
      .attr("class", "background")
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "white")
      .on("click", up);

    svg.append("svg:g")
      .attr("class", "x axis")
      .attr("fill", "black");

    svg.append("svg:g")
      .attr("class", "y axis")
      .append("svg:line")
      .attr("y1", "100%");
      //.attr("fill", "white");

    d3.json("drilldownBarGraphMockData.json", function (root) {
      hierarchy.nodes(root);
      x.domain([0, root.value]).nice();
      down(root, 0);
    });

    function down(d, i) {
      if (!d.children/*  || __transition__ */) return;
      var end = duration + d.children.length * delay;

      // Mark any currently-displayed bars as exiting.
      var exit = svg.selectAll(".enter").attr("class", "exit");

      // Entering nodes immediately obscure the clicked-on bar, so hide it.
      exit.selectAll("rect").filter(function (p) { return p === d; })
        .style("fill-opacity", 1e-6);

      // Enter the new bars for the clicked-on data.
      // Per above, entering bars are immediately visible.
      var enter = bar(d)
        .attr("transform", stack(i))
        .style("opacity", 1);

      // Have the text fade-in, even though the bars are visible.
      // Color the bars as parents; they will fade to children if appropriate.
      enter.select("text").style("fill-opacity", 1e-6);
      enter.select("text").style("fill", "black");
      enter.select("rect").style("fill", z(true));

      // Update the x-scale domain.
      x.domain([0, d3.max(d.children, function (d) { return d.value; })]).nice();

      // Update the x-axis.
      svg.selectAll(".x.axis").transition().duration(duration).call(xAxis);

      // Transition entering bars to their new position.
      var enterTransition = enter.transition()
        .duration(duration)
        .delay(function (d, i) { return i * delay; })
        .attr("transform", function (d, i) { return "translate(0," + y * i * 1.2 + ")"; });

      // Transition entering text.
      enterTransition.select("text").style("fill-opacity", 1);
      enter.select("text").style("fill", "black");

      // Transition entering rects to the new x-scale.
      enterTransition.select("rect")
        .attr("width", function (d) { return x(d.value); })
        .style("fill", function (d) { return z(!!d.children); });

      // Transition exiting bars to fade out.
      var exitTransition = exit.transition()
        .duration(duration)
        .style("opacity", 1e-6)
        .remove();

      // Transition exiting bars to the new x-scale.
      exitTransition.selectAll("rect").attr("width", function (d) { return x(d.value); });

      // Rebind the current node to the background.
      svg.select(".background").data([d]).transition().duration(end); d.index = i;
    }

    function up(d) {
      if (!d.parent || this.__transition__) return;
      var end = duration + d.children.length * delay;

      // Mark any currently-displayed bars as exiting.
      var exit = svg.selectAll(".enter").attr("class", "exit");

      // Enter the new bars for the clicked-on data's parent.
      var enter = bar(d.parent)
        .attr("transform", function (d, i) { return "translate(0," + y * i * 1.2 + ")"; })
        .style("opacity", 1e-6);

      // Color the bars as appropriate.
      // Exiting nodes will obscure the parent bar, so hide it.
      enter.select("rect")
        .style("fill", function (d) { return z(!!d.children); })
        .filter(function (p) { return p === d; })
        .style("fill-opacity", 1e-6);

      // Update the x-scale domain.
      x.domain([0, d3.max(d.parent.children, function (d) { return d.value; })]).nice();

      // Update the x-axis.
      svg.selectAll(".x.axis").transition().duration(duration).call(xAxis);

      // Transition entering bars to fade in over the full duration.
      var enterTransition = enter.transition()
        .duration(end)
        .style("opacity", 1);

      // Transition entering rects to the new x-scale.
      // When the entering parent rect is done, make it visible!
      enterTransition.select("rect")
        .attr("width", function (d) { return x(d.value); })
        .each("end", function (p) { if (p === d) d3.select(this).style("fill-opacity", null); });

      // Transition exiting bars to the parent's position.
      var exitTransition = exit.selectAll("g").transition()
        .duration(duration)
        .delay(function (d, i) { return i * delay; })
        .attr("transform", stack(d.index));

      // Transition exiting text to fade out.
      exitTransition.select("text")
        .style("fill-opacity", 1e-6);
      exitTransition.select("text").style("fill", "black");

      // Transition exiting rects to the new scale and fade to parent color.
      exitTransition.select("rect")
        .attr("width", function (d) { return x(d.value); })
        .style("fill", z(true));
      exitTransition.select("text").style("fill", "black");

      // Remove exiting nodes when the last child has finished transitioning.
      exit.transition().duration(end).remove();

      // Rebind the current parent to the background.
      svg.select(".background").data([d.parent]).transition().duration(end);;
    }

    // Creates a set of bars for the given data node, at the specified index.
    function bar(d) {
      var bar = svg.insert("svg:g", ".y.axis")
        .attr("class", "enter")
        .attr("transform", "translate(0,5)")
        .selectAll("g")
        .data(d.children)
        .enter().append("svg:g")
        .style("cursor", function (d) { return !d.children ? null : "pointer"; })
        .on("click", down);

      bar.append("svg:text")
        .attr("x", -6)
        .attr("y", y / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function (d) { return d.name; });

      bar.append("svg:rect")
        .attr("width", function (d) { return x(d.value); })
        .attr("height", y);

      return bar;
    }

    // A stateful closure for stacking bars horizontally.
    function stack(i) {
      var x0 = 0;
      return function (d) {
        var tx = "translate(" + x0 + "," + y * i * 1.2 + ")";
        x0 += x(d.value);
        return tx;
      };
    }
  }





  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        /* action={(
          <Button
            endIcon={<ArrowDropDownIcon />}
            size="small"
            variant="text"
          >
            Last 7 days
          </Button>
        )} */
        title="Drill down bar graph - Cash Flows"
      />
      <Divider />
      <CardContent>
        <Box
          height={400}
          position="relative"
        >
          {/*  <div ref={refBarChart} >
            <h1 style={{ textAlign: "center" }}></h1>
          </div> */}
          {/*  <Bar
            data={data}
            options={options}
          /> */}
          <div ref={refBarChart}></div>
        </Box>
      </CardContent>
      <Divider />
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          Overview
        </Button>
      </Box>
    </Card>
  );
};

Sales.propTypes = {
  className: PropTypes.string
};

export default Sales;
