import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import ProductCard from './ProductCard';
import TrendGraph from './TrendGraph';
import data from './data';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));

const ProductList = () => {
  const classes = useStyles();
  const [products] = useState(data);
  const product = null;

  return (
    <Page
      className={classes.root}
      title="Landing Screen"
    >
      <Container maxWidth={false}>
        {/*  <Toolbar /> */}
        <Box mt={3}>
          <Grid
            container
            spacing={3}
          >

            <Grid
              item
              lg={4}
              md={6}
              xs={12}
            >
              <ProductCard
                className={classes.productCard}
                title={"Enterprise Liquidity Aggregation/ LCS & NSFR"}
                description={""}
              />
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xs={12}
            >
              <ProductCard
                className={classes.productCard}
                title={"Region / Entity List"}
                description={""}
              />
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xs={12}
            >
              <TrendGraph
                className={classes.productCard}
                title={"30 day trend graph"}
              />
            </Grid>

          </Grid>
          <Grid
            container
            spacing={3}
          >

            <Grid
              item
              lg={6}
              md={6}
              xs={12}
            >
              <ProductCard
                className={classes.productCard}
                title={"LCR/NSFR Composite Details"}
                description={""}
              />
            </Grid>
            <Grid
              item
              lg={6}
              md={6}
              xs={12}
            >
              <ProductCard
                className={classes.productCard}
                title={"Drilldown of date ranges"}
                description={""}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
          >

            <Grid
              item
              lg={6}
              md={6}
              xs={12}
            >
              <ProductCard
                className={classes.productCard}
                title={"Drilldown of LCR/NSFR Composite"}
                description={""}
              />
            </Grid>
            <Grid
              item
              lg={6}
              md={6}
              xs={12}
            >
              <ProductCard
                className={classes.productCard}
                title={"Macro View of Anomalies"}
                description={""}
              />
            </Grid>
          </Grid>
        </Box>

      </Container>


    </Page>
  );
};

export default ProductList;
