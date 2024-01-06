import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {LoginPage} from "./login";
import {HomePage} from "./home";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
    {path:"/login", element: <LoginPage/>},
    {path:"/home", element: <HomePage/>},
    {path:"*",element: <Navigate to="/login" replace />}

])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>,
)
