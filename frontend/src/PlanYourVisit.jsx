import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import SharedHeader from "./SharedHeader.jsx";

function PlanYourVisit() {
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
            Plan Your Visit
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto" }}
          >
            Schedule a visit to meet our amazing pets and learn about adoption
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {/* Visit Information */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ color: "primary.main", mb: 3 }}
                >
                  Visit Information
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main" }}
                  >
                    Hours of Operation
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM
                    <br />
                    <strong>Saturday:</strong> 10:00 AM - 5:00 PM
                    <br />
                    <strong>Sunday:</strong> 12:00 PM - 4:00 PM
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main" }}
                  >
                    Location
                  </Typography>
                  <Typography variant="body1" paragraph>
                    123 Pet Adoption Lane
                    <br />
                    Animal City, AC 12345
                    <br />
                    Phone: (555) 123-PETS
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main" }}
                  >
                    What to Expect
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    <Chip
                      label="Meet & Greet"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label="Facility Tour"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label="Adoption Process"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label="Pet Interaction"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Our friendly staff will guide you through our facility,
                    introduce you to available pets, and answer any questions
                    about the adoption process.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default PlanYourVisit;
