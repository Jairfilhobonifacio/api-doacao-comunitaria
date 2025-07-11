# 🤝 API de Doação Comunitária Yourself

## 📋 Sobre o Projeto
A API de Doação Comunitária é uma solução desenvolvida para facilitar a conexão entre doadores e pontos de doação em diferentes cidades. O sistema permite mapear, gerenciar e visualizar pontos de doação, tipos de itens necessários e estatísticas sobre o impacto das doações na comunidade.

### 🎯 Problema
Muitas pessoas querem fazer doações mas não sabem onde doar. Ao mesmo tempo, instituições precisam de doações específicas mas têm dificuldade em comunicar suas necessidades. Existe uma desconexão entre doadores e pontos de doação.

### 💡 Solução
Um sistema centralizado que:
- Mapeia pontos de doação
- Mostra itens mais necessários
- Facilita a localização de pontos próximos
- Fornece estatísticas sobre o impacto das doações

## 🚀 Funcionalidades

### 📊 Dashboard
- Visualização em mapa dos pontos de doação
- Lista detalhada de todos os pontos
- Estatísticas em tempo real
- Gráficos informativos

### 🔍 Filtros e Busca
- Busca por cidade
- Filtros por tipo de doação
- Ordenação por relevância
- Visualização de itens urgentes

### 📈 Estatísticas
- Total de pontos de doação
- Cidades atendidas
- Tipos de doações mais comuns
- Itens mais urgentemente necessitados

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- JavaScript (ES6+)
- Chart.js (para gráficos)
- Leaflet (para mapas)

## 📡 API Endpoints

### Pontos de Doação

#### Listar Todos os Pontos
\`\`\`http
GET /api/pontos
\`\`\`
Retorna todos os pontos de doação cadastrados.

#### Buscar por ID
\`\`\`http
GET /api/pontos/id/:id
\`\`\`
Retorna um ponto de doação específico.

#### Buscar por Cidade
\`\`\`http
GET /api/pontos/cidade/:nome
\`\`\`
Retorna todos os pontos de uma cidade.

#### Listar Necessidades
\`\`\`http
GET /api/pontos/necessidades
\`\`\`
Retorna lista de itens necessários.

#### Criar Novo Ponto
\`\`\`http
POST /api/pontos
\`\`\`
Cria um novo ponto de doação.

Exemplo de corpo da requisição:
\`\`\`json
{
    "nome": "Centro de Doações",
    "cidade": "São Paulo",
    "endereco": "Rua Example, 123",
    "tipoDoacoes": ["Roupas", "Alimentos"],
    "itensUrgentes": ["Cobertores", "Arroz"],
    "horarioAbertura": "08:00",
    "horarioFechamento": "18:00",
    "telefone": "(11) 1234-5678"
}
\`\`\`

#### Atualizar Ponto
\`\`\`http
PUT /api/pontos/:id
\`\`\`
Atualiza um ponto existente.

#### Excluir Ponto
\`\`\`http
DELETE /api/pontos/:id
\`\`\`
Remove um ponto de doação.

## 🚀 Como Executar

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/jair/api-doacao-comunitaria.git
\`\`\`

2. Instale as dependências:
\`\`\`bash
cd api-doacao-comunitaria
npm install
\`\`\`

3. Execute o servidor:
\`\`\`bash
npm start
\`\`\`

4. Acesse no navegador:
\`\`\`
http://localhost:3000
\`\`\`

## 📦 Estrutura do Projeto

\`\`\`
api-doacao-comunitaria/
├── src/
│   ├── controllers/    # Controladores da aplicação
│   ├── models/         # Modelos de dados
│   ├── routes/         # Rotas da API
│   ├── data/          # Armazenamento de dados
│   └── config/        # Configurações
├── public/            # Arquivos estáticos
│   ├── index.html
│   ├── style.css
│   └── script.js
└── package.json
\`\`\`

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

Jair Filho 

## 🙏 Agradecimentos


- Comunidade de desenvolvedores por todo o suporte
- Todos os contribuidores que ajudaram no desenvolvimento

---
⌨️ com ❤️ por [Jair filho] https://github.com/Jairfilhobonifacio 😊 
