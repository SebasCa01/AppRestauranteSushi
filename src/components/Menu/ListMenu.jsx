import React, { useEffect, useState } from 'react';
import { ListCardMenu } from './ListCardMenu';
import MenuService from '../../services/MenuService';

// Componente para mostrar la lista de menus de la tienda
export function ListMenu() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    MenuService.getMenus() // Llamar al servicio para obtener todos los menus
      .then((response) => {
        console.log("Datos recibidos:", response.data);
        setData(response.data);
        setError('');
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Error cargando menus:", err);
        setError(err);
        setLoaded(false);
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && <ListCardMenu data={data} isShopping={true} />}
    </>
  );
}