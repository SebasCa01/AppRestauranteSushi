import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Typography, Button, IconButton, Tooltip, FormHelperText, Box, Paper,
  Divider, Stack, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProcesoPreparacionService from "../../services/ProcesoPreparacionService";
import ProductoService from "../../services/ProductoService";
import EstacionCocinaService from "../../services/EstacionCocinaService";

export function UpdateProceso() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [productos, setProductos] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const schema = yup.object({
    producto_id: yup.number().typeError("Seleccione un producto").required("Seleccione un producto"),
    estaciones: yup
      .array()
      .of(
        yup.object({
          estacion_id: yup.number().typeError("Seleccione una estación").required("Seleccione una estación"),
          orden: yup.number().typeError("Ingrese el orden").required("El orden es requerido").positive().integer(),
        }),
      )
      .min(1, "Debe agregar al menos una estación"),
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { producto_id: "", estaciones: [{ estacion_id: "", orden: 1 }] },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "estaciones" });

  useEffect(() => {
    ProductoService.getProducts().then((res) => setProductos(res.data || []));
    EstacionCocinaService.getEstaciones().then((res) => setEstaciones(res.data || []));
  }, []);

  useEffect(() => {
    if (id) {
      ProcesoPreparacionService.getProcesoForUpdate(id)
        .then((response) => {
          const pasos = response.data || [];
          reset({
            producto_id: Number(id),
            estaciones: pasos.length > 0
              ? pasos.map((p) => ({ estacion_id: p.EstacionID, orden: p.Orden }))
              : [{ estacion_id: "", orden: 1 }],
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, reset]);

  const agregarEstacion = () => append({ estacion_id: "", orden: fields.length + 1 });
  const eliminarEstacion = (index) => { if (fields.length > 1) remove(index); };

  const onSubmit = (dataForm) => {
    setSubmitting(true);

    ProcesoPreparacionService.updateProceso(dataForm)
      .then(() => {
        toast.success("Proceso actualizado correctamente", { duration: 4000, position: "top-center" });
        navigate("/proceso-table");
      })
      .catch(() => toast.error("Error al actualizar el proceso"))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, background: "#fffaf7", minHeight: "100%" }}>
      <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 800, mx: "auto" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#8b0000" }}>
              Actualizar Proceso de Preparación
            </Typography>

            <FormControl fullWidth error={Boolean(errors.producto_id)}>
              <InputLabel>Producto</InputLabel>
              <Controller
                name="producto_id"
                control={control}
                render={({ field }) => (
                  <Select {...field} value={field.value ?? ""} label="Producto" disabled>
                    {productos.map((prod) => (
                      <MenuItem key={prod.ProductoID} value={prod.ProductoID}>
                        {prod.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.producto_id?.message}</FormHelperText>
            </FormControl>

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#8b0000" }}>
                Estaciones del proceso
              </Typography>
              <Tooltip title="Agregar estación">
                <IconButton color="secondary" onClick={agregarEstacion}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            {fields.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "2fr 1fr auto" },
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <FormControl fullWidth error={Boolean(errors.estaciones?.[index]?.estacion_id)}>
                  <InputLabel>Estación</InputLabel>
                  <Controller
                    name={`estaciones.${index}.estacion_id`}
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={field.value ?? ""} label="Estación">
                        {estaciones.map((est) => (
                          <MenuItem key={est.EstacionID} value={est.EstacionID}>
                            {est.EstacionNombre}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.estaciones?.[index]?.estacion_id?.message}</FormHelperText>
                </FormControl>

                <Controller
                  name={`estaciones.${index}.orden`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Orden"
                      type="number"
                      error={Boolean(errors.estaciones?.[index]?.orden)}
                      helperText={errors.estaciones?.[index]?.orden?.message}
                    />
                  )}
                />

                <Tooltip title="Eliminar">
                  <IconButton color="error" onClick={() => eliminarEstacion(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}

            <FormHelperText sx={{ color: "#d32f2f" }}>{errors.estaciones?.message}</FormHelperText>

            <Button type="submit" variant="contained" color="secondary" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}