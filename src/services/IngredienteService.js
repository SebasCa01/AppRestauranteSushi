import axios from 'axios';

// Definición para llamar al API y obtener el listado de ingredientes
const BASE_URL = import.meta.env.VITE_BASE_URL + 'ingrediente';

class IngredienteService {
  // Listar ingredientes
  // localhost:81/apinombreproyecto/ingredientes
  getIngredientes() {
    return axios.get(BASE_URL);
  }

  // Obtener ingrediente por su ID
  // localhost:81/apinombreproyecto/ingredientes/1
  getIngredienteById(ingredienteId) {
    return axios.get(`${BASE_URL}/${ingredienteId}`);
  }
}

export default new IngredienteService();