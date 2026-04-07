import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AxiosInstance from "./AxiosInstance";
import MyTextField from "./forms/MyTextField";
import MyPassField from "./forms/MyPassField";

const Register = () => {
  const navigate = useNavigate();

  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  

 const submission = async (data) => {

  
  try {
    const response = await AxiosInstance.post("register/", {
      email: data.email,
      password: data.password,
      
    });
    

    console.log("Success:", response.data);
    alert("Registration successful");
    navigate("/");
  } catch (error) {
    console.log("Error:", error.response?.data);
    console.log(error.response?.data)
    alert(
      error.response?.data
        ? JSON.stringify(error.response.data)
        : "Registration failed"
    );
  }
};

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 400, margin: "40px auto", padding: 4 }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>

      <Box component="form" onSubmit={handleSubmit(submission)}>
        <MyTextField
          label="Email"
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          }}
        />

        <MyPassField
          label="Password"
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
        />

        <MyPassField
          label="Confirm Password"
          name="confirm_password"
          control={control}
          rules={{
            required: "Confirm password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          }}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>

        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Already have an account? <Link to="/">Login</Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default Register;