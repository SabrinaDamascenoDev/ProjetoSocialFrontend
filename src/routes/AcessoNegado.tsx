import { Box, Button, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export function AcessoNegado() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleBack() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 3,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            backgroundColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <LockOutlinedIcon
            sx={{ fontSize: 48, color: "primary.contrastText" }}
          />
        </Box>

        <Typography
          sx={{
            color: "text.primary",
            fontSize: { xs: "2rem", md: "2.6rem" },
            fontWeight: 800,
            lineHeight: 1.1,
            mb: 1,
          }}
        >
          Acesso negado
        </Typography>

        <Typography
          sx={{
            color: "text.primary",
            fontSize: { xs: "1rem", md: "1.2rem" },
            mb: 4,
          }}
        >
          Você não tem permissão para acessar esta página.
        </Typography>

        <Button
          variant="contained"
          onClick={handleBack}
          sx={{
            width: "100%",
            height: 58,
            borderRadius: 1.5,
            fontSize: "1.2rem",
            fontWeight: 700,
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          Sair e voltar ao login
        </Button>
      </Box>
    </Box>
  );
}