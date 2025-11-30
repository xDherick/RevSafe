// =================================================================================
// LÓGICA DA API
// =================================================================================
const GEMINI_API_KEY = "AIzaSyDZvYL9cIwSx9V7WYNvkdQNdFkZNDrTrJU"; // ATENÇÃO: COLOQUE SUA CHAVE AQUI

// CORREÇÃO: Alterado para 'gemini-1.5-flash', que é o modelo estável mais recente
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function fetchBotResponse(chatHistory, systemPrompt) {
  try {
    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: chatHistory.map((msg) => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.text }],
      })),
    };

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);
      return `[ERRO]: ${response.status} - ${
        errorData?.error?.message ?? "Detalhes desconhecidos"
      }`;
    }

    const data = await response.json();
    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Não foi possível gerar uma resposta.";

    return output;
  } catch (e) {
    console.error("Erro de conexão/parse:", e);
    return "[ERRO]: Falha ao conectar com o Gemini.";
  }
}

// =================================================================================
// LÓGICA PRINCIPAL DA APLICAÇÃO
// =================================================================================

// Lista de Produtos
const PRODUCTS = [
  // --- CELULARES ---
  {
    id: 1,
    title: "iPhone 16 Pro Max",
    price: 9099.0,
    category: "eletronicos",
    rating: 4.9,
    desc: "Tela 6.9'' Super Retina, CPU Raptor, câmera tripla 48MP",
    notes: ["Recall: nenhum"],
    criteria: { seguranca: 9, impacto: 6, eficiencia: 9 },
    shops: [
      { name: "KABUM", price: 9449, url: "#" },
      { name: "MAGALU", price: 10490, url: "#" },
    ],
    image: "images/iphone16pro.png",
  },
  {
    id: 5,
    title: "Samsung Galaxy S24 Ultra",
    price: 8599.0,
    category: "eletronicos",
    rating: 4.8,
    desc: "Titanium, Galaxy AI, Tela 6.8'', 512GB",
    notes: ["Atualizações: 7 anos"],
    criteria: { seguranca: 9, impacto: 8, eficiencia: 8 },
    shops: [
      { name: "SAMSUNG", price: 8999, url: "#" },
      { name: "AMAZON", price: 8599, url: "#" },
    ],
    image: "images/s24ultra.png",
  },
  // --- CONSOLES ---
  {
    id: 2,
    title: "PlayStation 5",
    price: 4099.0,
    category: "eletronicos",
    rating: 4.7,
    desc: "Console, midia física, 825 GB",
    notes: ["Recall: nenhum"],
    criteria: { seguranca: 8, impacto: 5, eficiencia: 8 },
    shops: [
      { name: "AMAZON", price: 4099, url: "#" },
      { name: "KABUM", price: 4298, url: "#" },
    ],
    image: "images/ps5.png",
  },
  {
    id: 6,
    title: "Xbox Series X",
    price: 4199.0,
    category: "eletronicos",
    rating: 4.8,
    desc: "1TB SSD, 12 TFLOPS, 4K Gaming",
    notes: ["Alerta: aquecimento"],
    criteria: { seguranca: 8, impacto: 6, eficiencia: 8 },
    shops: [
      { name: "AMAZON", price: 4199, url: "#" },
      { name: "KABUM", price: 4300, url: "#" },
    ],
    image: "images/xboxseriesx.png",
  },
  // --- NOTEBOOKS ---
  {
    id: 3,
    title: "Samsung Galaxy Book4",
    price: 3509.0,
    category: "computadores",
    rating: 4.2,
    desc: "Notebook 512 GB, i5-1335U",
    notes: ["Recall: driver update 2024"],
    criteria: { seguranca: 8, impacto: 6, eficiencia: 7 },
    shops: [
      { name: "AMAZON", price: 3509, url: "#" },
      { name: "KABUM", price: 3899, url: "#" },
    ],
    image: "images/galaxybook4.png",
  },
  {
    id: 7,
    title: "MacBook Air M2",
    price: 7299.0,
    category: "computadores",
    rating: 4.9,
    desc: "Chip M2, 13.6'', 256GB SSD",
    notes: ["Segurança: Alta"],
    criteria: { seguranca: 10, impacto: 8, eficiencia: 10 },
    shops: [
      { name: "APPLE", price: 8999, url: "#" },
      { name: "AMAZON", price: 7299, url: "#" },
    ],
    image: "images/macbookair.png",
  },
  // --- CASA ---
  {
    id: 4,
    title: "Mallory Air Fryer",
    price: 319.0,
    category: "casa",
    rating: 4.1,
    desc: "Air Fryer 5,5L 1500W",
    notes: ["Alerta: superaquecimento"],
    criteria: { seguranca: 5, impacto: 6, eficiencia: 7 },
    shops: [
      { name: "AMERICANAS", price: 319, url: "#" },
      { name: "AMAZON", price: 335, url: "#" },
    ],
    image: "images/airfryer.png",
  },
  {
    id: 8,
    title: "Philips Walita Essential",
    price: 499.0,
    category: "casa",
    rating: 4.6,
    desc: "4.1L, Tecnologia Rapid Air",
    notes: ["Material: Plástico BPA Free"],
    criteria: { seguranca: 9, impacto: 7, eficiencia: 9 },
    shops: [
      { name: "POLISHOP", price: 599, url: "#" },
      { name: "AMAZON", price: 499, url: "#" },
    ],
    image: "images/philipswalita.png",
  },
];

const ARTICLES = [
  {
    id: 1,
    title: "Como interpretar a nota RevSafe",
    excerpt:
      "Entenda os critérios que compõem a nota: segurança, impacto ambiental e eficiência.",
  },
  {
    id: 2,
    title: "Guia rápido: sinais de review falso",
    excerpt: "5 sinais para identificar avaliações manipuladas.",
  },
];

// Estado da aplicação
let state = {
  user: null,
  q: "",
  filters: { minRating: 0, category: "" },
  compare: [], // IDs dos produtos para comparar
  isLoggedIn: false,
  chatHistory: [],
};

const app = document.getElementById("app");

function getAppShellHTML() {
  return `
    <header class="appbar">
      <div class="logo">RS</div>
      <div style="flex:1">
        <div class="app-title">REV<span style="color:var(--accent-green)">SAFE</span></div>
        <div class="app-sub">Transparência e segurança nas compras</div>
      </div>
      <button id="theme-toggle" class="ghost">
        <span class="material-symbols-outlined">light_mode</span>
      </button>
    </header>
    <main class="content" id="view-root"></main>
    <div class="bottombar" role="navigation">
      <div class="nav-btn" data-route="#/home" id="nav-home"><span class="material-symbols-outlined">home</span></div>
      <div class="nav-btn" data-route="#/search" id="nav-search"><span class="material-symbols-outlined">search</span></div>
      <div class="nav-btn" data-route="#/chat" id="nav-chat"><span class="material-symbols-outlined">chat_bubble</span></div>
      <div class="nav-btn" data-route="#/profile" id="nav-profile"><span class="material-symbols-outlined">settings</span></div>
    </div>
  `;
}

function renderAppShell() {
  app.innerHTML = getAppShellHTML();
  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.addEventListener("click", () => navigate(b.dataset.route));
  });
  setupThemeToggle();
}

function setupThemeToggle() {
  const toggleButton = document.getElementById("theme-toggle");
  const frame = document.getElementById("app");
  if (!toggleButton || !frame) return;
  const icon = toggleButton.querySelector(".material-symbols-outlined");

  const applyTheme = (theme) => {
    frame.dataset.theme = theme;
    icon.textContent = theme === "light" ? "dark_mode" : "light_mode";
    localStorage.setItem("revsafe-theme", theme);
  };
  toggleButton.addEventListener("click", () => {
    const currentTheme = frame.dataset.theme === "light" ? "dark" : "light";
    applyTheme(currentTheme);
  });
  const savedTheme = localStorage.getItem("revsafe-theme") || "dark";
  applyTheme(savedTheme);
}

function updateNav() {
  const navBtns = document.querySelectorAll(".nav-btn");
  const currentHash = location.hash.split("?")[0] || "#/home";
  navBtns.forEach((b) => {
    b.classList.toggle("active", b.dataset.route === currentHash);
  });
}

function navigate(hash) {
  location.hash = hash;
}

function router() {
  const h = location.hash.split("?")[0] || "#/home";
  if (!state.isLoggedIn && h !== "#/login") {
    renderLogin();
    return;
  }
  if (state.isLoggedIn && !app.querySelector("header.appbar")) {
    renderAppShell();
  }

  const viewRoot = document.getElementById("view-root");
  if (!viewRoot && h !== "#/login") return;

  if (h !== "#/login") updateNav();

  if (h.startsWith("#/product/")) renderProduct(Number(h.split("/")[2]));
  else if (h === "#/search") renderSearch();
  else if (h === "#/compare") renderCompare();
  else if (h === "#/articles") renderArticles();
  else if (h === "#/report") renderReport();
  else if (h === "#/chat") renderChat();
  else if (h === "#/profile") renderProfile();
  else if (h === "#/home") renderHome();
  else if (h === "#/login") renderLogin();
  else renderHome();
}

window.addEventListener("hashchange", router);
window.navigate = navigate;

// ---------------------------------------------------------
// NOVA FUNÇÃO: INICIAR COMPARAÇÃO COM IA
// ---------------------------------------------------------
function startAiComparison() {
  const itemsToCompare = state.compare
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  if (itemsToCompare.length < 2) {
    alert("Selecione pelo menos 2 produtos para comparar.");
    return;
  }

  const productNames = itemsToCompare.map((p) => p.title);
  const prompt = `Compare detalhadamente: ${productNames.join(
    " vs "
  )}. Foque em segurança, custo-benefício e impacto ambiental. Qual é a melhor escolha?`;

  state.chatHistory.push({ role: "user", text: prompt });
  navigate("#/chat");
}
window.startAiComparison = startAiComparison;

// --- Render Functions ---

function renderHome() {
  const viewRoot = document.getElementById("view-root");
  viewRoot.innerHTML = `
    <div class="welcome">
      <div class="card">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:64px;height:64px;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center">
             <img src="images/logo.png" alt="Logo RevSafe" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <div>
            <div style="font-weight:800">Olá, ${
              state.user ? state.user.name : "Visitante"
            }</div>
            <div class="muted" style="font-size:13px">Recomendações para você</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="primary" id="btn-explore">Explorar</button>
          <button class="ghost" id="btn-articles">Guias</button>
        </div>
      </div>
      <div class="section">
         <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div class="muted">Alertas</div>
              <div style="font-weight:800">2 novos alertas</div>
            </div>
            <a href="#" class="link">Ver</a>
          </div>
          <div style="margin-top:10px;color:var(--text-muted);font-size:13px">Um de seus favoritos, Mallory Air Fryer, recebeu um alerta.</div>
      </div>
    </div>
    <div style="margin-top:12px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-weight:800">Mais procurados</div>
        <a class="link" href="#/search">Ver tudo</a>
      </div>
      <div class="grid" id="home-grid" style="margin-top:10px"></div>
    </div>
  `;
  document
    .getElementById("btn-explore")
    .addEventListener("click", () => navigate("#/search"));
  document
    .getElementById("btn-articles")
    .addEventListener("click", () => navigate("#/articles"));

  const hg = document.getElementById("home-grid");
  PRODUCTS.slice(0, 3).forEach((p) => {
    const el = document.createElement("div");
    el.className = "product-card";
    el.innerHTML = `
      <div class="thumb"><img src="${p.image}" alt="${p.title}"></div>
      <div class="pd-meta">
        <h3>${p.title}</h3>
        <p class="muted">${p.desc}</p>
        <div class="pd-row">
          <div class="row"><div class="badge">${p.rating.toFixed(
            1
          )}</div><div class="muted" style="margin-left:6px">RevSafe</div></div>
          <div class="right"><button class="primary" onclick="window.navigate('#/product/${
            p.id
          }')">Abrir</button></div>
        </div>
      </div>`;
    hg.appendChild(el);
  });
}

function renderSearch() {
  const viewRoot = document.getElementById("view-root");
  viewRoot.innerHTML = `
    <div>
      <div class="card">
        <div class="search-row">
          <input id="q" placeholder="Buscar..." />
          <button class="ghost" id="btn-clear">Limpar</button>
        </div>
        <div class="chips">
          <div class="chip active" data-cat="">Todos</div>
          <div class="chip" data-cat="eletronicos">Eletrônicos</div>
          <div class="chip" data-cat="computadores">Computadores</div>
          <div class="chip" data-cat="casa">Casa</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center; margin-top:10px;">
          <label class="muted">Nota mínima</label>
          <select id="minRating" style="margin-left:auto; margin-top:0;">
            <option value="0">Todas</option>
            <option value="4">4★+</option>
            <option value="4.5">4.5★+</option>
          </select>
        </div>
      </div>
      <div id="results" class="grid" style="margin-top:12px"></div>
    </div>
  `;

  const q = document.getElementById("q");
  const chips = Array.from(document.querySelectorAll(".chip"));
  const minRating = document.getElementById("minRating");

  function doSearch() {
    const term = q.value.trim().toLowerCase();
    const cat = document.querySelector(".chip.active").dataset.cat;
    const mr = Number(minRating.value);
    const results = PRODUCTS.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (p.rating < mr) return false;
      if (!term) return true;
      return (
        p.title.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term)
      );
    });
    renderResults(results);
  }

  q.addEventListener("input", doSearch);
  document.getElementById("btn-clear").addEventListener("click", () => {
    q.value = "";
    doSearch();
  });
  chips.forEach((c) => {
    c.addEventListener("click", () => {
      chips.forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      doSearch();
    });
  });
  minRating.addEventListener("change", doSearch);
  doSearch();
}

function renderResults(list) {
  const out = document.getElementById("results");
  if (!list || list.length === 0) {
    out.innerHTML = `<div class="card"><div class="muted">Nenhum produto encontrado</div></div>`;
    return;
  }
  out.innerHTML = "";
  list.forEach((p) => {
    const el = document.createElement("div");
    el.className = "product-card";
    // BOTÃO COMPACTO .btn-flashy.small
    el.innerHTML = `
      <div class="thumb"><img src="${p.image}" alt="${p.title}"></div>
      <div class="pd-meta">
        <h3>${p.title}</h3>
        <p class="muted">${p.desc}</p>
        <div class="pd-row">
          <div class="row"><div class="badge">${p.rating.toFixed(
            1
          )}</div><div class="muted" style="margin-left:6px">RevSafe</div></div>
          <div class="right row" style="gap:6px">
            <button class="btn-flashy small" onclick="window.addToCompare(${
              p.id
            })">
              <span class="material-symbols-outlined" style="font-size:18px; vertical-align:middle;">compare_arrows</span>
            </button>
            <button class="primary" onclick="window.navigate('#/product/${
              p.id
            }')">Ver</button>
          </div>
        </div>
      </div>`;
    out.appendChild(el);
  });
}

function renderProduct(id) {
  const viewRoot = document.getElementById("view-root");
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) {
    viewRoot.innerHTML = `<div class="card">Produto não encontrado</div>`;
    return;
  }
  // BOTÃO GRANDE .btn-flashy
  viewRoot.innerHTML = `
    <div class="product-page">
      <div class="card">
        <div style="display:flex;gap:12px">
            <div class="thumb" style="width:100px;height:100px;"><img src="${
              p.image
            }" alt="${p.title}"></div>
            <div class="pd-meta">
                <h3>${p.title}</h3>
                <p class="muted">${p.desc}</p>
                <div class="row" style="gap:6px;margin-top:6px">
                    <div class="badge">${p.rating.toFixed(1)}</div>
                    <div class="muted">RevSafe</div>
                </div>
            </div>
        </div>
      </div>
      <div class="section">
        <h4>Critérios RevSafe</h4>
        <div class="specs">Segurança: ${p.criteria.seguranca}/10</div>
        <div class="specs">Impacto Ambiental: ${p.criteria.impacto}/10</div>
        <div class="specs">Eficiência: ${p.criteria.eficiencia}/10</div>
      </div>
      <div class="section">
        <h4>Lojas & Preços</h4>
        <div class="shops">
          ${p.shops
            .map(
              (s) => `
            <a href="${s.url}" target="_blank" class="shop-link">
              <span class="shop-name">${s.name}</span>
              <span class="shop-price">R$ ${s.price.toFixed(2)}</span>
            </a>
          `
            )
            .join("")}
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px; align-items:center;">
        <button class="btn-flashy" onclick="window.addToCompare(${p.id})">
           <span class="material-symbols-outlined" style="vertical-align:middle; font-size:24px; margin-right:8px;">compare_arrows</span>
           Comparar
        </button>
        <button class="primary" style="flex:1;" onclick="window.reportIssue(${
          p.id
        })">Denunciar</button>
      </div>
    </div>
  `;
}

function addToCompare(id) {
  if (!state.compare.includes(id)) {
    if (state.compare.length >= 2) state.compare.shift(); // Limite de 2 itens
    state.compare.push(id);
  }
  navigate("#/compare");
}
window.addToCompare = addToCompare;

// ---------------------------------------------------------
// RENDER COMPARE (ATUALIZADO)
// ---------------------------------------------------------
function renderCompare() {
  const viewRoot = document.getElementById("view-root");
  const items = state.compare
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  viewRoot.innerHTML = `
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom:12px;">
        <div style="font-weight:800">Comparador</div>
        <div class="muted">${items.length} / 2 selecionados</div>
      </div>
      
      <div class="compare-grid">
        ${/* 1. Renderiza os itens selecionados */ ""}
        ${items
          .map(
            (p) => `
          <div class="compare-card">
            <div class="thumb" style="width:48px;height:48px; margin-bottom:8px;"><img src="${
              p.image
            }" alt="${p.title}"></div>
            <div style="font-weight:800; font-size:14px;">${p.title}</div>
            <div style="margin-top:8px">
              <div class="specs">Segurança: ${p.criteria.seguranca}/10</div>
              <div class="specs">Impacto: ${p.criteria.impacto}/10</div>
              <div class="specs">Eficiência: ${p.criteria.eficiencia}/10</div>
              <div style="margin-top:8px;font-weight:800">R$ ${p.price.toFixed(
                2
              )}</div>
            </div>
            <button class="ghost" style="width:100%; margin-top:8px; font-size:11px;" onclick="removeFromCompare(${
              p.id
            })">Remover</button>
          </div>
        `
          )
          .join("")}
        
        ${/* 2. Slot vazio clicável */ ""}
        ${
          items.length < 2
            ? `
          <div class="empty-card-slot" onclick="navigate('#/search')" title="Clique para adicionar outro produto">
            <span class="material-symbols-outlined" style="font-size:32px; margin-bottom:8px;">add_circle</span>
            <div style="font-size:13px; font-weight:700;">Selecionar mais um item</div>
          </div>
        `
            : ""
        }
      </div>

      <div style="display:flex; flex-direction: column; gap:12px; margin-top:20px">
        
        <button class="btn-flashy" id="btn-compare-ia" style="width:100%; justify-content:center;" 
          ${items.length < 2 ? "disabled" : ""}>
          <span class="material-symbols-outlined" style="margin-right:8px;">smart_toy</span>
          Comparar com IA
        </button>

        <button class="ghost" onclick="state.compare=[];window.navigate('#/search')" style="width:100%;">
          Limpar tudo
        </button>
      </div>
    </div>
  `;

  // Evento
  const btnIa = document.getElementById("btn-compare-ia");
  if (btnIa) {
    btnIa.addEventListener("click", window.startAiComparison);
  }
}

function removeFromCompare(id) {
  state.compare = state.compare.filter((x) => x !== id);
  renderCompare();
}
window.removeFromCompare = removeFromCompare;

function renderArticles() {
  const viewRoot = document.getElementById("view-root");
  viewRoot.innerHTML = `
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom:12px;">
        <div style="font-weight:800">Seção Educativa</div>
        <div class="muted">${ARTICLES.length} artigos</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${ARTICLES.map(
          (a) =>
            `<div class="article"><h4>${a.title}</h4><p class="muted">${a.excerpt}</p></div>`
        ).join("")}
      </div>
    </div>
  `;
}

function renderReport() {
  const viewRoot = document.getElementById("view-root");
  viewRoot.innerHTML = `
    <div>
      <div style="font-weight:800; margin-bottom:12px;">Denúncia</div>
      <div class="card">
        <label>Problema</label>
        <select id="r-type"><option>Propaganda enganosa</option><option>Produto defeituoso</option></select>
        <label>Descrição</label>
        <textarea id="r-desc" rows="4"></textarea>
        <div style="display:flex;gap:8px;margin-top:10px">
           <button class="ghost" onclick="window.navigate('#/home')">Cancelar</button>
           <button class="primary" onclick="window.submitReport()">Enviar</button>
        </div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------
// RENDER CHAT
// ---------------------------------------------------------
async function renderChat() {
  const viewRoot = document.getElementById("view-root");
  viewRoot.innerHTML = `
    <div class="card">
      <h3>Assistente RevSafe</h3>
      <div class="chat-container">
        <div id="chat-window" class="chat-window"></div>
        <div class="chat-input-area">
          <input type="text" id="chat-input" placeholder="Digite sua mensagem..." autocomplete="off">
          <button class="primary" id="chat-send">Enviar</button>
        </div>
      </div>
    </div>
  `;

  const chatWindow = document.getElementById("chat-window");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");
  const systemPrompt = `Você é o "Assistente RevSafe", especialista em consumo seguro. Seja breve, direto e imparcial.`;

  const addMessageToChat = (message, sender) => {
    const el = document.createElement("div");
    el.className = `chat-message ${sender}-message`;
    el.textContent = message;
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  const showTypingIndicator = (show) => {
    let el = document.getElementById("typing-indicator");
    if (show) {
      if (!el) {
        el = document.createElement("div");
        el.id = "typing-indicator";
        el.className = "typing-indicator";
        el.textContent = "Digitando...";
        chatWindow.appendChild(el);
      }
    } else if (el) el.remove();
  };

  const getApiResponse = async () => {
    showTypingIndicator(true);
    const botMessage = await fetchBotResponse(state.chatHistory, systemPrompt);
    state.chatHistory.push({ role: "model", text: botMessage });
    addMessageToChat(botMessage, "bot");
    showTypingIndicator(false);
  };

  const handleSend = () => {
    const msg = chatInput.value.trim();
    if (!msg) return;
    state.chatHistory.push({ role: "user", text: msg });
    addMessageToChat(msg, "user");
    chatInput.value = "";
    getApiResponse();
  };

  chatSend.addEventListener("click", handleSend);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  });

  // Inicializa o chat se vazio
  if (state.chatHistory.length === 0) {
    const initial = "Olá! Como posso ajudar você a comprar com segurança?";
    state.chatHistory.push({ role: "model", text: initial });
  }

  chatWindow.innerHTML = "";
  state.chatHistory.forEach((msg) => {
    const sender = msg.role === "user" ? "user" : "bot";
    addMessageToChat(msg.text, sender);
  });

  // Se a última mensagem for do usuário (vinda do botão Comparar), chama a IA
  const lastMsg = state.chatHistory[state.chatHistory.length - 1];
  if (lastMsg && lastMsg.role === "user") {
    setTimeout(() => {
      getApiResponse();
    }, 500);
  }
}

function renderProfile() {
  const viewRoot = document.getElementById("view-root");
  viewRoot.innerHTML = `
    <div class="card">
      <h3>Minha Conta</h3>
      <label>Nome</label><input type="text" value="${
        state.user ? state.user.name : ""
      }" id="p-name">
      <label>Email</label><input type="email" value="${
        state.user ? state.user.email : ""
      }" id="p-email">
      <button class="primary" id="save-p">Salvar</button>
      <button class="ghost" id="logout" style="margin-top:8px;width:100%">Sair</button>
    </div>`;
  document
    .getElementById("save-p")
    .addEventListener("click", () => alert("Salvo!"));
  document.getElementById("logout").addEventListener("click", logout);
}

// =================================================================
// TELA DE LOGIN ATUALIZADA (IGUAL IMAGEM)
// =================================================================
function renderLogin() {
  app.innerHTML = `
    <main class="login-screen">
      <div class="center">
        <div class="logo">RS</div>
        <h1>RevSafe</h1>
      </div>
      <form id="loginForm" class="login-form">
        <h2>Bem-vindo</h2>
        <p>Entre para continuar</p>
        
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" placeholder="Digite seu e-mail" value="admin@revsafe.com" required>
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" value="1234" required>
        </div>
        
        <button type="submit" class="btn-primary login-btn">Entrar</button>
        
        <p class="register-text">
          Não tem conta?
          <a href="#">Cadastre-se</a>
        </p>
        <p class="msg-erro" id="msgErro"></p>
      </form>
    </main>
  `;

  const form = document.getElementById("loginForm");
  const msgErro = document.getElementById("msgErro");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    if (email === "admin@revsafe.com" && senha === "1234") {
      state.user = { name: "Admin", email: "admin@revsafe.com" };
      state.isLoggedIn = true;
      alert("Login bem-sucedido!");
      navigate("#/home");
      router();
    } else {
      msgErro.textContent = "E-mail ou senha inválidos!";
    }
  });
}

function logout() {
  state.user = null;
  state.isLoggedIn = false;
  state.chatHistory = [];
  navigate("#/login");
  router();
}

function reportIssue(id) {
  navigate("#/report");
}
window.reportIssue = reportIssue;

function submitReport() {
  alert("Enviado (mock)");
  navigate("#/home");
}
window.submitReport = submitReport;

document.addEventListener("DOMContentLoaded", () => {
  const frame = document.getElementById("app");
  const savedTheme = localStorage.getItem("revsafe-theme") || "dark";
  if (frame) frame.dataset.theme = savedTheme;
  router();
});
