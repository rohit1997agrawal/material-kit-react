import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3'
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';

import './TrendsGraph.css'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  } 
}));

const ProductCard = ({ className, title, description, ...rest }) => {
  const classes = useStyles();
  const refBarChart = useRef(null);

  useEffect(() => {

    renderTrendsGraph()
   

  }, [])

  const renderTrendsGraph = () => {
    var margin = {top: 20, right: 250, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(refBarChart.current).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});

  }

  return (
    <div>
 
 
   
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
      
        <Box
          display="flex"
          justifyContent="center"
          mb={3}
        >
          {/* <Avatar
            alt="Product"
            src={product.media}
            variant="square"
          /> */}
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          {title}
        </Typography>
        
        <div ref={refBarChart}></div>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid
          container
          justify="space-between"
          spacing={2}
        >
          <Grid
            className={classes.statsItem}
            item
          >
            {/*  <AccessTimeIcon
              className={classes.statsIcon}
              color="action"
            /> */}
            {/*   <Typography
              color="textSecondary"
              display="inline"
              variant="body2"
            >
              Updated 2hr ago
            </Typography> */}
          </Grid>
          <Grid
            className={classes.statsItem}
            item
          >
            {/*   <GetAppIcon
              className={classes.statsIcon}
              color="action"
            /> */}
            {/*  <Typography
              color="textSecondary"
              display="inline"
              variant="body2"
            >
              {product.totalDownloads}
              {' '}
              Downloads
            </Typography> */}
          </Grid>
        </Grid>
      </Box>
    </Card>
    </div>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string
};

export default ProductCard;
