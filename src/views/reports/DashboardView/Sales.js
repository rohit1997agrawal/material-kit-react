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
import { DirectionsWalkOutlined } from '@material-ui/icons';
const useStyles = makeStyles(() => ({
  root:
  {
    text:  {
      fontSize : '10px' 
  },

rect : {
  background : {
  fill: "white"
}
}
  
/*   .axis {
  shape - rendering: crispEdges;
}
  
  .axis path,
  .axis line {
  fill: none;
  stroke: #000;
}
  } 
  })*/
}})
);

var drilldownBarGraphMockData = {
  "name": "flare",
  "children": [
    {
      "name": "ICG",
      "children": [
        {
          "name": "Loans",
          "children": [
            {
              "name": "Commercial and industrial loans",
              "size": 39380
            },
            {
              "name": "Financial institutions",
              "size": 38120
            },
            {
              "name": "Mortage and real estate",
              "size": 67140
            },
            {
              "name": "Installment , revolving credit ",
              "size": 7430
            },
            {
              "name": "Lease financing",
              "size": 7430
            }
          ]
        },
        {
          "name": "Long Term Debt",
          "size": 39380
        },
        {
          "name": "Deposits",
          "size": 49380
        },
        {
          "name": "Secured funding transactions",
          "size": 69380
        },
        {
          "name": "Short Term borrowings",
          "size": 19380
        }
      ]
    },
    {
      "name": "GCB",
      "children": [
        {
          "name": "Loans",
          "children": [
            {
              "name": "Commercial and industrial loans",
              "size": 69385
            },
            {
              "name": "Financial institutions",
              "size": 68125
            },
            {
              "name": "Mortage and real estate",
              "size": 87145
            },
            {
              "name": "Installment , revolving credit ",
              "size": 9455
            },
            {
              "name": "Lease financing",
              "size": 9435
            }
          ]
        },
        {
          "name": "Long Term Debt",
          "size": 39385
        },
        {
          "name": "Deposits",
          "size": 49385
        },
        {
          "name": "Secured funding transactions",
          "size": 69385
        },
        {
          "name": "Short Term borrowings",
          "size": 19385
        }
      ]
    },
    {
      "name": "Regions",
      "children": [
        {
          "name": "Loans",
          "children": [
            {
              "name": "Commercial and industrial loans",
              "size": 51938
            },
            {
              "name": "Financial institutions",
              "size": 513812
            },
            {
              "name": "Mortage and real estate",
              "size": 156714
            },
            {
              "name": "Installment , revolving credit ",
              "size": 15743
            },
            {
              "name": "Lease financing",
              "size": 15743
            }
          ]
        },
        {
          "name": "Long Term Debt",
          "size": 3938
        },
        {
          "name": "Deposits",
          "size": 4938
        },
        {
          "name": "Secured funding transactions",
          "size": 6938
        },
        {
          "name": "Short Term borrowings",
          "size": 1938
        }
      ]
    },
    {
      "name": "Enterprise",
      "children": [
        {
          "name": "Loans",
          "children": [
            {
              "name": "Commercial and industrial loans",
              "size": 393800
            },
            {
              "name": "Financial institutions",
              "size": 381200
            },
            {
              "name": "Mortage and real estate",
              "size": 671400
            },
            {
              "name": "Installment , revolving credit ",
              "size": 74300
            },
            {
              "name": "Lease financing",
              "size": 74300
            }
          ]
        },
        {
          "name": "Long Term Debt",
          "size": 393800
        },
        {
          "name": "Deposits",
          "size": 493800
        },
        {
          "name": "Secured funding transactions",
          "size": 693800
        },
        {
          "name": "Short Term borrowings",
          "size": 193800
        }
      ]
    }
  ]
}

const Sales = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const refBarChart = useRef(null);
  useEffect(() => {

    renderD3JsChart()
  }, [])

  const renderD3JsChart = () => {
    var margin = { top: 30, right: 120, bottom: 0, left: 220 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
      .range([0, width]);

    var barHeight = 20;

    var color = d3.scaleOrdinal()
      .range(["steelblue", "#ccc"]);

    var duration = 750,
      delay = 25;

    var xAxis = d3.axisTop(x);

    var svg = d3.select(refBarChart.current).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .attr("fill","white")
      .on("click", up);

    svg.append("g")
      .attr("class", "x axis");

    svg.append("g")
      .attr("class", "y axis")
      .append("line")
      .attr("y1", "100%");

    var root = d3.hierarchy(drilldownBarGraphMockData)
      .sum(function (d) { return d.size; });
    x.domain([0, root.value]).nice();
    down(root, 0);

    function down(d, i) {
      if (!d.children/*  || __transition__ */) return;
      var end = duration + d.children.length * delay;

      // Mark any currently-displayed bars as exiting.
      var exit = svg.selectAll(".enter")
        .attr("class", "exit");

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
      enter.select("rect").style("fill", color(true));
  

      // Update the x-scale domain.
      x.domain([0, d3.max(d.children, function (d) { return d.value; })]).nice();

      // Update the x-axis.
      svg.selectAll(".x.axis").transition()
        .duration(duration)
        .call(xAxis);

      // Transition entering bars to their new position.
      var enterTransition = enter.transition()
        .duration(duration)
        .delay(function (d, i) { return i * delay; })
        .attr("transform", function (d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; });

      // Transition entering text.
      enterTransition.select("text")
        .style("fill-opacity", 1);

      // Transition entering rects to the new x-scale.
      enterTransition.select("rect")
        .attr("width", function (d) { return x(d.value); })
        .style("fill", function (d) { return color(!!d.children); });
       

      // Transition exiting bars to fade out.
      var exitTransition = exit.transition()
        .duration(duration)
        .style("opacity", 1e-6)
        .remove();

      // Transition exiting bars to the new x-scale.
      exitTransition.selectAll("rect")
        .attr("width", function (d) { return x(d.value); });

      // Rebind the current node to the background.
      svg.select(".background")
        .datum(d)
        .transition()
        .duration(end);

      d.index = i;
    }

    function up(d) {
      if (!d.parent || this.__transition__) return;
      var end = duration + d.children.length * delay;

      // Mark any currently-displayed bars as exiting.
      var exit = svg.selectAll(".enter")
        .attr("class", "exit");

      // Enter the new bars for the clicked-on data's parent.
      var enter = bar(d.parent)
        .attr("transform", function (d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; })
        .style("opacity", 1e-6);

      // Color the bars as appropriate.
      // Exiting nodes will obscure the parent bar, so hide it.
      enter.select("rect")
        .style("fill", function (d) { return color(!!d.children); })
        .filter(function (p) { return p === d; })
        .style("fill-opacity", 1e-6);

      // Update the x-scale domain.
      x.domain([0, d3.max(d.parent.children, function (d) { return d.value; })]).nice();

      // Update the x-axis.
      svg.selectAll(".x.axis").transition()
        .duration(duration)
        .call(xAxis);

      // Transition entering bars to fade in over the full duration.
      var enterTransition = enter.transition()
        .duration(end)
        .style("opacity", 1);

      // Transition entering rects to the new x-scale.
      // When the entering parent rect is done, make it visible!
      enterTransition.select("rect")
        .attr("width", function (d) { return x(d.value); })
        .on("end", function (p) { if (p === d) d3.select(this).style("fill-opacity", null); });

      // Transition exiting bars to the parent's position.
      var exitTransition = exit.selectAll("g").transition()
        .duration(duration)
        .delay(function (d, i) { return i * delay; })
        .attr("transform", stack(d.index));

      // Transition exiting text to fade out.
      exitTransition.select("text")
        .style("fill-opacity", 1e-6);

      // Transition exiting rects to the new scale and fade to parent color.
      exitTransition.select("rect")
        .attr("width", function (d) { return x(d.value); })
        .style("fill", color(true));

      // Remove exiting nodes when the last child has finished transitioning.
      exit.transition()
        .duration(end)
        .remove();

      // Rebind the current parent to the background.
      svg.select(".background")
        .datum(d.parent)
        .transition()
        .duration(end);
    }

    // Creates a set of bars for the given data node, at the specified index.
    function bar(d) {
      var bar = svg.insert("g", ".y.axis")
        .attr("class", "enter")
        .attr("transform", "translate(0,5)")
        .selectAll("g")
        .data(d.children)
        .enter().append("g")
        .style("cursor", function (d) { return !d.children ? null : "pointer"; })
        .on("click", down);

      bar.append("text")
        .attr("x", -6)
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d.data.name; });

      bar.append("rect")
        .attr("width", function (d) { return x(d.value); })
        .attr("height", barHeight);

      return bar;
    }

    // A stateful closure for stacking bars horizontally.
    function stack(i) {
      var x0 = 0;
      return function (d) {
        var tx = "translate(" + x0 + "," + barHeight * i * 1.2 + ")";
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
          height={200}
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
        {/*    <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          Overview
        </Button> */}
      </Box>
    </Card>
  );
};

Sales.propTypes = {
  className: PropTypes.string
};

export default Sales;
