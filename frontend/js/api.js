



const api = axios.create({
  baseURL: window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")
    ? "http://localhost:3000"
    : "https://bloodcare-api.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});