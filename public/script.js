// public/script.js

// Configuração da API
const API_URL = 'http://localhost:3000/api/pontos';

// Estado da aplicação
let pontosDeDoacaoState = [];
let filtrosAtivos = new Set();
let temaEscuro = false;
let mapaInicializado = false;
let mapa = null;
let marcadores = [];
let viewAtual = 'lista';

// Elementos do DOM
const formContainer = document.querySelector('.form-container');
const resultadoContainer = document.querySelector('.resultado-container');
const searchInput = document.querySelector('#searchInput');
const addPointBtn = document.getElementById('add-point-btn');
const cancelFormBtn = document.getElementById('cancel-form');
const saveFormBtn = document.getElementById('save-form');
const filterButtons = document.querySelectorAll('.filter-btn');
const donationForm = document.getElementById('donation-form');
const loadingOverlay = document.querySelector('.loading-overlay');
const themeToggle = document.getElementById('theme-toggle');
const filterToggle = document.querySelector('.filter-toggle');
const filtersExpandable = document.querySelector('.filters-expandable');
const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');
const sortButtons = document.querySelectorAll('.sort-btn');

// Estatísticas
const totalPontosEl = document.getElementById('total-pontos');
const totalCidadesEl = document.getElementById('total-cidades');
const totalDoacoesEl = document.getElementById('total-doacoes');

// Elementos do DOM para a página inicial
const totalPontosInicio = document.getElementById('total-pontos-inicio');
const totalCidadesInicio = document.getElementById('total-cidades-inicio');
const totalDoacoesInicio = document.getElementById('total-doacoes-inicio');

// Gráficos
let doacoesPorCategoriaChart = null;
let pontosPorCidadeChart = null;
let itensMaisUrgentesChart = null;

// Funções de Loading
function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Funções de API
async function carregarPontos() {
    try {
        showLoading();
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar pontos de doação: ${response.statusText}`);
        }
        
        const pontos = await response.json();
        pontosDeDoacaoState = pontos;
        
        console.log('Dados carregados com sucesso:', pontosDeDoacaoState);
        
        atualizarResultados();
        atualizarEstatisticas();
        atualizarMapa();
        atualizarGraficos();
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao('Erro ao carregar pontos de doação: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function adicionarPonto(novoPonto) {
    try {
        showLoading();
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoPonto)
        });
        
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro ao adicionar ponto de doação');
        }
        
        const pontoAdicionado = await response.json();
        pontosDeDoacaoState.push(pontoAdicionado);
        
        atualizarResultados();
        atualizarEstatisticas();
        atualizarGraficos();
        
        mostrarNotificacao('Ponto de doação adicionado com sucesso!', 'success');
        return true;
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao(error.message, 'error');
        return false;
    } finally {
        hideLoading();
    }
}

async function atualizarPonto(id, dadosAtualizados) {
    try {
        showLoading();
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizados)
        });
        
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro ao atualizar ponto de doação');
        }
        
        const pontoAtualizado = await response.json();
        const index = pontosDeDoacaoState.findIndex(p => p.id === id);
        pontosDeDoacaoState[index] = pontoAtualizado;
        
        atualizarResultados();
        atualizarEstatisticas();
        atualizarGraficos();
        
        mostrarNotificacao('Ponto de doação atualizado com sucesso!', 'success');
        return true;
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao(error.message, 'error');
        return false;
    } finally {
        hideLoading();
    }
}

async function removerPonto(id) {
    try {
        showLoading();
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro ao excluir ponto de doação');
        }
        
        pontosDeDoacaoState = pontosDeDoacaoState.filter(p => p.id !== id);
        
        atualizarResultados();
        atualizarEstatisticas();
        atualizarGraficos();
        
        mostrarNotificacao('Ponto de doação excluído com sucesso!', 'success');
        return true;
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao(error.message, 'error');
        return false;
    } finally {
        hideLoading();
    }
}

async function buscarPorCidade(cidade) {
    try {
        showLoading();
        const response = await fetch(`${API_URL}/cidade/${encodeURIComponent(cidade)}`);
        
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro ao buscar pontos por cidade');
        }
        
        const pontos = await response.json();
        pontosDeDoacaoState = pontos;
        
        atualizarResultados();
        atualizarEstatisticas();
        atualizarGraficos();
    } catch (error) {
        console.error('Erro:', error);
        mostrarNotificacao(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Funções auxiliares
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function mostrarNotificacao(mensagem, tipo = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.textContent = mensagem;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Manipulação do formulário
function mostrarFormulario() {
    formContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function ocultarFormulario() {
    formContainer.classList.remove('active');
    document.body.style.overflow = 'auto';
    donationForm.reset();
}

// Estatísticas
function atualizarEstatisticas() {
    // Atualizar estatísticas gerais
    const totalPontos = pontosDeDoacaoState.length;
    const cidadesUnicas = new Set(pontosDeDoacaoState.map(p => p.cidade)).size;
    const tiposDoacaoUnicos = new Set(
        pontosDeDoacaoState.flatMap(p => p.tipoDoacoes || [])
    ).size;

    // Atualizar na view de lista
    if (totalPontosEl) {
        totalPontosEl.textContent = totalPontos;
    }
    
    if (totalCidadesEl) {
        totalCidadesEl.textContent = cidadesUnicas;
    }
    
    if (totalDoacoesEl) {
        totalDoacoesEl.textContent = tiposDoacaoUnicos;
    }

    // Atualizar na página inicial
    if (totalPontosInicio) {
        totalPontosInicio.textContent = totalPontos;
    }
    
    if (totalCidadesInicio) {
        totalCidadesInicio.textContent = cidadesUnicas;
    }
    
    if (totalDoacoesInicio) {
        totalDoacoesInicio.textContent = tiposDoacaoUnicos;
    }

    // Animação dos números
    [totalPontosEl, totalCidadesEl, totalDoacoesEl, 
     totalPontosInicio, totalCidadesInicio, totalDoacoesInicio].forEach(el => {
        if (el) {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = 'countUp 1s ease-out forwards';
        }
    });
}

// Renderização
function renderizarResultados(pontos) {
    if (!resultadoContainer) return;
    
    resultadoContainer.innerHTML = '';
    
    if (pontos.length === 0) {
        resultadoContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>Nenhum ponto de doação encontrado</p>
            </div>
        `;
        return;
    }
    
    pontos.forEach(ponto => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${ponto.nome}</h3>
                <div class="card-actions">
                    <button class="btn-icon" onclick="editarPonto('${ponto.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="excluirPonto('${ponto.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-info">
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${ponto.endereco}, ${ponto.cidade}</span>
                </div>
                ${ponto.horarioAbertura && ponto.horarioFechamento ? `
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${ponto.horarioAbertura} - ${ponto.horarioFechamento}</span>
                    </div>
                ` : ''}
                ${ponto.telefone ? `
                    <div class="info-item">
                        <i class="fas fa-phone"></i>
                        <span>${ponto.telefone}</span>
                    </div>
                ` : ''}
            </div>
            ${ponto.tipoDoacoes?.length > 0 ? `
                <div class="tags">
                    ${ponto.tipoDoacoes.map(tipo => `
                        <span class="tag">
                            <i class="fas ${getTipoIcon(tipo)}"></i>
                            ${tipo}
                        </span>
                    `).join('')}
                </div>
            ` : ''}
            ${ponto.itensUrgentes?.length > 0 ? `
                <div class="tags">
                    ${ponto.itensUrgentes.map(item => `
                        <span class="tag urgent">
                            <i class="fas fa-exclamation-circle"></i>
                            ${item}
                        </span>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        resultadoContainer.appendChild(card);
    });
}

function getTipoIcon(tipo) {
    const icons = {
        'Roupas': 'fa-tshirt',
        'Alimentos': 'fa-utensils',
        'Móveis': 'fa-couch',
        'Eletrônicos': 'fa-laptop',
        'Brinquedos': 'fa-gamepad'
    };
    return icons[tipo] || 'fa-box';
}

function atualizarResultados() {
    const termoPesquisa = searchInput?.value.toLowerCase() || '';
    
    const resultadosFiltrados = pontosDeDoacaoState.filter(ponto => {
        const matchPesquisa = ponto.nome.toLowerCase().includes(termoPesquisa) ||
                            ponto.cidade.toLowerCase().includes(termoPesquisa) ||
                            ponto.endereco.toLowerCase().includes(termoPesquisa);
        
        if (!matchPesquisa) return false;
        
        if (filtrosAtivos.size === 0) return true;
        
        return (ponto.tipoDoacoes || []).some(tipo => filtrosAtivos.has(tipo));
    });
    
    renderizarResultados(resultadosFiltrados);
    atualizarEstatisticas();
    atualizarMapa();
}

// Manipulação do tema
function toggleTema() {
    temaEscuro = !temaEscuro;
    document.body.classList.toggle('dark-theme');
    themeToggle.innerHTML = temaEscuro ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('tema', temaEscuro ? 'dark' : 'light');
}

// Manipulação dos pontos de doação
async function editarPonto(id) {
    const ponto = pontosDeDoacaoState.find(p => p.id === id);
    if (!ponto) return;
    
    const form = document.getElementById('donation-form');
    form.elements['nome'].value = ponto.nome;
    form.elements['cidade'].value = ponto.cidade;
    form.elements['endereco'].value = ponto.endereco;
    form.elements['horario-abertura'].value = ponto.horarioAbertura || '';
    form.elements['horario-fechamento'].value = ponto.horarioFechamento || '';
    form.elements['telefone'].value = ponto.telefone || '';
    
    // Marcar os tipos de doação
    const tiposDoacaoInputs = form.querySelectorAll('input[name="tipos-doacao"]');
    tiposDoacaoInputs.forEach(input => {
        input.checked = (ponto.tipoDoacoes || []).includes(input.value);
    });
    
    form.elements['itens-urgentes'].value = (ponto.itensUrgentes || []).join(', ');
    
    // Mostrar o formulário
    mostrarFormulario();
    
    // Atualizar o comportamento do formulário
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const dadosAtualizados = {
            nome: formData.get('nome'),
            cidade: formData.get('cidade'),
            endereco: formData.get('endereco'),
            horarioAbertura: formData.get('horario-abertura'),
            horarioFechamento: formData.get('horario-fechamento'),
            telefone: formData.get('telefone'),
            tipoDoacoes: Array.from(formData.getAll('tipos-doacao')),
            itensUrgentes: formData.get('itens-urgentes').split(',').map(item => item.trim()).filter(Boolean)
        };
        
        const sucesso = await atualizarPonto(id, dadosAtualizados);
        if (sucesso) {
            form.reset();
            ocultarFormulario();
        }
    };
}

async function excluirPonto(id) {
    if (confirm('Tem certeza que deseja excluir este ponto de doação?')) {
        await removerPonto(id);
    }
}

// Manipulação do formulário
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(donationForm);
    const tiposDoacao = Array.from(formData.getAll('tipos-doacao'));
    
    if (tiposDoacao.length === 0) {
        mostrarNotificacao('Selecione pelo menos um tipo de doação', 'error');
        return;
    }
    
    const novoPonto = {
        nome: formData.get('nome'),
        cidade: formData.get('cidade'),
        endereco: formData.get('endereco'),
        horarioAbertura: formData.get('horario-abertura'),
        horarioFechamento: formData.get('horario-fechamento'),
        telefone: formData.get('telefone'),
        tipoDoacoes: tiposDoacao,
        itensUrgentes: formData.get('itens-urgentes').split(',').map(item => item.trim()).filter(Boolean)
    };
    
    const sucesso = await adicionarPonto(novoPonto);
    if (sucesso) {
        donationForm.reset();
        ocultarFormulario();
    }
}

// Event Listeners
addPointBtn.addEventListener('click', mostrarFormulario);
cancelFormBtn.addEventListener('click', ocultarFormulario);
donationForm.addEventListener('submit', handleFormSubmit);
themeToggle.addEventListener('click', toggleTema);

searchInput.addEventListener('input', debounce(() => {
    if (searchInput.value.length >= 3) {
        buscarPorCidade(searchInput.value);
    } else if (searchInput.value.length === 0) {
        carregarPontos();
    }
}, 300));

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        const filtro = button.getAttribute('data-filter');
        
        if (filtro === 'todos') {
            filtrosAtivos.clear();
            filterButtons.forEach(btn => {
                if (btn !== button) btn.classList.remove('active');
            });
        } else {
            const todosBtn = document.querySelector('.filter-btn[data-filter="todos"]');
            todosBtn.classList.remove('active');
            
            if (filtrosAtivos.has(filtro)) {
                filtrosAtivos.delete(filtro);
            } else {
                filtrosAtivos.add(filtro);
            }
        }
        
        atualizarResultados();
    });
});

// Fechar formulário ao clicar fora
formContainer.addEventListener('click', (e) => {
    if (e.target === formContainer) {
        ocultarFormulario();
    }
});

// Funções de Mapa
function inicializarMapa() {
    try {
        if (mapaInicializado) return;
        
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Elemento do mapa não encontrado');
            return;
        }

        mapa = L.map('map').setView([-23.5505, -46.6333], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapa);
        
        mapaInicializado = true;
        console.log('Mapa inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
        mapaInicializado = false;
    }
}

function atualizarMapa() {
    try {
        if (!mapaInicializado) {
            inicializarMapa();
        }
        
        if (!mapa) {
            console.error('Mapa não está disponível');
            return;
        }

        // Limpar marcadores existentes
        marcadores.forEach(marcador => marcador.remove());
        marcadores = [];
        
        // Adicionar novos marcadores
        pontosDeDoacaoState.forEach(ponto => {
            try {
                // Aqui você precisaria ter as coordenadas do ponto
                // Por enquanto, vamos usar coordenadas aleatórias para demonstração
                const lat = -23.5505 + (Math.random() - 0.5) * 0.1;
                const lng = -46.6333 + (Math.random() - 0.5) * 0.1;
                
                const marcador = L.marker([lat, lng])
                    .bindPopup(`
                        <h3>${ponto.nome}</h3>
                        <p><i class="fas fa-map-marker-alt"></i> ${ponto.endereco}, ${ponto.cidade}</p>
                        <p><i class="fas fa-clock"></i> ${ponto.horarioAbertura || ''} - ${ponto.horarioFechamento || ''}</p>
                        <p><i class="fas fa-phone"></i> ${ponto.telefone || 'Não informado'}</p>
                    `)
                    .addTo(mapa);
                
                marcadores.push(marcador);
            } catch (err) {
                console.error('Erro ao adicionar marcador:', err);
            }
        });
        
        // Ajustar visualização para mostrar todos os marcadores
        if (marcadores.length > 0) {
            const grupo = L.featureGroup(marcadores);
            mapa.fitBounds(grupo.getBounds().pad(0.1));
        }
        
        console.log('Mapa atualizado com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar o mapa:', error);
    }
}

// Funções de Gráficos
function inicializarGraficos() {
    console.log('Inicializando gráficos...');
    
    // Configurações comuns
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.color = temaEscuro ? '#E9ECEF' : '#2C3E50';
    
    const ctx1 = document.getElementById('doacoesPorCategoria')?.getContext('2d');
    const ctx2 = document.getElementById('pontosPorCidade')?.getContext('2d');
    const ctx3 = document.getElementById('itensMaisUrgentes')?.getContext('2d');
    
    if (ctx1) {
        console.log('Inicializando gráfico de doações por categoria');
        doacoesPorCategoriaChart = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#4A90E2', // Azul
                        '#2ECC71', // Verde
                        '#E74C3C', // Vermelho
                        '#F1C40F', // Amarelo
                        '#9B59B6'  // Roxo
                    ],
                    borderWidth: 2,
                    borderColor: temaEscuro ? '#16213E' : '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Tipos de Doação',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }
    
    if (ctx2) {
        console.log('Inicializando gráfico de pontos por cidade');
        pontosPorCidadeChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Pontos de Doação',
                    data: [],
                    backgroundColor: '#4A90E2',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Top 10 Cidades com Mais Pontos de Doação',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    if (ctx3) {
        console.log('Inicializando gráfico de itens mais urgentes');
        itensMaisUrgentesChart = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Quantidade de Solicitações',
                    data: [],
                    backgroundColor: '#E74C3C',
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Top 10 Itens Mais Urgentes',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

function atualizarGraficos() {
    console.log('Atualizando gráficos com dados:', pontosDeDoacaoState);

    if (!doacoesPorCategoriaChart || !pontosPorCidadeChart || !itensMaisUrgentesChart) {
        console.log('Inicializando gráficos primeiro...');
        inicializarGraficos();
    }

    // Doações por Categoria
    if (doacoesPorCategoriaChart) {
        const categorias = {};
        pontosDeDoacaoState.forEach(ponto => {
            (ponto.tipoDoacoes || []).forEach(tipo => {
                categorias[tipo] = (categorias[tipo] || 0) + 1;
            });
        });

        doacoesPorCategoriaChart.data.labels = Object.keys(categorias);
        doacoesPorCategoriaChart.data.datasets[0].data = Object.values(categorias);
        doacoesPorCategoriaChart.update();
        console.log('Gráfico de categorias atualizado:', categorias);
    }

    // Pontos por Cidade
    if (pontosPorCidadeChart) {
        const cidades = {};
        pontosDeDoacaoState.forEach(ponto => {
            cidades[ponto.cidade] = (cidades[ponto.cidade] || 0) + 1;
        });

        // Ordenar por quantidade e pegar top 10
        const cidadesOrdenadas = Object.entries(cidades)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        pontosPorCidadeChart.data.labels = cidadesOrdenadas.map(([cidade]) => cidade);
        pontosPorCidadeChart.data.datasets[0].data = cidadesOrdenadas.map(([,count]) => count);
        pontosPorCidadeChart.update();
        console.log('Gráfico de cidades atualizado:', cidadesOrdenadas);
    }

    // Itens Mais Urgentes
    if (itensMaisUrgentesChart) {
        const itensUrgentes = {};
        pontosDeDoacaoState.forEach(ponto => {
            (ponto.itensUrgentes || []).forEach(item => {
                itensUrgentes[item] = (itensUrgentes[item] || 0) + 1;
            });
        });

        // Ordenar por quantidade e pegar top 10
        const itensOrdenados = Object.entries(itensUrgentes)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        itensMaisUrgentesChart.data.labels = itensOrdenados.map(([item]) => item);
        itensMaisUrgentesChart.data.datasets[0].data = itensOrdenados.map(([,count]) => count);
        itensMaisUrgentesChart.update();
        console.log('Gráfico de itens urgentes atualizado:', itensOrdenados);
    }
}

// Funções de UI
function toggleFiltros() {
    filtersExpandable.classList.toggle('expanded');
    const contagem = filtrosAtivos.size;
    document.querySelector('.filter-count').textContent = contagem;
}

function trocarVisualizacao(viewId) {
    console.log('Trocando para visualização:', viewId);
    
    // Atualizar estado
    viewAtual = viewId;
    
    // Remover classe active de todas as views e botões
    views.forEach(view => {
        view.classList.remove('active');
    });
    
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Ativar view e botão correspondentes
    const viewElement = document.getElementById(`${viewId}-view`);
    const btnElement = document.querySelector(`.nav-btn[data-view="${viewId}"]`);

    if (!viewElement) {
        console.error(`View não encontrada: ${viewId}-view`);
        return;
    }

    if (!btnElement) {
        console.error(`Botão de navegação não encontrado para: ${viewId}`);
        return;
    }

    viewElement.classList.add('active');
    btnElement.classList.add('active');

    // Ações específicas para cada view
    switch (viewId) {
        case 'inicio':
            atualizarEstatisticas();
            break;
            
        case 'mapa':
            if (!mapaInicializado) {
                inicializarMapa();
            }
            atualizarMapa();
            break;
            
        case 'lista':
            atualizarResultados();
            atualizarEstatisticas();
            break;
            
        case 'estatisticas':
            console.log('Atualizando view de estatísticas...');
            inicializarGraficos();
            atualizarGraficos();
            break;
    }
}

function ordenarResultados(criterio) {
    const resultados = [...pontosDeDoacaoState];
    
    switch (criterio) {
        case 'relevancia':
            // Ordenar por quantidade de tipos de doação
            resultados.sort((a, b) => (b.tipoDoacoes?.length || 0) - (a.tipoDoacoes?.length || 0));
            break;
        case 'distancia':
            // Implementar ordenação por distância quando tivermos geolocalização
            break;
        case 'recentes':
            // Ordenar por data de cadastro (assumindo que temos um campo createdAt)
            resultados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }
    
    pontosDeDoacaoState = resultados;
    atualizarResultados();
}

// Event Listeners
filterToggle?.addEventListener('click', toggleFiltros);

navButtons?.forEach(btn => {
    btn.addEventListener('click', () => {
        trocarVisualizacao(btn.getAttribute('data-view'));
    });
});

sortButtons?.forEach(btn => {
    btn.addEventListener('click', () => {
        sortButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ordenarResultados(btn.getAttribute('data-sort'));
    });
});

// Navegação
function inicializarNavegacao() {
    const navButtons = document.querySelectorAll('.nav-btn');
    console.log('Botões de navegação encontrados:', navButtons.length);

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const view = btn.getAttribute('data-view');
            console.log('Clique no botão de navegação:', view);
            trocarVisualizacao(view);
        });
    });
}

// Event Listeners e Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM carregado, inicializando aplicação...');

    // Inicializar navegação
    inicializarNavegacao();

    // Carregar tema salvo
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'dark') {
        document.body.classList.add('dark-theme');
        temaEscuro = true;
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    try {
        // Carregar pontos de doação
        await carregarPontos();
        
        // Inicializar view atual (agora começando com a página inicial)
        const viewInicial = 'inicio';
        trocarVisualizacao(viewInicial);
        
    } catch (error) {
        console.error('Erro na inicialização:', error);
        mostrarNotificacao('Erro ao carregar dados iniciais', 'error');
    }
});
