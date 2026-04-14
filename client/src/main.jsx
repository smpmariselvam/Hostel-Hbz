import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Log environment variables (for debugging only)
console.log('Environment Variables:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL || 'Not set');
console.log('VITE_SOCKET_URL:', import.meta.env.VITE_SOCKET_URL || 'Not set');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)