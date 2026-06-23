import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import ComboService from '../../services/ComboService'; // servicio para combos

// Componente para mostrar el detalle de un combo
export function DetailCombo() {
  const { id } = useParams(); // obtener el id del combo desde la ruta
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ComboService.getComboById(id)
      .then((response) => {
        setData(response.data);
        setLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      });
  }, [id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
      {data && (
        <Grid container spacing={2}>
          {/* Imagen */}
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              sx={{
                borderRadius: '8px',
                maxWidth: '100%',
                height: 'auto',
                boxShadow: 3,
              }}
              alt={data.Nombre}
              src={`${BASE_URL}/${data.Imagen}`}
            />
          </Grid>

          {/* Información */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" gutterBottom>
              {data.Nombre}
            </Typography>

            {/* Precio */}
            <Typography variant="h5" sx={{ mt: 2, color: 'primary.main' }}>
              ₡{data.Precio}
            </Typography>

            {/* Productos */}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Productos incluidos:
            </Typography>
            <List>
              {Array.isArray(data.Productos) &&
                data.Productos.map((producto, index) => (
                  <ListItemButton key={index}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={producto} />
                  </ListItemButton>
                ))}
            </List>
          </Grid>
        </Grid>
      )}

      {/* Botón regresar */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/combos')}   // <-- vuelve al listado de combos
        >
          Regresar
        </Button>
      </Box>
    </Container>
  );
}
