import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Paper, IconButton, Tooltip, Box, Chip, Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProcesoPreparacionService from "../../services/ProcesoPreparacionService";

export default function TableProcesos() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProcesoPreparacionService.getProcesos()
      .then((response) => {
        setData(response.data || []);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(false);
      });
  }, []);

  if (!loaded) return <p>Cargando procesos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", mb: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#8b0000" }}>
          Procesos de Preparación
        </Typography>

        <Tooltip title="Crear proceso">
          <IconButton
            component={Link}
            to="/proceso/crear"
            sx={{ backgroundColor: "#8b0000", color: "#fff", "&:hover": { backgroundColor: "#c62828" } }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fdf1f1" }}>
              <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cantidad Pasos</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.ProductoID} hover>
                <TableCell>{row.Nombre}</TableCell>
                <TableCell>
                  <Chip
                    label={`${row.CantidadPasos} paso(s)`}
                    size="small"
                    sx={{ backgroundColor: "#fdf1f1", color: "#8b0000", fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver detalle">
                    <IconButton component={Link} to={`/proceso/${row.ProductoID}`} color="default">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Actualizar">
                    <IconButton onClick={() => navigate(`/proceso/update/${row.ProductoID}`)} color="success">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No hay procesos registrados.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}