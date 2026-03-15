


const api = axios.create({
  baseURL: window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")
    ? "http://localhost:3000"
    : "https://bloodcare-api.onrender.com",
});

// Intercepta a requisição para injetar o token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// NOVO: Intercepta a resposta para deslogar caso o token seja inválido/expirado (Erro 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "index.html"; // Redireciona para o login
    }
    return Promise.reject(error);
  }
);

async function fetchDonations() {
  const response = await api.get("/api/donations/history");
  return response.data;
}

async function fetchLastDonation() {
  const response = await api.get("/api/donations/last");
  return response.data;
}

async function registerDonation(donationData) {
  const response = await api.post("/api/donations", donationData);
  return response.data;
}

async function fetchDonationStatus() {
  const response = await api.get("/api/status");
  return response.data;
}

async function fetchAvailableDonors() {
  // Rota corrigida com base no backend
  const response = await api.get("/api/donors/usuarios-disponiveis");
  return response.data;
}

async function updateMyAvailability(userId, status) {
  // ✅ BUG CORRIGIDO: Rota exata conforme o backend
  const response = await api.put(`/api/donors/usuarios/${userId}/disponibilidade`, { availability: status });
  return response.data;
}