import { createTheme } from '@mui/material/styles'

const NAVY = '#011025'
const ORANGE = '#C77700'
const LIGHT = '#F3F3F3'

export const theme = createTheme({
  palette: {
    primary: {
      main: NAVY,
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: ORANGE,
    },

    background: {
      default: LIGHT,
      paper: LIGHT,
    },

    text: {
      primary: NAVY,
    },
  },

  typography: {
    fontFamily: 'Montserrat, sans-serif',

    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          height: 48,
          fontSize: '1.125rem',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: 'outlined',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: LIGHT,

          '& fieldset': {
            borderColor: NAVY,
          },

          '&:hover fieldset': {
            borderColor: NAVY,
          },

          '&.Mui-focused fieldset': {
            borderColor: ORANGE,
          },
        },
      },
    },

    MuiCheckbox: {
      defaultProps: {
        color: 'secondary',
      },
    },
  },
})