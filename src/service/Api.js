import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const promt = (promptMsg) => {
    let token = localStorage.getItem("token");
    return axios.post(`${API}/`,promptMsg,{ headers: { Authorization: `Bearer ${token}` }});
}

export const fetchHistory= () => {
    let token = localStorage.getItem("token");
    let response = axios.get(`${API}/history`,{ headers: {  Authorization: `Bearer ${token}` }});
    return response;
}

export const login = (user) =>{
    return axios.post(`${API}/login`, user,);
}

export const register = (user) =>{
    return axios.post(`${API}/register`, user);
}