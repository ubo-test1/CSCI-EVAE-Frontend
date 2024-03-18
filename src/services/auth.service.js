import axios from "axios";
import * as constants from "../constants";

class AuthService {
    login(username, password) {
      return axios
        .post( constants.API + "auth/login", {
          username,
          password
        })
        .then(response => {
          if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }
  
          return response.data;
        });
    }
  
    logout() {
      localStorage.removeItem("user");
    }
  
    /*
    register(username, email, password) {
      return axios.post(API_URL + "signup", {
        username,
        email,
        password
      });
    }*/
  
    //kd
    getCurrentUser() {
      return JSON.parse(localStorage.getItem('user'));;
    }
  }
  
  export default new AuthService();