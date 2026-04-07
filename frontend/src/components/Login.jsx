import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "./AxiosInstance";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setErrorMessage("Email and password are required");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
      };

      const response = await AxiosInstance.post("login/", payload);
      const data = response.data;

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data?.user?.role === "admin") {
        navigate("/home");
      } else {
        navigate("/employee_home");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage("Invalid email or password");
      } else if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("Login failed. Please try again.");
      }

      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "#eef2f7",
      }}
    >
      {/* LEFT BLUE PANEL */}
      <Box
        sx={{
          width: "40%",
          background: "linear-gradient(180deg, #0f172a, #1e3a8a)",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: 8,
          color: "#fff",
        }}
      >
        <Typography
          sx={{
            fontSize: "48px",
            fontWeight: 800,
            mb: 2,
          }}
        >
          Employee MS
        </Typography>

        <Typography sx={{ fontSize: "18px", opacity: 0.9 }}>
          Manage employees, salary, and leave all in one place.
        </Typography>
      </Box>

      {/* RIGHT LOGIN CARD */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "400px",
            p: 4,
            borderRadius: "20px",
            background: "#ffffff",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 800,
              mb: 3,
              color: "#0f172a",
            }}
          >
            Login
          </Typography>

          <form onSubmit={handleSubmit} autoComplete="on">
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              autoComplete="email"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              autoComplete="current-password"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: "12px" }}>
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                height: "50px",
                borderRadius: "12px",
                background: "#1e3a8a",
                color: "#fff",
                fontWeight: 700,
                fontSize: "16px",
                textTransform: "none",
                "&:hover": {
                  background: "#1d4ed8",
                },
                "&.Mui-disabled": {
                  background: "#94a3b8",
                  color: "#fff",
                },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;