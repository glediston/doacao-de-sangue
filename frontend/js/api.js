const api = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://bloodcare-api.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});