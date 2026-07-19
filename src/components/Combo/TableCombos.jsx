import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Paper, IconButton, Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ComboService from "../../services/ComboService";

export default function TableCombos() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ComboService.getCombos() // este debe llamar a tu método all()
      .then((response) => {
        console.log("Datos recibidos combos:", response.data);
        setData(response.data || []);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(false);
      });
  }, []);

  const update = (id) => {
    navigate(`/combo/update/${id}`);
  };

  if (!loaded) return <p>Cargando combos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Listado de Combos
        <Tooltip title="Crear">
          <IconButton component={Link} to="/combo/crear" color="success">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      {data.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla combos">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.ComboID || row.id}>
                  <TableCell>{row.Nombre || row.nombre}</TableCell>
                  <TableCell>{row.Precio || row.precio}</TableCell>
                  <TableCell>
                    {row.Productos ? row.Productos : "Sin productos"}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Actualizar">
                      <IconButton
                        onClick={() => update(row.ComboID || row.id)}
                        color="success"
                      >
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
