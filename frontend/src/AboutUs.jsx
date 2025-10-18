import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SharedHeader from "./SharedHeader.jsx";

function AboutUs() {
  const navigate = useNavigate();

  return (
    <>
      <SharedHeader />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            About Us
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto" }}
          >
            Dedicated to finding loving homes for every pet in our care
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ color: "primary.main" }}
                >
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph>
                  We are a non-profit pet adoption center committed to rescuing,
                  rehabilitating, and rehoming animals in need. Our mission is
                  to provide a safe haven for abandoned, abused, and neglected
                  pets while finding them loving, permanent homes.
                </Typography>
                <Typography variant="body1">
                  Every pet deserves a second chance at happiness, and we work
                  tirelessly to make that dream a reality for as many animals as
                  possible.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ color: "primary.main" }}
                >
                  Our Story
                </Typography>
                <Typography variant="body1" paragraph>
                  Founded in 2015 by a group of passionate animal lovers, our
                  center has grown from a small volunteer operation to a
                  comprehensive adoption facility serving our community.
                </Typography>
                <Typography variant="body1">
                  Over the years, we've successfully placed over 2,000 pets in
                  loving homes and continue to expand our services to help even
                  more animals in need.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default AboutUs;
