import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormHelperText } from "@mui/material";
import toast from "react-hot-toast";

import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import IngredienteService from "../../services/IngredienteService";
import { SelectCategoria } from "./Form/SelectCategoria";
import { SelectIngredientes } from "./Form/SelectIngredientes";

export function UpdateProducto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState("");

  // Validación
  const productoSchema = yup.object({
    nombre: yup.string().required("El nombre es requerido"),
    descripcion: yup.string().required("La descripción es requerida"),
    precio: yup.number().positive().required("El precio es requerido"),
    categoria_id: yup.number().required("La categoría es requerida"),
    ingredientes: yup.array().min(1, "Debe seleccionar al menos un ingrediente"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      categoria_id: "",
      ingredientes: [],
    },
    resolver: yupResolver(productoSchema),
  });

  // Obtener producto por ID
  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      ProductoService.getProductoById(id)
        .then((response) => {
          const producto = response.data;
          if (!producto) return;

          // Ajustar nombres según backend
          producto.categoria_id = producto.categoria?.CategoriaID || "";
          producto.ingredientes = Array.isArray(producto.ingredientes)
            ? producto.ingredientes.map((item) => item.IngredienteID)
            : [];

          // Cargar datos en el formulario
          reset({
            nombre: producto.nombre || producto.Nombre || "",
            descripcion: producto.descripcion || producto.Descripcion || "",
            precio: producto.precio || producto.Precio || "",
            categoria_id: producto.categoria_id,
            ingredientes: producto.ingredientes,
          });
        })
        .catch((err) => setError(err));
    }
  }, [id, reset]);

  // Listas externas
  const [dataCategorias, setDataCategorias] = useState([]);
  useEffect(() => {
    CategoriaService.getCategorias()
      .then((response) => setDataCategorias(response.data || []))
      .catch((err) => setError(err));
  }, []);

  const [dataIngredientes, setDataIngredientes] = useState([]);
  useEffect(() => {
    IngredienteService.getIngredientes()
      .then((response) => setDataIngredientes(response.data || []))
      .catch((err) => setError(err));
  }, []);

  // Submit
  const onSubmit = (DataForm) => {
    ProductoService.updateProducto(DataForm)
      .then((response) => {
        if (response.data) {
          toast.success(
            `Producto actualizado #${response.data.id} - ${response.data.nombre}`,
            { duration: 4000, position: "top-center" }
          );
          navigate("/producto-table");
        }
      })
      .catch((err) => setError(err));
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Actualizar Producto
          </Typography>
        </Grid>

        {/* Nombre */}
        <Grid item xs={6}>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre"
                error={Boolean(errors.nombre)}
                helperText={errors.nombre?.message || " "}
              />
            )}
          />
        </Grid>

        {/* Descripción */}
        <Grid item xs={6}>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descripción"
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion?.message || " "}
              />
            )}
          />
        </Grid>

        {/* Precio */}
        <Grid item xs={6}>
          <Controller
            name="precio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Precio"
                type="number"
                error={Boolean(errors.precio)}
                helperText={errors.precio?.message || " "}
              />
            )}
          />
        </Grid>

        {/* Categoría */}
        <Grid item xs={6}>
          <Controller
            name="categoria_id"
            control={control}
            render={({ field }) => (
              <SelectCategoria
                field={field}
                data={dataCategorias}
                error={Boolean(errors.categoria_id)}
                onChange={(e) =>
                  setValue("categoria_id", e.target.value, {
                    shouldValidate: true,
                  })
                }
              />
            )}
          />
          <FormHelperText sx={{ color: "#d32f2f" }}>
            {errors.categoria_id?.message || " "}
          </FormHelperText>
        </Grid>

        {/* Ingredientes */}
        <Grid item xs={12}>
          <Controller
            name="ingredientes"
            control={control}
            render={({ field }) => (
              <SelectIngredientes
                field={field}
                data={dataIngredientes}
                error={Boolean(errors.ingredientes)}
                onChange={(e) =>
                  setValue("ingredientes", e.target.value, {
                    shouldValidate: true,
                  })
                }
              />
            )}
          />
          <FormHelperText sx={{ color: "#d32f2f" }}>
            {errors.ingredientes?.message || " "}
          </FormHelperText>
        </Grid>

        {/* Botón */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
