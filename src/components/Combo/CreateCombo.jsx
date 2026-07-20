import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Typography,
  TextField,
  Button,
  FormHelperText,
  Box,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ComboService from "../../services/ComboService";
import ProductoService from "../../services/ProductoService";

export function CreateCombo() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const comboSchema = yup.object({
    nombre: yup
      .string()
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
            .number()
            .typeError("Seleccione un producto")
            .required("Seleccione un producto"),

          cantidad: yup
            .number()
            .typeError("Ingrese una cantidad")
            .required("La cantidad es requerida")
            .positive("Debe ser mayor a 0")
            .integer("Debe ser entero"),
        }),
      )
      .min(1, "Debe agregar al menos un producto"),

    imagen: yup.mixed().required("La imagen es requerida"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
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

  // Cargar productos

  useEffect(() => {
    ProductoService.getProducts()

      .then((response) => {
        setProductos(response.data || []);
      })

      .catch((error) => {
        console.log(error);
      });
  }, []);

  const agregarProducto = () => {
    append({
      producto_id: "",

      cantidad: 1,
    });
  };

  const eliminarProducto = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleChangeImage = (e) => {
    const imagen = e.target.files[0];

    if (imagen) {
      setFile(imagen);

      setValue("imagen", imagen, {
        shouldValidate: true,
      });

      setImagenPreview(URL.createObjectURL(imagen));
    }
  };

  const onSubmit = (data) => {
    setSubmitting(true);

    const formData = new FormData();

    formData.append("nombre", data.nombre);

    formData.append("precio", data.precio);

    formData.append("productos", JSON.stringify(data.productos));

    if (data.imagen) {
      formData.append("imagen", data.imagen);
    }

    // Verificar envío
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    console.log("data:", data);

    console.log("productos:", data.productos);

    data.productos.forEach((p, i) => {
      console.log("Producto", i);
      console.log("producto_id =", p.producto_id);
      console.log("cantidad =", p.cantidad);
    });

    ComboService.createCombo(formData)

      .then((response) => {
        toast.success("Combo creado correctamente", {
          duration: 4000,
          position: "top-center",
        });

        navigate("/combo-table");
      })

      .catch((error) => {
        console.log("Error creando combo:", error.response?.data || error);

        toast.error("Error al crear el combo");
      })

      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Typography variant="h5">Crear Combo</Typography>

            {/* Nombre */}

            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre del combo"
                  fullWidth
                  error={Boolean(errors.nombre)}
                  helperText={errors.nombre?.message}
                />
              )}
            />

            {/* Precio */}

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
                  helperText={errors.precio?.message}
                />
              )}
            />

            <Divider />

            <Typography variant="h6">Productos del Combo</Typography>

            {fields.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "2fr 1fr auto",
                  },
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Producto</InputLabel>

                  <Controller
                    name={`productos.${index}.producto_id`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value ?? ""}
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
                </FormControl>

                <Controller
                  name={`productos.${index}.cantidad`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cantidad"
                      type="number"
                      error={Boolean(errors.productos?.[index]?.cantidad)}
                      helperText={errors.productos?.[index]?.cantidad?.message}
                    />
                  )}
                />

                <Tooltip title="Eliminar">
                  <IconButton
                    color="error"
                    onClick={() => eliminarProducto(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={agregarProducto}
            >
              Agregar producto
            </Button>

            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.productos?.message}
            </FormHelperText>

            <Divider />

            {/* Imagen */}

            <input type="file" accept="image/*" onChange={handleChangeImage} />

            {imagenPreview && (
              <Box>
                <img src={imagenPreview} width="300" alt="preview" />
              </Box>
            )}

            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.imagen?.message}
            </FormHelperText>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={submitting}
            >
              {submitting ? "Guardando..." : "Guardar Combo"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
