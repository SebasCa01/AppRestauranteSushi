import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  FormHelperText,
  Box,
  Paper,
  Divider,
  Stack,
  CircularProgress,
  Fade,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import ComboService from "../../services/ComboService";
import ProductoService from "../../services/ProductoService";
import { toast } from "react-hot-toast";

function findComboLike(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findComboLike(item);
      if (found) return found;
    }
    return null;
  }

  if (!value || typeof value !== "object") return null;

  const isComboLike =
    value &&
    typeof value === "object" &&
    ("nombre" in value ||
      "precio" in value ||
      "productos" in value ||
      "imagen" in value);

  if (isComboLike) {
    return value;
  }

  for (const item of Object.values(value)) {
    const found = findComboLike(item);
    if (found) return found;
  }

  return null;
}

function findArrayLike(value) {
  if (Array.isArray(value)) return value;

  if (!value || typeof value !== "object") return [];

  for (const item of Object.values(value)) {
    if (Array.isArray(item)) return item;

    const found = findArrayLike(item);
    if (found.length > 0) return found;
  }

  return [];
}

export function UpdateCombo() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const id = routeParams.id || null;

  const [error, setError] = useState("");
  const [loadingCombo, setLoadingCombo] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [productos, setProductos] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);

  const comboSchema = yup.object({
    nombre: yup
      .string()
      .trim()
      .required("El nombre es requerido")
      .min(2, "Debe tener al menos 2 caracteres"),

    precio: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : Number(originalValue),
      )
      .typeError("Debe ser un número")
      .required("El precio es requerido")
      .positive("Debe ser mayor a 0"),

    productos: yup
      .array()
      .of(
        yup.object({
          producto_id: yup
            .string()
            .trim()
            .required("Debes seleccionar un producto"),

          cantidad: yup
            .number()
            .transform((value, originalValue) =>
              originalValue === "" ? undefined : Number(originalValue),
            )
            .typeError("La cantidad debe ser un número")
            .required("La cantidad es requerida")
            .positive("Debe ser mayor a 0")
            .integer("Debe ser un número entero"),
        }),
      )
      .min(1, "Debe tener al menos un producto"),

    imagen: yup.mixed().nullable(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      nombre: "",
      precio: "",
      productos: [
        {
          producto_id: "",
          cantidad: 1,
        },
      ],
      imagen: null,
    },
    resolver: yupResolver(comboSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productos",
  });

  const addProducto = () => {
    append({
      producto_id: "",
      cantidad: 1,
    });
  };

  const removeProducto = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      setLoadingCombo(true);
      setError("");

      ComboService.getComboForUpdate(id)
        .then((response) => {
          console.log("Combo original:", response.data);

          const combo = response.data || {};

          // Normalizamos los productos
          const productosFormateados = (combo.Productos || []).map((item) => ({
            producto_id: item.ProductoID ?? "",
            cantidad: Number(item.Cantidad) ?? 1,
          }));

          // Armamos el objeto para reset()
          const comboFormateado = {
            nombre: combo.Nombre ?? "",
            precio: combo.Precio ?? "",
            productos:
              productosFormateados.length > 0
                ? productosFormateados
                : [
                    {
                      producto_id: "",
                      cantidad: 1,
                    },
                  ],
          };

          console.log("Combo formateado:", comboFormateado);

          reset(comboFormateado);

          setImagenPreview(
            "http://localhost:81/apiichigosushi/uploads/" + combo.Imagen,
          );
        })
        .catch((error) => setError(error))
        .finally(() => setLoadingCombo(false));
    } else {
      setLoadingCombo(false);
    }
  }, [id, reset]);

  useEffect(() => {
    ProductoService.getProducts()
      .then((response) => {
        console.log("Productos:", response.data);
        setProductos(response.data || []);
      })
      .catch((error) => setError(error))
      .finally(() => setLoadingProductos(false));
  }, []);

  const onSubmit = (dataForm) => {
    setSubmitting(true);
    setError("");

    const formData = new FormData();

    formData.append("ComboID", id);
    formData.append("nombre", dataForm.nombre);
    formData.append("precio", dataForm.precio);
    formData.append("productos", JSON.stringify(dataForm.productos));

    if (dataForm.imagen instanceof File) {
      formData.append("imagen", dataForm.imagen);
    }

    ComboService.updateCombo(formData)
      .then((response) => {
        toast.success(`Combo actualizado: ${response?.data?.Nombre || "ok"}`, {
          duration: 4000,
          position: "top-center",
        });

        navigate("/combo-table");
      })
      .catch((error) => setError(error))
      .finally(() => setSubmitting(false));
  };

  const onInvalid = () => {
    toast.error("Completa todos los campos obligatorios", {
      duration: 3000,
      position: "top-center",
    });
  };

  const errorMessage =
    error?.message ||
    (typeof error === "string" ? error : "Ocurrió un error inesperado");

  if (error && !loadingCombo && !loadingProductos) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid rgba(211, 47, 47, 0.2)",
            backgroundColor: "#fff5f5",
          }}
        >
          <Typography variant="h6" color="error">
            No se pudo cargar el combo
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (loadingCombo || loadingProductos) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="secondary" />
        <Typography variant="body1" color="text.secondary">
          Cargando combo...
        </Typography>
      </Box>
    );
  }
  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          minHeight: "100%",
          background: "#fffaf7",
          p: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 1200,
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
                  Actualizar combo
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.95, mt: 0.5 }}>
                  Edita tu combo con una gran combinación de sabores.
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
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <Box>
                  <Controller
                    name="nombre"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        label="Nombre del combo"
                        fullWidth
                        error={Boolean(errors.nombre)}
                        helperText={errors.nombre?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#fff",
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Controller
                    name="precio"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        label="Precio del combo"
                        type="number"
                        fullWidth
                        inputProps={{
                          inputProps: {
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            min: 0,
                            step: 1,
                          },
                        }}
                        error={Boolean(errors.precio)}
                        helperText={errors.precio?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#fff",
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                <Controller
                  name="imagen"
                  control={control}
                  render={() => (
                    <Box>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];

                          if (file) {
                            setValue("imagen", file, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setImagenPreview(URL.createObjectURL(file));
                          }
                        }}
                      />

                      {imagenPreview && (
                        <Paper sx={{ mt: 2, p: 1.5, borderRadius: 2 }}>
                          <img
                            src={
                              typeof imagenPreview === "string"
                                ? imagenPreview
                                : URL.createObjectURL(imagenPreview)
                            }
                            alt="Vista previa"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "220px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </Paper>
                      )}

                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {errors.imagen?.message}
                      </FormHelperText>
                    </Box>
                  )}
                />

                <Box sx={{ gridColumn: { xs: "span 1", md: "span 2" } }}>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#8b0000" }}
                    >
                      Productos
                    </Typography>

                    <Tooltip title="Agregar producto">
                      <span>
                        <IconButton
                          color="secondary"
                          onClick={addProducto}
                          sx={{
                            border: "1px solid rgba(194,24,91,0.2)",
                            borderRadius: 2,
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    {fields.map((field, index) => (
                      <Box
                        key={field.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid rgba(0,0,0,0.08)",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "2fr 1fr auto",
                            },
                            gap: 2,
                            alignItems: "start",
                          }}
                        >
                          <FormControl
                            fullWidth
                            error={Boolean(
                              errors.productos?.[index]?.producto_id,
                            )}
                          >
                            <InputLabel id={`producto-label-${index}`}>
                              Producto
                            </InputLabel>

                            <Controller
                              name={`productos.${index}.producto_id`}
                              control={control}
                              render={({ field: productoField }) => (
                                <Select
                                  {...productoField}
                                  labelId={`producto-label-${index}`}
                                  value={productoField.value ?? ""}
                                  label="Producto"
                                >
                                  {productos.map((prod) => (
                                    <MenuItem
                                      key={prod.ProductoID}
                                      value={prod.ProductoID}
                                    >
                                      {prod.Nombre}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />

                            <FormHelperText>
                              {errors.productos?.[index]?.producto_id?.message}
                            </FormHelperText>
                          </FormControl>

                          <Controller
                            name={`productos.${index}.cantidad`}
                            control={control}
                            render={({ field: cantidadField }) => (
                              <TextField
                                {...cantidadField}
                                value={cantidadField.value ?? ""}
                                label="Cantidad"
                                type="number"
                                fullWidth
                                error={Boolean(
                                  errors.productos?.[index]?.cantidad,
                                )}
                                helperText={
                                  errors.productos?.[index]?.cantidad?.message
                                }
                              />
                            )}
                          />

                          <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => removeProducto(index)}
                            disabled={fields.length === 1}
                            sx={{
                              borderRadius: 2,
                              minWidth: 110,
                              height: 56,
                              borderColor: "#b71c1c",
                              color: "#b71c1c",
                            }}
                          >
                            Eliminar
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <FormHelperText sx={{ color: "#d32f2f" }}>
                    {errors.productos?.message}
                  </FormHelperText>
                </Box>

                <Box sx={{ gridColumn: { xs: "span 1", md: "span 2" } }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ alignItems: { xs: "stretch", sm: "center" } }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      disabled={submitting || !isValid}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1.2,
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "0 10px 24px rgba(194, 24, 91, 0.22)",
                      }}
                    >
                      {submitting ? "Guardando..." : "Guardar cambios"}
                    </Button>

                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => navigate("/combo-table")}
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
                </Box>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
