import React from "react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { FormHelperText } from "@mui/material";
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import IngredienteService from "../../services/IngredienteService";
import ImageService from "../../services/ImageService";
import { SelectCategoria } from "./Form/SelectCategoria";
import { SelectIngredientes } from "./Form/SelectIngredientes";

export function CreateProducto() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  // Esquema de validación
  const productoSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre es requerido")
      .min(2, "Debe tener al menos 2 caracteres"),
    descripcion: yup
      .string()
      .required("La descripción es requerida")
      .min(5, "Debe tener al menos 5 caracteres"),
    precio: yup
      .number()
      .typeError("Debe ser un número")
      .required("El precio es requerido")
      .positive("Debe ser positivo"),
    categoria_id: yup
      .number()
      .typeError("Seleccione una categoría")
      .required("La categoría es requerida"),
    ingredientes: yup
      .array()
      .of(
        yup.object({
          ingrediente_id: yup
            .string()
            .trim()
            .required("Debes seleccionar un ingrediente"),
        }),
      )
      .when("categoria_id", {
        is: (categoria_id) => Number(categoria_id) !== 2, // 2 = Refrescos
        then: (schema) => schema.min(1, "Debe tener al menos un ingrediente"),
        otherwise: (schema) => schema.min(0),
      }),
    imagen: yup.mixed().required("La imagen es requerida"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      categoria_id: "",
      ingredientes: [],
      imagen: "",
    },
    resolver: yupResolver(productoSchema),
  });

  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  // Imagen
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  // Acción submit
  const onSubmit = (DataForm) => {
    setSubmitting(true);

    const formData = new FormData();
    formData.append("nombre", DataForm.nombre);
    formData.append("descripcion", DataForm.descripcion);
    formData.append("precio", DataForm.precio);
    formData.append("categoria_id", DataForm.categoria_id);
    formData.append("ingredientes", JSON.stringify(DataForm.ingredientes));

    if (file) {
      formData.append("imagen", file);
    }

    ProductoService.createProducto(formData)
      .then((response) => {
        setError(response.error);
        if (response.data != null) {
          toast.success(
            `Producto creado #${response.data.id} - ${response.data.nombre}`,
            { duration: 4000, position: "top-center" },
          );
          navigate("/producto-table");
        } else {
          setSubmitting(false);
        }
      })
      .catch((error) => {
        setError(error);
        setSubmitting(false);
      });
  };

  // Listas externas
  const [dataCategorias, setDataCategorias] = useState({});
  const [loadedCategorias, setLoadedCategorias] = useState(false);
  useEffect(() => {
    CategoriaService.getCategorias().then((response) => {
      setDataCategorias(response.data);
      setLoadedCategorias(true);
    });
  }, []);

  const [dataIngredientes, setDataIngredientes] = useState({});
  const [loadedIngredientes, setLoadedIngredientes] = useState(false);
  useEffect(() => {
    IngredienteService.getIngredientes().then((response) => {
      setDataIngredientes(response.data);
      setLoadedIngredientes(true);
    });
  }, []);

  return (
    <Box sx={{ minHeight: "100%", background: "#fffaf7", p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1100,
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
          background: "#ffffff",
        }}
      >
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            background: "linear-gradient(90deg, #8b0000 0%, #c62828 100%)",
            color: "white",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Crear producto
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95, mt: 0.5 }}>
                Agrega un nuevo producto a tu menú.
              </Typography>
            </Box>
            <Chip
              label="IchigoSushi"
              sx={{
                backgroundColor: "rgba(255,255,255,0.18)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "999px",
              }}
            />
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <Grid container spacing={2.5}>
              {/* Nombre */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre"
                      fullWidth
                      error={Boolean(errors.nombre)}
                      helperText={errors.nombre?.message || " "}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>

              {/* Descripción */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="descripcion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descripción"
                      fullWidth
                      error={Boolean(errors.descripcion)}
                      helperText={errors.descripcion?.message || " "}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>

              {/* Precio */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="precio"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Precio"
                      type="number"
                      fullWidth
                      error={Boolean(errors.precio)}
                      helperText={errors.precio?.message || " "}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>

              {/* Categoría */}
              <Grid size={{ xs: 12, md: 6 }}>
                {loadedCategorias ? (
                  <Controller
                    name="categoria_id"
                    control={control}
                    render={({ field }) => (
                      <SelectCategoria field={field} data={dataCategorias} />
                    )}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      height: 56,
                    }}
                  >
                    <CircularProgress size={20} color="secondary" />
                    <Typography variant="body2" color="text.secondary">
                      Cargando categorías...
                    </Typography>
                  </Box>
                )}
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errors.categoria_id?.message || " "}
                </FormHelperText>
              </Grid>

              {/* Ingredientes */}
              <Grid size={12}>
                {loadedIngredientes ? (
                  <Controller
                    name="ingredientes"
                    control={control}
                    render={({ field }) => (
                      <SelectIngredientes
                        field={field}
                        data={dataIngredientes}
                        error={Boolean(errors.ingredientes)}
                      />
                    )}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      height: 56,
                    }}
                  >
                    <CircularProgress size={20} color="secondary" />
                    <Typography variant="body2" color="text.secondary">
                      Cargando ingredientes...
                    </Typography>
                  </Box>
                )}
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errors.ingredientes?.message || " "}
                </FormHelperText>
              </Grid>

              {/* Imagen */}
              <Grid size={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 1, color: "#8b0000" }}
                >
                  Imagen del producto
                </Typography>

                <Controller
                  name="imagen"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        borderStyle: "dashed",
                        borderColor: errors.imagen
                          ? "#d32f2f"
                          : "rgba(0,0,0,0.2)",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
                      >
                        <Button
                          component="label"
                          variant="outlined"
                          color="secondary"
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            flexShrink: 0,
                          }}
                        >
                          Seleccionar imagen
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                              const selectedFile = e.target.files[0];
                              if (selectedFile) {
                                setFileURL(URL.createObjectURL(selectedFile));
                                setFile(selectedFile);
                                onChange(selectedFile);
                              }
                            }}
                          />
                        </Button>

                        {fileURL ? (
                          <Box
                            component="img"
                            src={fileURL}
                            alt="Vista previa"
                            sx={{
                              width: 140,
                              height: 140,
                              objectFit: "cover",
                              borderRadius: 2,
                              border: "1px solid rgba(0,0,0,0.1)",
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Ningún archivo seleccionado
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  )}
                />

                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errors.imagen?.message || " "}
                </FormHelperText>
              </Grid>

              {/* Botones */}
              <Grid size={12}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 1 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={submitting}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 10px 24px rgba(194, 24, 91, 0.22)",
                    }}
                  >
                    {submitting ? "Guardando..." : "Guardar producto"}
                  </Button>

                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate("/producto-table")}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      textTransform: "none",
                      borderColor: "#8b0000",
                      color: "#8b0000",
                    }}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
