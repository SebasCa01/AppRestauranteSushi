import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Paper, IconButton, Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ProductoService from "../../services/ProductoService";

export default function TableProductos() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProductoService.getProducts()
      .then((response) => {
        console.log("Datos recibidos:", response.data); // 👀 revisa aquí
        setData(response.data || []);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(false);
      });
  }, []);

  const update = (id) => {
    navigate(`/producto/update/${id}`);
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Listado de Productos
        <Tooltip title="Crear">
          <IconButton component={Link} to="/producto/crear" color="success">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      {data.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla productos">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id || row.ProductoID}>
                  <TableCell>{row.nombre || row.Nombre}</TableCell>
                  <TableCell>{row.descripcion || row.Descripcion}</TableCell>
                  <TableCell>{row.precio || row.Precio}</TableCell>
                  <TableCell>{row.categoria?.Nombre || row.Categoria}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Actualizar">
                      <IconButton onClick={() => update(row.id || row.ProductoID)} color="success">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
