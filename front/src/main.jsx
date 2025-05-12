import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './scripts/routes.jsx'
import "./assets/css/app.css"
import { ThemeProvider } from './scripts/hooks/themeProvider.jsx'
import { UserProvider } from './scripts/hooks/userProvider.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  </ThemeProvider>,
)
