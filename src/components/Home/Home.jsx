import React from 'react'; 
import Container from '@mui/material/Container'; 
import Typography from '@mui/material/Typography'; 
export function Home() { 
  return ( 
    <Container sx={{ p: 2 }} maxWidth="sm"> 
      <Typography 
        component="h1" 
        variant="h2" 
        align="center" 
        color="text.primary" 
        gutterBottom 
      > 
        Restaurante de Sushi 
        </Typography> 
      <Typography variant="h5" align="center" color="text.secondary"> 
        Sabores japoneses que conquistan cada bocado
      </Typography> 
    </Container> 
  ); 
} 