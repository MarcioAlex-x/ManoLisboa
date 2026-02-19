import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './contexts/UserContext/index.jsx'
import { RouterProvider } from 'react-router-dom'
import { AppRouter } from './components/AppRouter.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


createRoot(document.getElementById('root')).render(
    <UserProvider>
        <RouterProvider router={AppRouter}>
            <App />
        </RouterProvider>
    </UserProvider>
)
