import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Paper, Typography, Stack, Chip, CircularProgress, Button, Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProcesoPreparacionService from "../../services/ProcesoPreparacionService";

export function DetailProceso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proceso, setProceso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProcesoPreparacionService.getProcesoDetail(id)
      .then((response) => setProceso(response.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!proceso) {
    return <Typography sx={{ p: 3 }}>No se encontró el proceso.</Typography>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "#fffaf7", minHeight: "100%" }}>
      <Paper sx={{ maxWidth: 700, mx: "auto", p: 4, borderRadius: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/proceso-table")} sx={{ mb: 2 }}>
          Volver
        </Button>

        <Typography variant="h5" sx={{ fontWeight: 700, color: "#8b0000", mb: 1 }}>
          {proceso.Nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Proceso de preparación — {proceso.Estaciones?.length || 0} paso(s)
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          {proceso.Estaciones?.map((estacion, index) => (
            <Stack
              key={estacion.ProcesoID}
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ p: 2, borderRadius: 2, border: "1px solid rgba(0,0,0,0.08)" }}
            >
              <Chip
                label={estacion.Orden}
                sx={{ backgroundColor: "#8b0000", color: "#fff", fontWeight: 700, minWidth: 40 }}
              />
              <Typography sx={{ fontWeight: 600 }}>{estacion.EstacionNombre}</Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}