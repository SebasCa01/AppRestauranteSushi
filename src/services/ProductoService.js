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
    return axios.post(BASE_URL, Producto, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  
  updateProducto(Producto) {
    return axios.put(BASE_URL, Producto, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  getProductoForUpdate(ProductoID){
    return axios.get(BASE_URL + '/getForUpdate/' + ProductoID);
  }
}


export default new ProductoService();
    