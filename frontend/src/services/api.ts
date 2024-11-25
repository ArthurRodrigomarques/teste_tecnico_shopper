import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8080",
})

export default api;

export const createUser = async (data: { name: string, email: string}) => {
    const response = await api.post("/register", data);
    return response.data;
}