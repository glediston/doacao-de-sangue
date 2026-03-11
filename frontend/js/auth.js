


async function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const gender = document.getElementById("regGender").value;
  const bloodType = document.getElementById("regBlood").value;

  const error = document.getElementById("registerError");

  try {
    await api.post("/auth/register", {
      name,
      email,
      password,
      gender,
      bloodType,
    });

    alert("Usuário cadastrado com sucesso!");

    closeModal();

  } catch (err) {
    error.innerText =
      err.response?.data?.error || "Erro ao cadastrar usuário";
  }
}   


async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const error = document.getElementById("loginError");

  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "ADMIN") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }

  } catch (err) {
    error.innerText =
      err.response?.data?.error || "Erro ao fazer login";
  }
}