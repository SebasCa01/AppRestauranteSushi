import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import PropTypes from "prop-types";

SelectCategoria.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
  error: PropTypes.bool,
};

export function SelectCategoria({ field, data, error }) {
  return (
    <FormControl variant="outlined" fullWidth error={error}>
      <InputLabel id="categoria-label">Categoría</InputLabel>
      <Select
        {...field}
        labelId="categoria-label"
        label="Categoría"
        // Forzamos a number para que coincida con el value numérico de cada
        // MenuItem; si llega "" (sin selección) se muestra vacío.
        value={field.value === "" || field.value === null || field.value === undefined
          ? ""
          : Number(field.value)}
        onChange={(e) => field.onChange(Number(e.target.value))}
      >
        {data &&
          data.map((categoria) => (
            <MenuItem key={categoria.CategoriaID} value={Number(categoria.CategoriaID)}>
              {categoria.Nombre}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
