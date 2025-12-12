// app.js: Lógica do Site e Modo Editor (CMS Offline) - Versão 4.0 (Catálogo)
const app = {};

// Variáveis de Configuração
const DEFAULT_PIN = "1234";
const LOCAL_STORAGE_KEY = "DeolindaCMSContent";

// --- Dados Padrão ---
const defaultContent = {
    siteTitle: "Deolinda Software | Gestão Simples e Offline",
    headerTitulo: "Deolinda Software",
    headerSubtitulo: "A Gestão que Simplifica. 100% Offline. Sem Mensalidades.",
    historiaImgSrc: "https://via.placeholder.com/300x400/A0D2EB/FFFFFF?text=Foto+Marca+Deolinda",
    historiaParagrafo1: "A marca **Deolinda** é uma homenagem de amor, um pilar de valores e um compromisso de simplicidade. Deolinda era o nome da minha avó. O seu legado de respeito e simplicidade é o que nos guia.",
    historiaParagrafo2: "Hoje, honramos esse legado aplicando os mesmos princípios aos nossos programas de gestão: Genuíno, Confiável e **100% Offline**. Chega de subscrições, internet e complexidade desnecessária.",
    gumroadLink: "https://deolinda.gumroad.com/", // Seu link real
    tiktokLink: "https://tiktok.com/@seutiktok",
    instagramLink: "https://instagram.com/sua_conta",
    githubLink: "https://github.com/Deolinda007", // Seu link real
    
    // NOVO: Array de objetos para a listagem dos programas
    programList: [
        { title: 'Agenda Salão (O Seu Produto Principal)', desc: 'Gestão completa de marcações, clientes e serviços para cabeleireiros e estética. Invista uma só vez!' },
        { title: 'Deolinda Faturação Simples', desc: 'Emissão de faturas simplificadas e recibos, sem precisar de internet. Ideal para microempresas.' },
        { title: 'Controlo de Stock Offline', desc: 'Mantenha o inventário atualizado sem depender de servidores externos ou mensalidades.' }
    ],
};

// --- Funções de Gestão de Conteúdo (CMS) ---

app.loadContent = function() {
    let content = defaultContent;
    try {
        const storedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedContent) {
            content = { ...defaultContent, ...JSON.parse(storedContent) };
        }
    } catch (e) {
        console.error("Erro ao carregar do Local Storage:", e);
    }
    return content;
};

app.saveContent = function() {
    // 1. Recolhe dados estáticos
    const newContent = {
        siteTitle: document.getElementById('input-site-title').value,
        headerTitulo: document.getElementById('input-header-titulo').value,
        headerSubtitulo: document.getElementById('input-header-subtitulo').value,
        historiaImgSrc: document.getElementById('input-historia-imagem-src').value,
        historiaParagrafo1: document.getElementById('input-historia-paragrafo-1').value,
        historiaParagrafo2: document.getElementById('input-historia-paragrafo-2').value,
        gumroadLink: document.getElementById('input-gumroad-link').value,
        tiktokLink: document.getElementById('input-tiktok-link').value,
        instagramLink: document.getElementById('input-instagram-link').value,
        githubLink: document.getElementById('input-github-link').value,
        programList: [], 
    };
    
    // 2. Recolhe dados dos programas
    const programItems = document.querySelectorAll('#program-list-container-editor .editor-program-item');
    programItems.forEach(item => {
        newContent.programList.push({
            title: item.querySelector('.program-title').value,
            desc: item.querySelector('.program-desc').value,
        });
    });

    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newContent));
        app.renderContent(newContent); // Atualiza o site visível
        alert('Conteúdo guardado e site atualizado com sucesso!');
    } catch (e) {
        alert('Erro ao guardar no Local Storage. Verifique se o seu browser o permite.');
        console.error("Erro ao guardar no Local Storage:", e);
    }
};

// Renderiza o conteúdo no site visível
app.renderContent = function(content) {
    document.getElementById('site-title').textContent = content.siteTitle;
    document.getElementById('header-titulo').textContent = content.headerTitulo;
    document.getElementById('header-subtitulo').textContent = content.headerSubtitulo;
    
    document.getElementById('historia-imagem-src').src = content.historiaImgSrc;
    document.getElementById('historia-paragrafo-1').innerHTML = content.historiaParagrafo1;
    document.getElementById('historia-paragrafo-2').innerHTML = content.historiaParagrafo2;

    document.getElementById('cta-gumroad-link-1').href = content.gumroadLink;
    document.getElementById('cta-gumroad-link-2').href = content.gumroadLink;
    
    document.getElementById('tiktok-link').href = content.tiktokLink;
    document.getElementById('instagram-link').href = content.instagramLink;
    document.getElementById('github-link-footer').href = content.githubLink;
    
    // NOVO: Geração do HTML da lista de programas
    let programsHTML = content.programList.map(item => {
        return `
            <div class="program-item">
                <i class="fa-solid fa-check-circle" style="color: var(--cor-principal); font-size: 20px; margin-right: 15px;"></i>
                <div class="program-details">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
                <a href="${content.gumroadLink}" target="_blank" class="botao-pequeno">Ver e Comprar</a>
            </div>
        `;
    }).join('');

    document.getElementById('program-list-container').innerHTML = programsHTML;
    
    document.getElementById('ano-atual').textContent = new Date().getFullYear();
};

// --- Funções do Editor (Novo Sistema de Lista) ---

app.renderEditorProgramList = function(content) {
    const container = document.getElementById('program-list-container-editor');
    container.innerHTML = ''; // Limpa antes de renderizar

    const template = document.getElementById('program-item-template');

    content.programList.forEach(item => {
        const clone = template.content.cloneNode(true);
        const itemDiv = clone.querySelector('.editor-program-item');
        
        // Preenche os valores
        itemDiv.querySelector('.program-title').value = item.title;
        itemDiv.querySelector('.program-desc').value = item.desc;
        
        container.appendChild(itemDiv);
    });
};

app.addProgramItem = function() {
    const container = document.getElementById('program-list-container-editor');
    const template = document.getElementById('program-item-template');
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);
};

app.removeProgramItem = function(button) {
    if (confirm('Tem a certeza que quer remover este programa do catálogo?')) {
        button.closest('.editor-program-item').remove();
    }
};

// --- Funções de Acesso ao Editor (Mantidas) ---

app.initEditor = function() {
    const pin = document.getElementById('editor-pin').value;
    if (pin === DEFAULT_PIN) {
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('editor-content-area').style.display = 'block';
        
        const content = app.loadContent();
        
        // Carrega dados estáticos para os inputs
        document.getElementById('input-site-title').value = content.siteTitle;
        document.getElementById('input-header-titulo').value = content.headerTitulo;
        document.getElementById('input-header-subtitulo').value = content.headerSubtitulo;
        document.getElementById('input-historia-imagem-src').value = content.historiaImgSrc;
        document.getElementById('input-historia-paragrafo-1').value = content.historiaParagrafo1;
        document.getElementById('input-historia-paragrafo-2').value = content.historiaParagrafo2;
        document.getElementById('input-gumroad-link').value = content.gumroadLink;
        document.getElementById('input-tiktok-link').value = content.tiktokLink;
        document.getElementById('input-instagram-link').value = content.instagramLink;
        document.getElementById('input-github-link').value = content.githubLink;
        
        // Renderiza a lista de programas
        app.renderEditorProgramList(content);

    } else {
        alert('PIN Incorreto. Tente novamente.');
    }
};

app.logoutEditor = function() {
    document.getElementById('editor-mode').classList.remove('active');
    document.getElementById('editor-pin').value = '';
    document.getElementById('login-area').style.display = 'block';
    document.getElementById('editor-content-area').style.display = 'none';
};


// --- Inicialização ---

document.addEventListener('DOMContentLoaded', () => {
    const initialContent = app.loadContent();
    app.renderContent(initialContent);

    document.getElementById('editor-pin-toggler').addEventListener('click', () => {
        document.getElementById('editor-mode').classList.add('active');
    });
});