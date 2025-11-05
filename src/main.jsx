import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ViewData from './ViewData.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <br></br> */}
    {/* <br /> */}
    {/* <ViewData /> */}
  </StrictMode>,
)
