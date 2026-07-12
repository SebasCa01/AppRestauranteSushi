import axios from 'axios';

// Definición para llamar al API y obtener el listado de categorias
const BASE_URL = import.meta.env.VITE_BASE_URL + 'categoria';

class CategoriaService {
  // Listar categorias
  // localhost:81/apinombreproyecto/categorias
  getCategorias() {
    return axios.get(BASE_URL);
  }

  // Obtener categoria por su ID
  // localhost:81/apinombreproyecto/categorias/1
  getCategoriaById(CategoriaId) {
    return axios.get(`${BASE_URL}/${CategoriaId}`);
  }
}

export default new CategoriaService();