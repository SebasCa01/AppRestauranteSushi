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
import CategoriaService from "../../services/CategoriaService";
import IngredienteService from "../../services/IngredienteService";
import ProductoService from "../../services/ProductoService";
import { toast } from "react-hot-toast";

function findProductoLike(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findProductoLike(item);
      if (found) return found;
    }
    return null;
  }

  if (!value || typeof value !== "object") return null;

  const isProductoLike =
    value &&
    typeof value === "object" &&
    ("nombre" in value ||
      "descripcion" in value ||
      "precio" in value ||
      "categoria_id" in value ||
      "ingredientes" in value ||
      "imagen" in value);

  if (isProductoLike) {
    return value;
  }

  for (const item of Object.values(value)) {
    const found = findProductoLike(item);
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

export function UpdateProducto() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const id = routeParams.id || null;

  const [error, setError] = useState("");
  const [loadingProducto, setLoadingProducto] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loadingIngredientes, setLoadingIngredientes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);

  const productoSchema = yup.object({
    nombre: yup
      .string()
      .trim()
      .required("El nombre es requerido")
      .min(2, "Debe tener al menos 2 caracteres"),
    descripcion: yup
      .string()
      .trim()
      .required("La descripción es requerida")
      .min(8, "Debe tener al menos 8 caracteres"),
    precio: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : Number(originalValue),
      )
      .typeError("Debe ser un número")
      .required("Este campo es requerido")
      .positive("Debe ser mayor a 0"),
    categoria_id: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .typeError("La categoría es requerida")
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
      .min(1, "Debe tener al menos un ingrediente"),
    imagen: yup.string().trim().required("La imagen es requerida"),
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
      descripcion: "",
      precio: "",
      categoria_id: "",
      ingredientes: [{ ingrediente_id: "" }],
      imagen: "",
    },
    resolver: yupResolver(productoSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredientes",
  });

  const addIngrediente = () => {
    append({ ingrediente_id: "" });
  };

  const removeIngrediente = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      setLoadingProducto(true);
      setError("");

      ProductoService.getProductoForUpdate(id)
        .then((response) => {
          console.log("Producto original:", response.data);
          const producto = response.data || {};

          // Normalizamos los ingredientes
          const ingredientesFormateados = (producto.Ingredientes || []).map(
            (item) => ({
              ingrediente_id: item.ingrediente_id ?? item.IngredienteID ?? "",
            }),
          );

          // Armamos el objeto que se pasa a reset
          const productoFormateado = {
            nombre: producto.Nombre,
            descripcion: producto.Descripcion ?? "",
            precio: producto.Precio ?? "",
            categoria_id:
              Number(producto.CategoriaID ?? producto.categoria?.CategoriaID) ||
              "",
            ingredientes:
              ingredientesFormateados.length > 0
                ? ingredientesFormateados
                : [{ ingrediente_id: "" }],
            imagen: null,
          };

          console.log("Producto formateado:", productoFormateado);

          reset(productoFormateado);
          setImagenPreview(
            "http://localhost/apiichigosushi/uploads/" +
              (producto.Imagen ?? null),
          ); // vista previa si ya existe
          console.log(
            "Imagen preview:",
            "http://localhost/apiichigosushi/uploads/" + producto.Imagen,
          );
        })
        .catch((error) => setError(error))
        .finally(() => setLoadingProducto(false));
    } else {
      setLoadingProducto(false);
    }
  }, [id, reset]);

  useEffect(() => {
    CategoriaService.getCategorias()
      .then((response) => {
        console.log("Categorías:", response.data);
        setCategorias(response.data || []);
      })
      .catch((error) => setError(error))
      .finally(() => setLoadingCategorias(false));
  }, []);

  useEffect(() => {
    IngredienteService.getIngredientes()
      .then((response) => {
        console.log("Ingredientes:", response.data);
        setIngredientes(response.data || []);
      })
      .catch((error) => setError(error))
      .finally(() => setLoadingIngredientes(false));
  }, []);

  const onSubmit = (dataForm) => {
    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("id", id);
    formData.append("nombre", dataForm.Nombre);
    formData.append("descripcion", dataForm.Descripcion);
    formData.append("precio", dataForm.Precio);
    formData.append("categoria_id", dataForm.CategoriaID);
    formData.append("ingredientes", JSON.stringify(dataForm.ingredientes));

    if (dataForm.imagen instanceof File) {
      formData.append("imagen", dataForm.Imagen);
    }

    ProductoService.updateProducto(formData)
      .then((response) => {
        toast.success(
          `Producto actualizado: ${response?.data?.Nombre || "ok"}`,
          {
            duration: 4000,
            position: "top-center",
          },
        );
        navigate("/producto-table");
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

  if (error && !loadingProducto) {
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
            No se pudo cargar el producto
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (loadingProducto || loadingCategorias || loadingIngredientes) {
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
          Cargando producto...
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
                  Actualizar producto
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.95, mt: 0.5 }}>
                  Edita tu producto con una gran combinación de sabores.
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
                        label="Nombre del producto"
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
                        label="Precio del producto"
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

                <Box sx={{ gridColumn: { xs: "span 1", md: "span 2" } }}>
                  <Controller
                    name="descripcion"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        label="Descripción"
                        multiline
                        rows={3}
                        fullWidth
                        error={Boolean(errors.descripcion)}
                        helperText={errors.descripcion?.message}
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
                  <FormControl fullWidth error={Boolean(errors.categoria_id)}>
                    <InputLabel id="categoria-label">Categoría</InputLabel>
                    <Controller
                      name="categoria_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="categoria-label"
                          value={field.value ?? ""}
                        >
                          {categorias.map((cat) => (
                            <MenuItem
                              key={cat.CategoriaID}
                              value={cat.CategoriaID}
                            >
                              {cat.Nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    <FormHelperText>
                      {errors.categoria_id?.message}
                    </FormHelperText>
                  </FormControl>
                </Box>

                <Controller
                  name="imagen"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setValue("Imagen", file, { shouldValidate: true });
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
                      Ingredientes
                    </Typography>

                    <Tooltip title="Agregar ingrediente">
                      <span>
                        <IconButton
                          color="secondary"
                          onClick={addIngrediente}
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
                            gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                            gap: 2,
                            alignItems: "start",
                          }}
                        >
                          <FormControl
                            fullWidth
                            error={Boolean(
                              errors.ingredientes?.[index]?.ingrediente_id,
                            )}
                          >
                            <InputLabel id={`ingrediente-label-${index}`}>
                              Ingrediente
                            </InputLabel>

                            <Controller
                              name={`ingredientes.${index}.ingrediente_id`}
                              control={control}
                              render={({ field: ingredientField }) => (
                                <Select
                                  {...ingredientField}
                                  labelId={`ingrediente-label-${index}`}
                                  value={ingredientField.value ?? ""}
                                  label="Ingrediente"
                                >
                                  {ingredientes.map((ing) => (
                                    <MenuItem
                                      key={ing.IngredienteID}
                                      value={ing.IngredienteID}
                                    >
                                      {ing.Nombre}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />

                            <FormHelperText>
                              {
                                errors.ingredientes?.[index]?.ingrediente_id
                                  ?.message
                              }
                            </FormHelperText>
                          </FormControl>

                          <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => removeIngrediente(index)}
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
                    {errors.ingredientes?.message}
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
                </Box>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
