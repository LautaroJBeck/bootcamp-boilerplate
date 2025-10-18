import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";

function SharedHeader() {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      <AppBar position="static">
        <Toolbar>
          <Box
            component="img"
            src={logo}
            alt="Pawgrammer Logo"
            sx={{
              height: 40,
              mr: 2, // margin-right adds space between logo and text
              borderRadius: "8px", // optional for rounded corners
            }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pawgrammer Puppies 🐶
          </Typography>
          <Button
            sx={{
              color: "blue",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "blue", color: "white" },
              m: 1,
            }}
            onClick={() => navigate("/")}
          >
            Meet the Puppies
          </Button>
          <Button
            sx={{
              color: "blue",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "blue", color: "white" },
              m: 1,
            }}
            onClick={() => navigate("/about")}
          >
            About Us
          </Button>
          <Button
            sx={{
              color: "blue",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "blue", color: "white" },
              m: 1,
            }}
            onClick={() => navigate("/plan-visit")}
          >
            Plan Your Visit
          </Button>
          <Button color="inherit">Login</Button>
          <Box />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SharedHeader;
