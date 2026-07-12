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
import { ListMenu } from './components/Menu/ListMenu.jsx';
import { CreateProducto } from "./components/Producto/CreateProducto.jsx";
import { UpdateProducto } from "./components/Producto/UpdateProducto";
import TableProductos from "./components/Producto/TableProductos";

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
          path: '/producto',
          element: <ListProductos /> 
        },
        {
          path: '/producto/:id',   
          element: <DetailProducto /> 
        },
        {
          path:'/producto/crear/',
          element: <CreateProducto />
        },
        {
          path: "/producto/update/:id",
          element: <UpdateProducto />
        },
        {
          path: "/producto-table",
          element: <TableProductos />
        },
        {
          path: '/combo',          
          element: <ListCombos /> 
        },
        {
          path: '/combo/:id',  
          element: <DetailCombo /> 
        },
        {
          path: '/menu',  
          element: <ListMenu /> 
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