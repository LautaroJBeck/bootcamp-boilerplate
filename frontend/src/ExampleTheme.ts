import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#14b8a6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h6: {
      fontFamily: '"Coming Soon", "Poppins", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    body2: {
      color: 'rgba(0,0,0,0.65)'
    }
  }
})

export default theme


