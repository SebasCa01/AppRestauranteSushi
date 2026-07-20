import axios from "axios";

// Definición para llamar al API y obtener el listado de combos
const BASE_URL = import.meta.env.VITE_BASE_URL + "combo";

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

  createCombo(data) {
    return axios.post(BASE_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  updateCombo(data) {
    return axios.put(BASE_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  getComboForUpdate(ComboID) {
    return axios.get(BASE_URL + "/getForUpdate/" + ComboID);
  }
}

export default new ComboService();
