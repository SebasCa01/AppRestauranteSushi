import React from 'react';
import { Card, CardHeader, CardContent, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';

ListCardMenu.propTypes = {
  data: PropTypes.array,
};

export function ListCardMenu({ data }) {
  return (
    <Grid container sx={{ p: 3 }} spacing={4} justifyContent="center">
      {data &&
        data.map((menu) => (
          <Grid item xs={12} sm={6} md={4} key={menu.MenuID}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: 6,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              <CardHeader
                sx={{
                  textAlign: 'center',
                  backgroundColor: '#d32f2f', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }}
                title={menu.Nombre}
              />

              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Typography variant="h6" gutterBottom color="text.primary">
                  Estado: {menu.Estado}
                </Typography>

                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Inicio: {menu.FechaInicio}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  Fin: {menu.FechaFin}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
