import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

SelectIngredientes.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
  error: PropTypes.bool,
};

export function SelectIngredientes({ field, data, error }) {
  const selected = Array.isArray(field.value) ? field.value.map(Number) : [];

  const getNombre = (idIngrediente) =>
    data?.find((i) => Number(i.IngredienteID) === idIngrediente)?.Nombre ?? idIngrediente;

  return (
    <FormControl variant="outlined" fullWidth error={error}>
      <InputLabel id="ingredientes-label">Ingredientes</InputLabel>
      <Select
        {...field}
        labelId="ingredientes-label"
        label="Ingredientes"
        multiple
        value={selected}
        onChange={(e) => field.onChange(e.target.value.map(Number))}
        renderValue={(seleccionados) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {seleccionados.map((id) => (
              <Chip key={id} label={getNombre(id)} size="small" />
            ))}
          </Box>
        )}
      >
        {data &&
          data.map((ingrediente) => (
            <MenuItem
              key={ingrediente.IngredienteID}
              value={Number(ingrediente.IngredienteID)}
            >
              {ingrediente.Nombre}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
