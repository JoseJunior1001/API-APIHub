const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Arquivo para persistência
const DATA_FILE = path.join(__dirname, 'data', 'apis.json');

// Função para carregar dados do arquivo
async function loadData() {
    try {
        await fs.access(path.dirname(DATA_FILE));
    } catch (error) {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    }
    
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Se o arquivo não existir, retorna array vazio
        return [];
    }
}

// Função para salvar dados no arquivo
async function saveData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        throw error;
    }
}

// Rotas

// GET /apis → lista todas as APIs
app.get('/apis', async (req, res) => {
    try {
        const apis = await loadData();
        res.json(apis);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar APIs' });
    }
});

// GET /apis/:id → retorna os detalhes de uma API pelo ID
app.get('/apis/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const apis = await loadData();
        const api = apis.find(api => api.id === id);
        
        if (!api) {
            return res.status(404).json({ error: 'API não encontrada' });
        }
        
        res.json(api);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar API' });
    }
});

// POST /apis → adiciona uma nova API
app.post('/apis', async (req, res) => {
    try {
        const { name, url, category, description, auth, https, cors, usage } = req.body;
        
        // Validações simples
        if (!name || !url) {
            return res.status(400).json({ error: 'Nome e URL são obrigatórios' });
        }
        
        const apis = await loadData();
        
        // Gerar ID incremental
        const nextId = apis.length > 0 ? Math.max(...apis.map(api => api.id)) + 1 : 1;
        
        const newApi = {
            id: nextId,
            name,
            url,
            category: category || "Outros",
            description: description || "",
            auth: auth || "Nenhuma",
            https: https !== undefined ? https : true,
            cors: cors !== undefined ? cors : true,
            usage: usage || {}
        };
        
        apis.push(newApi);
        await saveData(apis);
        
        res.status(201).json(newApi);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar API' });
    }
});

// PUT /apis/:id → edita uma API existente
app.put('/apis/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const apis = await loadData();
        const apiIndex = apis.findIndex(api => api.id === id);
        
        if (apiIndex === -1) {
            return res.status(404).json({ error: 'API não encontrada' });
        }
        
        const { name, url, category, description, auth, https, cors, usage } = req.body;
        
        // Validações simples
        if (name === "" || url === "") {
            return res.status(400).json({ error: 'Nome e URL não podem ser vazios' });
        }
        
        // Atualiza apenas os campos fornecidos
        if (name !== undefined) apis[apiIndex].name = name;
        if (url !== undefined) apis[apiIndex].url = url;
        if (category !== undefined) apis[apiIndex].category = category;
        if (description !== undefined) apis[apiIndex].description = description;
        if (auth !== undefined) apis[apiIndex].auth = auth;
        if (https !== undefined) apis[apiIndex].https = https;
        if (cors !== undefined) apis[apiIndex].cors = cors;
        if (usage !== undefined) apis[apiIndex].usage = usage;
        
        await saveData(apis);
        
        res.json(apis[apiIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar API' });
    }
});

// DELETE /apis/:id → remove uma API existente
app.delete('/apis/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const apis = await loadData();
        const apiIndex = apis.findIndex(api => api.id === id);
        
        if (apiIndex === -1) {
            return res.status(404).json({ error: 'API não encontrada' });
        }
        
        const deletedApi = apis.splice(apiIndex, 1);
        await saveData(apis);
        
        res.json({ message: 'API removida com sucesso', api: deletedApi[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover API' });
    }
});

// Rota para inicializar com dados padrão
app.post('/apis/init', async (req, res) => {
    try {
        const defaultData = [
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
                    response: `{\n  "valid": true,\n  "message": "CPF válido",\n  "formatted": "123.456.789-09"\n}`
                }
            },
            {
                id: 2,
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
                    response: `[\n  {\n    "userId": 1,\n    "id": 1,\n    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",\n    "body": "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto"\n  }\n]`
                }
            }
        ];
        
        await saveData(defaultData);
        res.json({ message: 'Dados inicializados com sucesso', apis: defaultData });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inicializar dados' });
    }
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
            delete: 'DELETE /apis/:id',
            init: 'POST /apis/init (para restaurar dados padrão)'
        }
    });
});

// Inicia o servidor
app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
    // Verifica se existem dados, se não, inicializa com dados padrão
    try {
        const apis = await loadData();
        if (apis.length === 0) {
            console.log('Nenhum dado encontrado. Inicializando com dados padrão...');
            // Não inicializa automaticamente, apenas informa
            console.log('Execute POST /apis/init para carregar dados padrão');
        } else {
            console.log(`Carregadas ${apis.length} APIs do arquivo de persistência`);
        }
    } catch (error) {
        console.error('Erro ao verificar dados iniciais:', error);
    }
});
