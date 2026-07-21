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
  label: PropTypes.string,
  allowAll: PropTypes.bool,
};

export function SelectCategoria({ field, data, error, label = "Categoría", allowAll = false }) {
  return (
    <FormControl variant="outlined" fullWidth error={error}>
      <InputLabel id="categoria-label">{label}</InputLabel>
      <Select
        {...field}
        labelId="categoria-label"
        label={label}
        value={
          field.value === "" || field.value === null || field.value === undefined
            ? ""
            : Number(field.value)
        }
        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
      >
        {allowAll && (
          <MenuItem value="">
            <em>Todas las categorías</em>
          </MenuItem>
        )}
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