import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + 'procesopreparacion';

class ProcesoPreparacionService {
  // Listado de procesos (productos con cantidad de pasos)
  getProcesos() {
    return axios.get(BASE_URL);
  }

  // Detalle de un proceso por ProductoID
  getProcesoDetail(productoId) {
    return axios.get(`${BASE_URL}/${productoId}`);
  }

  // Para precargar el formulario de editar
  getProcesoForUpdate(productoId) {
    return axios.get(`${BASE_URL}/getForUpdate/${productoId}`);
  }

  createProceso(data) {
    return axios.post(BASE_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  updateProceso(data) {
    return axios.put(BASE_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default new ProcesoPreparacionService();