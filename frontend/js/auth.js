




async function register() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const gender = document.getElementById("regGender").value;
  const bloodType = document.getElementById("regBlood").value;

  const error = document.getElementById("registerError");
  error.innerText = "";

  if (!name || !email || !password || !gender || !bloodType) {
    error.innerText = "Preencha todos os campos";
    return;
  }

  try {
    await api.post("/api/auth/register", {
      name,
      email,
      password,
      gender,
      bloodType
    });

    alert("✅ Usuário cadastrado com sucesso!");

    closeModal();

    document.getElementById("regName").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPassword").value = "";

  } catch (err) {
    error.innerText =
      err.response?.data?.error ||
      "Erro ao cadastrar usuário";
  }
}





async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const error = document.getElementById("loginError");
  error.innerText = "";

  if (!email || !password) {
    error.innerText = "Informe email e senha";
    return;
  }

  try {
    const response = await api.post("/api/auth/login", {
      email,
      password
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "ADMIN") {
      window.location.href = "/admin.html";
    } else {
      window.location.href = "/dashboard.html";
    }

  } catch (err) {
    error.innerText =
      err.response?.data?.error ||
      "Email ou senha inválidos";
  }
}