import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data); // send to backend
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
        {...register("email", { required: "Email is required" })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      
      <TextField
        label="Password"
        type="password"
        fullWidth
        {...register("password", { required: "Password is required", minLength: 6 })}
        error={!!errors.password}
        helperText={errors.password?.message}
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
