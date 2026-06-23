import axios from 'axios';
//Definición para Llamar al API y obtener el listado de productos
const BASE_URL = import.meta.env.VITE_BASE_URL + 'producto';
class ProductoService {
  //Listas productos
  //localhost:81/apinombreproyecto/producto
  getProducts() {
    return axios.get(BASE_URL);
  }
  //Obtener productos
  //localhost:81/apinombreproyecto/producto/1
  getProductoById(ProductoID){
    return axios.get(BASE_URL+'/'+ProductoID);
  }
}

export default new ProductoService();
    