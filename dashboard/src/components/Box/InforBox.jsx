// Create a new file, e.g., InfoBox.js
import React from "react";
import { Typography, Grid } from "@mui/material";
import styled from "@emotion/styled";
/* eslint-disable */

const GridCustomCreate = styled(Grid)(({ theme }) => ({
    backgroundColor: "white",
    borderRadius: "14px",
    padding: "5px",
    margin: "12px 0",
}));

const InfoBox = ({ title, children }) => {
    return (
        <GridCustomCreate container spacing={1}>
            <Grid item lg={3} xs={12} md={4}>
                <Typography
                    variant="h6"
                    component="h6"
                    sx={{
                        color: "black",
                    }}
                >
                    {title}
                </Typography>
            </Grid>
            <Grid item lg={9} xs={12} md={12}>
                <div>{children}</div>
            </Grid>
        </GridCustomCreate>
    );
};

export default InfoBox;
