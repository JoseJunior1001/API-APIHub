// server.js
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Configuração do Supabase (use variáveis de ambiente no Render)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 🚀 Rota de teste
app.get("/", (req, res) => {
  res.send("APIHub Backend rodando ✅");
});

//////////////////////////
// 🔹 AUTENTICAÇÃO
//////////////////////////

// Cadastro de usuário
app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  // Criar usuário no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Usuário registrado com sucesso!", user: data.user });
});

// Login de usuário
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Login realizado com sucesso!", session: data.session });
});

//////////////////////////
// 🔹 GERENCIAMENTO DE APIs
//////////////////////////

// Criar uma nova API
app.post("/apis", async (req, res) => {
  const { user_id, name, description, url, category } = req.body;

  if (!user_id || !name || !url) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios!" });
  }

  const { data, error } = await supabase
    .from("apis")
    .insert([{ user_id, name, description, url, category }]);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "API cadastrada com sucesso!", api: data[0] });
});

// Listar todas as APIs
app.get("/apis", async (req, res) => {
  const { data, error } = await supabase.from("apis").select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

// Listar APIs de um usuário
app.get("/apis/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("apis")
    .select("*")
    .eq("user_id", user_id);

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

//////////////////////////
// 🔹 SERVIDOR
//////////////////////////

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
