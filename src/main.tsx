import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Camera from './pages/Camera'
import About from './pages/About';
import Maintenance from './pages/Maintenance';
import Solar from './pages/Solar-Panel';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'camera-feed',
        element: <Camera />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'maintenance',
        element: <Maintenance />
      },
      {
        path: 'solar-panel',
        element: <Solar />
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
