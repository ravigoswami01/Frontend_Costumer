//for API  for login and register
 const  LOGIN = "/api/auth/login";
 const REGISTER = "/api/auth/register";

 //api for  menu item 
 const GET_MENU_ITEM = "/api/menu/";


 //api for cart
 const ADD_TO_CART= "/api/cart/add";
 const GET_CART = "/api/cart/";
 const UPDATE_QTY = "/api/cart/update";
 const REMOVE_FROM_CART = "/api/cart/remove/:menuItemId";
 const CLEAR_CART = "/api/cart/clear";    
 

 export { LOGIN, REGISTER, GET_MENU_ITEM, ADD_TO_CART, GET_CART, UPDATE_QTY, REMOVE_FROM_CART, CLEAR_CART };