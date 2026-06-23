import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'; 
import App from './App';
import { Home } from './components/Home/Home';
import { PageNotFound } from './components/Home/PageNotFound';
import { ListProductos } from './components/Producto/ListProductos.jsx';
import { DetailProducto } from './components/Producto/DetailProducto.jsx'; 
import { ListCombos } from './components/Combo/ListCombos.jsx'; 
import { DetailCombo } from './components/Combo/DetailCombo.jsx';


const rutas = createBrowserRouter( 
  [     { 
      element: <App />,       
      children: [ 
        { 
          path: '/', 
          element: <Home /> 
        },
        {
          path: '*',
          element: <PageNotFound />
        },
        {
          path: '/productos',
          element: <ListProductos /> 
        },
        {
          path: '/producto/:id',   
          element: <DetailProducto /> 
        },
        {
          path: '/combos',          
          element: <ListCombos /> 
        },
        {
          path: '/combo/:id',  
          element: <DetailCombo /> 
        },
      ], 
    }, 
  ], 
) 
createRoot(document.getElementById('root')).render( 
  <StrictMode> 
      <RouterProvider router={rutas} /> 
  </StrictMode>, 
); 