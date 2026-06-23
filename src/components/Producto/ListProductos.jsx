import React, { useEffect, useState } from 'react';
import { ListCardProductos } from './ListCardProductos';
import ProductoService from '../../services/ProductoService';

// Componente para mostrar la lista de productos de la tienda
export function ListProductos() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProductoService.getProducts() // Llamar al servicio para obtener todos los productos
      .then((response) => {
        console.log("Datos recibidos:", response.data);
        setData(response.data);
        setError('');
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        setError(err);
        setLoaded(false);
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && <ListCardProductos data={data} isShopping={true} />}
    </>
  );
}