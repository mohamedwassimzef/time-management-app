import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import { redirect, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: "onBlur" // Validate when user leaves the field
  });

  const onSubmit = async(data) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const respon = await res.json();
      console.log(respon);

      if (res.ok) {
        navigate("/");
      } else {
        console.error(respon.message || "Signup failed");
      }
    } catch (error) {
      alert("Server error");
      console.error(error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center" mb={2}>
        Sign Up
      </Typography>
      
      <TextField
        label="First Name"
        fullWidth
        {...register("firstName", { required: "First name is required" })}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
      
      <TextField
        label="Last Name"
        fullWidth
        {...register("lastName", { required: "Last name is required" })}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />
      
      <TextField
        label="Email"
        type="email"
        fullWidth
        {...register("email", { 
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Please enter a valid email address"
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      
      <TextField
        label="Password"
        type="password"
        fullWidth
        {...register("password", { 
          required: "Password is required", 
          minLength: { value: 8, message: "Password must be at least 8 characters" },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message: "Password must contain uppercase, lowercase, number, and special character"
          }
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        {...register("confirmPassword", { 
          required: "Please confirm your password",
          validate: (value) => value === watch("password") || "Passwords do not match"
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <TextField
        label="Birthdate"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        {...register("birthdate", { required: "Birthdate is required" })}
        error={!!errors.birthdate}
        helperText={errors.birthdate?.message}
      />
      
      <Button type="submit" variant="contained" size="large" fullWidth>
        Sign Up
      </Button>
    </Box>
  );
}
