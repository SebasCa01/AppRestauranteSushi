import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { Info } from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PropTypes from 'prop-types';

ListCardCombos.propTypes = {
  data: PropTypes.array,
  isShopping: PropTypes.bool.isRequired,
};

export function ListCardCombos({ data, isShopping }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  return (
    <Grid container sx={{ p: 2 }} spacing={3}>
      {data &&
        data.map((combo) => (
          <Grid item xs={12} sm={6} md={4} key={combo.ComboID}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                sx={{
                  p: 0,
                  backgroundColor: (theme) => theme.palette.secondary.main,
                  color: (theme) => theme.palette.common.white,
                  '& .MuiCardHeader-content': { textAlign: 'center' },
                  '& .MuiCardHeader-title': { color: 'white' },
                }}
                title={combo.Nombre}
              />
              <CardMedia
                component="img"
                height="200"
                image={`${BASE_URL}/${combo.Imagen}`}
                alt={combo.Nombre}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Lista de productos del combo */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {Array.isArray(combo.Productos)
                    ? combo.Productos.join(', ')
                    : combo.Productos}
                </Typography>

                {isShopping && (
                  <Typography
                    variant="h6"
                    align="right"
                    gutterBottom
                    sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}
                  >
                    ₡{combo.Precio}
                  </Typography>
                )}
              </CardContent>
              <CardActions
                disableSpacing
                sx={{
                  backgroundColor: (theme) => theme.palette.action.focus,
                  color: (theme) => theme.palette.common.white,
                  mt: 'auto',
                }}
              >
                <IconButton
                  component={Link}
                  to={`/combo/${combo.ComboID}`}
                  target="_blank"
                  aria-label="Detalle"
                  sx={{ ml: 'auto' }}
                >
                  <Info />
                </IconButton>
                {isShopping && (
                  <IconButton aria-label="Comprar" sx={{ ml: 'auto' }}>
                    <AddShoppingCartIcon />
                  </IconButton>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
