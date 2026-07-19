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

  createProducto(Producto) {
    return axios.post(BASE_URL, JSON.stringify(Producto));
  }
  
  updateProducto(Producto) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Producto)
    })
  }

  getProductoForUpdate(ProductoID){
    return axios.get(BASE_URL + '/getForUpdate/' + ProductoID);
  }
}


export default new ProductoService();
    