import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './ExampleTheme.ts'
import ExampleDashboard from './ExampleDashboard.tsx'
// @ts-ignore
import AboutUs from './AboutUs.jsx'
// @ts-ignore
import PlanYourVisit from './PlanYourVisit.jsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ExampleDashboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/plan-visit" element={<PlanYourVisit />} />
      </Routes>
    </ThemeProvider>
  </StrictMode>
  </BrowserRouter>
)
