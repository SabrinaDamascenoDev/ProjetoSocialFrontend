import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import { useAuth } from "../../contexts/AuthContext";
import { type LoginFormData, loginSchema } from "./schema";

import logo from "../../assets/logo.png";

export function Login() {
  const { login } = useAuth();

  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(data: LoginFormData) {
    try {
      setLoginError("");
      await login(data.username, data.password);

      console.log('logou')
    } catch {
      setLoginError("Credenciais inválidas");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "46%",
          minHeight: "100vh",
          backgroundColor: "primary.main",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center",
          px: { md: 6, lg: 8, xl: 10 },
          py: { md: 5, lg: 6 },
          boxSizing: "border-box",
          borderTopRightRadius: "85px",
          borderBottomRightRadius: "85px",

          "@media (max-width: 900px)": {
            display: "none",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Caça Placas"
            sx={{
              width: { md: 170, lg: 200, xl: 220 },
              height: "auto",
              objectFit: "contain",
              mb: { md: 5, lg: 6, xl: 7 },
            }}
          />

          <Typography
            sx={{
              color: "primary.contrastText",
              fontSize: { md: "2.1rem", lg: "2.8rem", xl: "3.3rem" },
              lineHeight: 1.18,
              fontWeight: 700,
              textAlign: "left", 
              width: "100%",
            }}
          >
            Sistema de
            <br />
            georreferenciamento
            <br />
            da sinalização de
            <br />
            trânsito de Quixadá
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          px: {
            xs: 3,
            sm: 5,
            md: 7,
            lg: 10,
            xl: 12,
          },

          py: 5,

          boxSizing: "border-box",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(handleLogin)}
          sx={{
            width: "100%",
            maxWidth: 610,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              color: "text.primary",
              fontFamily: '"Montserrat", sans-serif',
              fontSize: {
                xs: "2rem",
                sm: "2.3rem",
                md: "2.6rem",
                lg: "2.8rem",
              },
              fontWeight: 800,
              fontStyle: "normal",
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
              mb: 0.3,
            }}
          >
            BEM - VINDO!
          </Typography>

          <Typography
            sx={{
              color: "text.primary",
              fontSize: {
                xs: "1.9rem",
                sm: "2.2rem",
                md: "2.5rem",
                lg: "2.7rem",
              },
              fontWeight: 400,
              lineHeight: 1.1,
              mb: 0.8,
            }}
          >
            Acesse sua conta
          </Typography>

          <Typography
            sx={{
              color: "text.primary",

              fontSize: {
                xs: "1rem",
                md: "1.1rem",
                lg: "1.2rem",
              },

              mb: 4,
            }}
          >
            Digite suas informações para continuar
          </Typography>

          {loginError && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
              }}
            >
              {loginError}
            </Alert>
          )}

          <TextField
            label="E-mail"
            type="username"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            sx={{
              mb: 2.2,

              "& .MuiOutlinedInput-root": {
                height: 58,
                borderRadius: 1.5,
              },

              "& .MuiInputLabel-root": {
                color: "text.primary",
              },

              "& .MuiInputLabel-root.Mui-focused": {
                color: "secondary.main",
              },
            }}
          />

          <TextField
            label="Senha"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 58,
                borderRadius: 1.5,
              },

              "& .MuiInputLabel-root": {
                color: "text.primary",
              },

              "& .MuiInputLabel-root.Mui-focused": {
                color: "secondary.main",
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 0.5,
              mb: 3.5,
            }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label="Lembrar de mim"
              sx={{
                m: 0,
                color: "text.primary",
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.95rem",
                },
              }}
            />

            <Link
              href="/recuperar-senha"
              underline="hover"
              sx={{
                color: "text.primary",
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Esqueceu a senha?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              width: "100%",
              height: 58,
              borderRadius: 1.5,
              fontSize: "1.5rem",
              fontWeight: 700,

              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              "Entrar"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
