import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // your backend running on port 5000
});

export default api;
