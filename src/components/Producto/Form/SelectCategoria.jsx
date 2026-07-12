import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import PropTypes from "prop-types";

SelectCategoria.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};

export function SelectCategoria({ field, data }) {
  return (
    <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
      <InputLabel id="categoria">Categoría</InputLabel>
      <Select
        {...field}
        labelId="categoria"
        label="Categoría"
        defaultValue=""
        value={field.value}
      >
        {data &&
          data.map((categoria) => (
            <MenuItem key={categoria.CategoriaID} value={categoria.CategoriaID}>
              {categoria.Nombre}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
