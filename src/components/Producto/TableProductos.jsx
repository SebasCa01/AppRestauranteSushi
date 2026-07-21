import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Paper, IconButton, Tooltip, Box, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import { SelectCategoria } from "./Form/SelectCategoria";

export default function TableProductos() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const [productoDetalle, setProductoDetalle] = useState(null);

  useEffect(() => {
    ProductoService.getProducts()
      .then((response) => {
        const productosOrdenados = (response.data || []).sort(
          (a, b) => (a.ProductoID ?? 0) - (b.ProductoID ?? 0)
        );
        setData(productosOrdenados);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(false);
      });
  }, []);

  useEffect(() => {
    CategoriaService.getCategorias()
      .then((response) => setCategorias(response.data || []))
      .catch((err) => console.log(err));
  }, []);

  const update = (id) => {
    navigate(`/producto/update/${id}`);
  };

  const dataFiltrada = categoriaFiltro
    ? data.filter((row) => String(row.CategoriaID) === String(categoriaFiltro))
    : data;

  const imagenUrl = (nombreImagen) =>
    nombreImagen
      ? `http://localhost:81/apiichigosushi/uploads/${nombreImagen}`
      : null;

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", mb: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#8b0000" }}>
          Listado de Productos
        </Typography>

        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box sx={{ minWidth: 220 }}>
            <SelectCategoria
              field={{
                value: categoriaFiltro,
                onChange: (value) => setCategoriaFiltro(value),
              }}
              data={categorias}
              label="Filtrar por categoría"
              allowAll
            />
          </Box>

          <Tooltip title="Crear producto">
            <IconButton
              component={Link}
              to="/producto/crear"
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
        <Table sx={{ minWidth: 650 }} aria-label="tabla productos">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fdf1f1" }}>
              <TableCell sx={{ fontWeight: 700 }}>Imagen</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Categoría</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataFiltrada.map((row) => (
              <TableRow
                key={row.ProductoID}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
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
                <TableCell>
                  <Chip
                    label={row.Categoria || "Sin categoría"}
                    size="small"
                    sx={{
                      backgroundColor: "#fdf1f1",
                      color: "#8b0000",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver detalle">
                    <IconButton onClick={() => setProductoDetalle(row)} color="default">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Actualizar">
                    <IconButton onClick={() => update(row.ProductoID)} color="success">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {dataFiltrada.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No hay productos en esta categoría.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de detalle */}
      <Dialog
        open={Boolean(productoDetalle)}
        onClose={() => setProductoDetalle(null)}
        maxWidth="sm"
        fullWidth
      >
        {productoDetalle && (
          <>
            <DialogTitle sx={{ fontWeight: 700, color: "#8b0000" }}>
              {productoDetalle.Nombre}
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                {productoDetalle.Imagen && (
                  <Box
                    component="img"
                    src={imagenUrl(productoDetalle.Imagen)}
                    alt={productoDetalle.Nombre}
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
                    Descripción
                  </Typography>
                  <Typography>{productoDetalle.Descripcion || "Sin descripción"}</Typography>
                </Box>

                <Divider />

                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Precio
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      ₡{Number(productoDetalle.Precio).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Categoría
                    </Typography>
                    <Chip
                      label={productoDetalle.Categoria || "Sin categoría"}
                      size="small"
                      sx={{ backgroundColor: "#fdf1f1", color: "#8b0000", fontWeight: 600 }}
                    />
                  </Box>
                </Stack>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ingredientes
                  </Typography>
                  <Typography>{productoDetalle.Ingredientes || "Sin ingredientes"}</Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setProductoDetalle(null)}>Cerrar</Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#8b0000", "&:hover": { backgroundColor: "#c62828" } }}
                onClick={() => {
                  update(productoDetalle.ProductoID);
                  setProductoDetalle(null);
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