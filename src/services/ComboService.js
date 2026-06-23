import axios from 'axios';

// Definición para llamar al API y obtener el listado de combos
const BASE_URL = import.meta.env.VITE_BASE_URL + 'combo';

class ComboService {
  // Listar combos
  // localhost:81/apinombreproyecto/combo
  getCombos() {
    return axios.get(BASE_URL);
  }

  // Obtener combo por su ID
  // localhost:81/apinombreproyecto/combo/1
  getComboById(comboId) {
    return axios.get(`${BASE_URL}/${comboId}`);
  }
}

export default new ComboService();
