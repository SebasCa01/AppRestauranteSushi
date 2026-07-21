import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Paper, IconButton, Tooltip, Box, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ComboService from "../../services/ComboService";

export default function TableCombos() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [comboDetalle, setComboDetalle] = useState(null);

  useEffect(() => {
    ComboService.getCombos()
      .then((response) => {
        const combosOrdenados = (response.data || []).sort(
          (a, b) => (a.ComboID ?? 0) - (b.ComboID ?? 0)
        );
        setData(combosOrdenados);
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

  const imagenUrl = (nombreImagen) =>
    nombreImagen
      ? `http://localhost:81/apiichigosushi/uploads/${nombreImagen}`
      : null;

  if (!loaded) return <p>Cargando combos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", mb: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#8b0000" }}>
          Listado de Combos
        </Typography>

        <Tooltip title="Crear combo">
          <IconButton
            component={Link}
            to="/combo/crear"
            sx={{
              backgroundColor: "#8b0000",
              color: "#fff",
              "&:hover": { backgroundColor: "#c62828" },
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="tabla combos">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fdf1f1" }}>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Imagen</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Productos</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.ComboID}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.ComboID}</TableCell>
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={imagenUrl(row.Imagen)}
                    sx={{ width: 48, height: 48, backgroundColor: "#f0f0f0" }}
                  >
                    {row.Nombre?.[0]}
                  </Avatar>
                </TableCell>
                <TableCell>{row.Nombre}</TableCell>
                <TableCell>₡{Number(row.Precio).toLocaleString()}</TableCell>
                <TableCell>{row.Productos || "Sin productos"}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver detalle">
                    <IconButton onClick={() => setComboDetalle(row)} color="default">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Actualizar">
                    <IconButton onClick={() => update(row.ComboID)} color="success">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No hay combos registrados.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de detalle */}
      <Dialog
        open={Boolean(comboDetalle)}
        onClose={() => setComboDetalle(null)}
        maxWidth="sm"
        fullWidth
      >
        {comboDetalle && (
          <>
            <DialogTitle sx={{ fontWeight: 700, color: "#8b0000" }}>
              {comboDetalle.Nombre}
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                {comboDetalle.Imagen && (
                  <Box
                    component="img"
                    src={imagenUrl(comboDetalle.Imagen)}
                    alt={comboDetalle.Nombre}
                    sx={{
                      width: "100%",
                      maxHeight: 260,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                )}

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Precio
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    ₡{Number(comboDetalle.Precio).toLocaleString()}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Productos incluidos
                  </Typography>
                  <Typography>
                    {comboDetalle.Productos || "Sin productos"}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setComboDetalle(null)}>Cerrar</Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#8b0000", "&:hover": { backgroundColor: "#c62828" } }}
                onClick={() => {
                  update(comboDetalle.ComboID);
                  setComboDetalle(null);
                }}
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}