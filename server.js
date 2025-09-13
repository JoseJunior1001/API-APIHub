const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Banco de dados simulado em memória
let apiData = [
  {
    id: 1,
    name: "ValidaBR API",
    category: "Dados",
    description: "API para validação de dados brasileiros como CPF, CNPJ, e-mail, senha, telefone e CEP.",
    url: "https://api-validacao-de-dados.onrender.com/validate",
    auth: "Nenhuma",
    https: true,
    cors: true,
    usage: {
        endpoint: "/validate/?value",
        method: "GET",
        parameters: {value: "Valor a ser validado, sem necessidade de indicação, realiza a identificação automáticamente."},
        example: "https://api-validacao-de-dados.onrender.com/validate?value=123.456.789-09",
        response: `{
  "valid": true,
  "message": "CPF válido",
  "formatted": "123.456.789-09"
}`
    }
  },
  {
    id: 2,
    name: "DATAPI",
    category: "Datas",
    description: "API para envio de datas comemorativas e dias especiais ao longo do ano. Podendo ser por dia ou mês.",
    url: "https://api-datas-comemorativas.onrender.com/api/",
    auth: "Nenhuma",
    https: true,
    cors: true,
    usage: {
        endpoint: "/datas?mes=12<br>/datas?dia=25-12",
        method: "GET",
        parameters: {
            type: "Tipo de consulta (day, month, all)",
            month: "Mês para filtrar (1-12, apenas para type=month)",
            day: "Dia para filtrar (apenas para type=day)"
        },
        example: "https://api-datas-comemorativas.onrender.com/api/datas?dia=25-12",
        response: `{
  "month": 12,
  "holidays": [
    {
      "date": "2023-12-25",
      "name": "Natal",
      "type": "nacional"
    }
  ]
}`
    }
  },
  {
    id: 3,
    name: "JSONPlaceholder",
    category: "Dados",
    description: "Fake REST API para testes e aprendizado.",
    url: "https://jsonplaceholder.typicode.com",
    auth: "Nenhuma",
    https: true,
    cors: true,
    usage: {
        endpoint: "/{resource}",
        method: "GET, POST, PUT, DELETE",
        parameters: {
            resource: "Recurso desejado (posts, comments, albums, photos, todos, users)"
        },
        example: "https://jsonplaceholder.typicode.com/posts",
        response: `[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto"
  }
]`
    }
  },
  {
    id: 4,
    name: "PokeAPI",
    category: "Diversão",
    description: "Dados completos sobre Pokémon.",
    url: "https://pokeapi.co/api/v2",
    auth: "Nenhuma",
    https: true,
    cors: true,
    usage: {
        endpoint: "/pokemon/{id_or_name}",
        method: "GET",
        parameters: {
            id_or_name: "ID ou nome do Pokémon"
        },
        example: "https://pokeapi.co/api/v2/pokemon/pikachu",
        response: `{
  "name": "pikachu",
  "id": 25,
  "abilities": [
    {
      "ability": {
        "name": "static",
        "url": "https://pokeapi.co/api/v2/ability/9/"
      }
    }
  ],
  "types": [
    {
      "type": {
        "name": "electric",
        "url": "https://pokeapi.co/api/v2/type/13/"
      }
    }
  ]
}`
    }
  },
  {
    id: 5,
    name: "The Dog API",
    category: "Animais",
    description: "Fotos e informações de cachorros.",
    url: "https://api.thedogapi.com/v1",
    auth: "Opcional (API Key)",
    https: true,
    cors: true,
    usage: {
        endpoint: "/images/search",
        method: "GET",
        parameters: {
            limit: "Número de resultados (opcional)",
            breed_id: "ID da raça (opcional)",
            format: "Formato (json, src) (opcional)"
        },
        example: "https://api.thedogapi.com/v1/images/search?limit=5",
        response: `[
  {
    "id": "HJQ9feNmX",
    "url": "https://cdn2.thedogapi.com/images/HJQ9feNmX_1280.jpg",
    "breeds": [
      {
        "name": "Akita",
        "bred_for": "Hunting bears",
        "life_span": "10 - 14 years"
      }
    ]
  }
]`
    }
  },
  {
    id: 6,
    name: "The Cat API",
    category: "Animais",
    description: "Fotos e raças de gatos.",
    url: "https://api.thecatapi.com/v1",
    auth: "Opcional (API Key)",
    https: true,
    cors: true,
    usage: {
        endpoint: "/images/search",
        method: "GET",
        parameters: {
            limit: "Número de resultados (opcional)",
            breed_id: "ID da raça (opcional)",
            category_ids: "IDs de categorias (opcional)"
        },
        example: "https://api.thecatapi.com/v1/images/search?limit=3",
        response: `[
  {
    "id": "2f6",
    "url": "https://cdn2.thecatapi.com/images/2f6.jpg",
    "width": 500,
    "height": 333
  }
]`
    }
  },
  {
    id: 7,
    name: "Advice Slip API",
    category: "Diversão",
    description: "Gera frases e conselhos aleatórios.",
    url: "https://api.adviceslip.com",
    auth: "Nenhuma",
    https: true,
    cors: true,
    usage: {
        endpoint: "/advice",
        method: "GET",
        parameters: "Nenhum parâmetro necessário para conselho aleatório",
        example: "https://api.adviceslip.com/advice",
        response: `{
  "slip": {
    "id": 117,
    "advice": "Remember that spiders are more afraid of you than you are of them."
  }
}`
    }
  },
  {
    id: 8,
    name: "Bored API",
    category: "Diversão",
    description: "Sugestões de atividades para quando você está entediado.",
    url: "https://www.boredapi.com/api",
    auth: "Nenhuma",
    https: true,
    cors: true,
    usage: {
        endpoint: "/activity",
        method: "GET",
        parameters: {
            type: "Tipo de atividade (education, recreational, social, etc.)",
            participants: "Número de participantes",
            price: "Preço (0.0 a 1.0)",
            accessibility: "Acessibilidade (0.0 a 1.0)"
        },
        example: "https://www.boredapi.com/api/activity?type=recreational",
        response: `{
  "activity": "Go to a concert with some friends",
  "type": "social",
  "participants": 4,
  "price": 0.5,
  "link": "",
  "key": "2211716",
  "accessibility": 0.3
}`
    }
  },
  {
    id: 9,
    name: "Open Meteo",
    category: "Clima",
    description: "API de previsão do tempo grátis e sem chave.",
    url: "https://api.open-meteo.com/v1/forecast",
    auth: "Nenhuma",
    https: true,
    cors: true,
    usage: {
        endpoint: "/v1/forecast",
        method: "GET",
        parameters: {
            latitude: "Latitude da localização",
            longitude: "Longitude da localização",
            hourly: "Variáveis horárias (temperature_2m, etc.)",
            daily: "Variáveis diárias (temperature_2m_max, etc.)",
            timezone: "Fuso horário (auto ou específico)"
        },
        example: "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m",
        response: `{
  "latitude": 52.52,
  "longitude": 13.419,
  "hourly": {
    "time": ["2023-07-01T00:00", "2023-07-01T01:00"],
    "temperature_2m": [13, 12]
  }
}`
    }
  }
];

// Função para gerar próximo ID
const getNextId = () => {
  return apiData.length > 0 ? Math.max(...apiData.map(api => api.id)) + 1 : 1;
};

// Rotas

// GET /apis - Lista todas as APIs
app.get('/apis', (req, res) => {
  res.json(apiData);
});

// GET /apis/:id - Retorna os detalhes de uma API pelo ID
app.get('/apis/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const api = apiData.find(api => api.id === id);
  
  if (!api) {
    return res.status(404).json({ error: 'API não encontrada' });
  }
  
  res.json(api);
});

// POST /apis - Adiciona uma nova API
app.post('/apis', (req, res) => {
  const { name, url, category, description, auth, https, cors, usage } = req.body;
  
  // Validações simples
  if (!name || !url) {
    return res.status(400).json({ error: 'Nome e URL são obrigatórios' });
  }
  
  const newApi = {
    id: getNextId(),
    name,
    url,
    category: category || "Outros",
    description: description || "",
    auth: auth || "Nenhuma",
    https: https !== undefined ? https : true,
    cors: cors !== undefined ? cors : true,
    usage: usage || {}
  };
  
  apiData.push(newApi);
  res.status(201).json(newApi);
});

// PUT /apis/:id - Edita uma API existente
app.put('/apis/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const apiIndex = apiData.findIndex(api => api.id === id);
  
  if (apiIndex === -1) {
    return res.status(404).json({ error: 'API não encontrada' });
  }
  
  const { name, url, category, description, auth, https, cors, usage } = req.body;
  
  // Validações simples
  if (name === "" || url === "") {
    return res.status(400).json({ error: 'Nome e URL não podem ser vazios' });
  }
  
  // Atualiza apenas os campos fornecidos
  if (name !== undefined) apiData[apiIndex].name = name;
  if (url !== undefined) apiData[apiIndex].url = url;
  if (category !== undefined) apiData[apiIndex].category = category;
  if (description !== undefined) apiData[apiIndex].description = description;
  if (auth !== undefined) apiData[apiIndex].auth = auth;
  if (https !== undefined) apiData[apiIndex].https = https;
  if (cors !== undefined) apiData[apiIndex].cors = cors;
  if (usage !== undefined) apiData[apiIndex].usage = usage;
  
  res.json(apiData[apiIndex]);
});

// DELETE /apis/:id - Remove uma API existente
app.delete('/apis/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const apiIndex = apiData.findIndex(api => api.id === id);
  
  if (apiIndex === -1) {
    return res.status(404).json({ error: 'API não encontrada' });
  }
  
  const deletedApi = apiData.splice(apiIndex, 1);
  res.json({ message: 'API removida com sucesso', api: deletedApi[0] });
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo à APIHub API!',
    endpoints: {
      getAll: 'GET /apis',
      getById: 'GET /apis/:id',
      create: 'POST /apis',
      update: 'PUT /apis/:id',
      delete: 'DELETE /apis/:id'
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});