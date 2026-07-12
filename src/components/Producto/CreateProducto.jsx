import React from 'react';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormHelperText } from '@mui/material';
import ProductoService from '../../services/ProductoService';
import CategoriaService from '../../services/CategoriaService';
import IngredienteService from '../../services/IngredienteService';
import ImageService from '../../services/ImageService';
import { SelectCategoria } from './Form/SelectCategoria';
import { SelectIngredientes } from './Form/SelectIngredientes';

export function CreateProducto() {
  const navigate = useNavigate();
  let formData = new FormData();

  // Esquema de validación
  const productoSchema = yup.object({
    nombre: yup.string()
      .required('El nombre es requerido')
      .min(2, 'Debe tener al menos 2 caracteres'),
    descripcion: yup.string()
      .required('La descripción es requerida')
      .min(5, 'Debe tener al menos 5 caracteres'),
    precio: yup.number()
      .typeError('Debe ser un número')
      .required('El precio es requerido')
      .positive('Debe ser positivo'),
    categoria_id: yup.number()
      .typeError('Seleccione una categoría')
      .required('La categoría es requerida'),
    ingredientes: yup.array()
      .of(yup.number().required('Seleccione un ingrediente'))
      .min(1, 'Debe seleccionar al menos un ingrediente'),
    imagen: yup.mixed().required('La imagen es requerida')
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: '',
      categoria_id: '',
      ingredientes: [],
      imagen: ''
    },
    resolver: yupResolver(productoSchema),
  });

  // Gestión de errores
  const [error, setError] = useState('');
  const onError = (errors, e) => console.log(errors, e);

  // Acción submit
  const onSubmit = (DataForm) => {
    try {
      ProductoService.createProducto(DataForm)
        .then((response) => {
          setError(response.error);
          if (response.data != null) {
            formData.append("file", file);
            formData.append("producto_id", response.data.id);
            ImageService.createImage(formData)
              .then((response) => {
                setError(response.error);
                if (response.data != null) {
                  toast.success(`Producto creado #${response.data.id} - ${response.data.nombre}`, {
                    duration: 4000,
                    position: "top-center"
                  });
                }
              });
            return navigate('/producto-table');
          }
        })
        .catch((error) => {
          setError(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  // Listas externas
  const [dataCategorias, setDataCategorias] = useState({});
  const [loadedCategorias, setLoadedCategorias] = useState(false);
  useEffect(() => {
    CategoriaService.getCategorias()
      .then((response) => {
        setDataCategorias(response.data);
        setLoadedCategorias(true);
      });
  }, []);

  const [dataIngredientes, setDataIngredientes] = useState({});
  const [loadedIngredientes, setLoadedIngredientes] = useState(false);
  useEffect(() => {
    IngredienteService.getIngredientes()
      .then((response) => {
        setDataIngredientes(response.data);
        setLoadedIngredientes(true);
      });
  }, []);

  // Imagen
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  function handleChangeImage(e) {
    if (e.target.files) {
      setFileURL(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Typography variant="h5">Crear Producto</Typography>
        </Grid>

        {/* Nombre */}
        <Grid size={6}>
          <Controller name="nombre" control={control}
            render={({ field }) => (
              <TextField {...field} label="Nombre"
                error={Boolean(errors.nombre)}
                helperText={errors.nombre?.message || ''} />
            )}
          />
        </Grid>

        {/* Descripción */}
        <Grid size={6}>
          <Controller name="descripcion" control={control}
            render={({ field }) => (
              <TextField {...field} label="Descripción"
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion?.message || ''} />
            )}
          />
        </Grid>

        {/* Precio */}
        <Grid size={6}>
          <Controller name="precio" control={control}
            render={({ field }) => (
              <TextField {...field} label="Precio"
                error={Boolean(errors.precio)}
                helperText={errors.precio?.message || ''} />
            )}
          />
        </Grid>

        {/* Categoría */}
        <Grid size={6}>
          {loadedCategorias && (
            <Controller name="categoria_id" control={control}
              render={({ field }) => (
                <SelectCategoria field={field} data={dataCategorias} />
              )}
            />
          )}
          <FormHelperText sx={{ color: '#d32f2f' }}>
            {errors.categoria_id?.message || ' '}
          </FormHelperText>
        </Grid>

        {/* Ingredientes */}
        <Grid size={12}>
          {loadedIngredientes && (
            <Controller name="ingredientes" control={control}
              render={({ field }) => (
                <SelectIngredientes field={field} data={dataIngredientes}
                  error={Boolean(errors.ingredientes)} />
              )}
            />
          )}
          <FormHelperText sx={{ color: '#d32f2f' }}>
            {errors.ingredientes?.message || ' '}
          </FormHelperText>
        </Grid>

        {/* Imagen */}
        <Grid size={12}>
          <Controller name="imagen" control={control}
            render={({ field }) => (
              <input type="file" {...field} onChange={handleChangeImage} />
            )}
          />
          <img src={fileURL} width={300} />
        </Grid>

        {/* Botón */}
        <Grid size={12}>
          <Button type="submit" variant="contained" color="secondary">
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
