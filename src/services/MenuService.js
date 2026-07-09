import axios from 'axios';
//Definición para Llamar al API y obtener el listado de menus
const BASE_URL = import.meta.env.VITE_BASE_URL + 'menu';
class MenuService {
  //Listas menus
  //localhost:81/apinombreproyecto/menu
  getMenus() {
    return axios.get(BASE_URL);
  }
  //Obtener menus
  //localhost:81/apinombreproyecto/menu/1
  getMenuById(MenuID){
    return axios.get(BASE_URL+'/'+MenuID);
  }
}

export default new MenuService();