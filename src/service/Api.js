import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const promt = (promptMsg, token) => {
    return axios.post(`${API}/`,{
    message: promptMsg
  },{ headers: { Authorization: `Bearer ${token}` }});
}

export const fetchHistory= () => {
    let token = localStorage.getItem("token");
    let response;
    if(token) {
        response = axios.get(`${API}/history`,{ headers: {  Authorization: `Bearer ${token}` }});
    } 
    return response;
}

export const login = (user) =>{
    return axios.post(`${API}/login`, user,);
}

export const register = (user) =>{
    return axios.post(`${API}/register`, user);
}