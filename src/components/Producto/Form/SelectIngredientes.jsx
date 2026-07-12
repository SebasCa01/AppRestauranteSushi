import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import PropTypes from "prop-types";

SelectIngredientes.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};

export function SelectIngredientes({ field, data }) {
  return (
    <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
      <InputLabel id="ingredientes">Ingredientes</InputLabel>
      <Select
        {...field}
        labelId="ingredientes"
        label="Ingredientes"
        multiple
        defaultValue={[]}
        value={field.value}
      >
        {data &&
          data.map((ingrediente) => (
            <MenuItem
              key={ingrediente.IngredienteID}
              value={ingrediente.IngredienteID}
            >
              {ingrediente.Nombre}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
