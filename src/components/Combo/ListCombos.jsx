import React, { useEffect, useState } from 'react';
import { ListCardCombos } from './ListCardCombos';
import ComboService from '../../services/ComboService';

// Componente para mostrar la lista de combos de la tienda
export function ListCombos() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ComboService.getCombos() // Llamar al servicio para obtener todos los combos
      .then((response) => {
        console.log("Datos recibidos:", response.data);
        setData(response.data);
        setError('');
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Error cargando combos:", err);
        setError(err);
        setLoaded(false);
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && <ListCardCombos data={data} isShopping={true} />}
    </>
  );
}
