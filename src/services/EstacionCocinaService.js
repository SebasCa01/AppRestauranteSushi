import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'estacioncocina';

class EstacionCocinaService {
  getEstaciones() {
    return axios.get(BASE_URL);
  }
}
export default new EstacionCocinaService();