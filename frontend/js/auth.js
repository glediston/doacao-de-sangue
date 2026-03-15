


async function register() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const gender = document.getElementById("regGender").value;
  const bloodType = document.getElementById("regBlood").value;

  const error = document.getElementById("registerError");
  const btn = document.querySelector("#registerModal button:first-of-type");
  error.innerText = "";

  if (!name || !email || !password || !gender || !bloodType) {
    error.innerText = "Preencha todos os campos";
    return;
  }

  try {
    btn.disabled = true; // Desabilita o botão
    btn.innerText = "Cadastrando..."; // UX de carregamento

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
    error.innerText = err.response?.data?.error || "Erro ao cadastrar usuário";
  } finally {
    btn.disabled = false;
    btn.innerText = "Cadastrar";
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const error = document.getElementById("loginError");
  const btn = document.querySelector("#loginModal button:first-of-type");
  error.innerText = "";

  if (!email || !password) {
    error.innerText = "Informe email e senha";
    return;
  }

  try {
    btn.disabled = true;
    btn.innerText = "Entrando...";

    const response = await api.post("/api/auth/login", {
      email,
      password
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "ADMIN") {
      window.location.href = "admin.html"; // Assumindo que você criará essa no futuro
    } else {
      
      window.location.href = "user.html";
    }

  } catch (err) {
    error.innerText = err.response?.data?.error || "Email ou senha inválidos";
  } finally {
    btn.disabled = false;
    btn.innerText = "Entrar";
  }
}