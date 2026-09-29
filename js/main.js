/**
 * HIDROSOL ENGENHARIA - Scripts Interativos & Lógica de UI
 * "Água para todos, soluções inteligentes."
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAnimatedCounters();
  initScrollAnimations();
  initVideoModal();
  initEconomyCalculator();
  initSolutionModals();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. Navegação & Header Fixo
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('main-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Efeito de rolagem no header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md', 'bg-white/95');
      navbar.classList.remove('bg-white');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/95');
      navbar.classList.add('bg-white');
    }
  });

  // Toggle Menu Mobile
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Fechar ao clicar em qualquer link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

/* ==========================================================================
   2. Contadores Animados (Métricas de Desempenho)
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-value');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 2000; // 2 segundos
          const start = 0;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing suave cubic-bezier
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(easeOutQuart * target);

            counter.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = `${prefix}${target}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.35 });

  const metricsSection = document.getElementById('metricas');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==========================================================================
   3. Animações de Scroll (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. Modal do Vídeo Institucional
   ========================================================================== */
function initVideoModal() {
  const openBtns = document.querySelectorAll('.open-video-btn');
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('close-video-modal');
  const videoPlayer = document.getElementById('institutional-video');

  if (!modal || !videoPlayer) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      videoPlayer.currentTime = 0;
      videoPlayer.play().catch(err => console.log("Autoplay bloqueado pelo navegador:", err));
    });
  });

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    videoPlayer.pause();
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. Simulador B2B de Economia Hídrica
   ========================================================================== */
function initEconomyCalculator() {
  const invoiceSlider = document.getElementById('calc-fatura');
  const invoiceDisplay = document.getElementById('calc-fatura-val');
  const segmentSelect = document.getElementById('calc-segmento');
  const resultEconomiaMensal = document.getElementById('calc-res-mensal');
  const resultEconomiaAnual = document.getElementById('calc-res-anual');
  const resultReducaoPerdas = document.getElementById('calc-res-perdas');

  if (!invoiceSlider || !invoiceDisplay) return;

  function calculate() {
    const invoice = parseFloat(invoiceSlider.value);
    const segment = segmentSelect ? segmentSelect.value : 'industria';

    // Percentual de redução estimado conforme segmento
    let reductionFactor = 0.40; // 40% média padrão
    if (segment === 'agro') reductionFactor = 0.38;
    if (segment === 'publico') reductionFactor = 0.45;
    if (segment === 'predial') reductionFactor = 0.35;

    const monthlySavings = invoice * reductionFactor;
    const yearlySavings = monthlySavings * 12;
    const lossReduction = Math.round(invoice * 0.37 / 10); // Estimativa de m³ preservados

    // Formatação monetária BRL
    invoiceDisplay.textContent = invoice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    resultEconomiaMensal.textContent = monthlySavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    resultEconomiaAnual.textContent = yearlySavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    resultReducaoPerdas.textContent = `+${lossReduction.toLocaleString('pt-BR')} m³/mês`;
  }

  invoiceSlider.addEventListener('input', calculate);
  if (segmentSelect) segmentSelect.addEventListener('change', calculate);
  
  // Execução inicial
  calculate();
}

/* ==========================================================================
   6. Modais de Detalhamento Técnico das Soluções
   ========================================================================== */
const solutionsData = {
  eta: {
    title: "Estações de Tratamento de Água e Efluentes (ETA & ETE)",
    subtitle: "Plantas compactas modulares e industriais de alta vazão",
    description: "Engenharia integral para tratamento primário, secundário e terciário de águas de processo e efluentes. Utilizamos tecnologia de flotação por ar dissolvido (FAD), ultrafiltração por membranas (MBR/UF), osmose reversa e sistemas biológicos avançados. Nossas estações são entregues em formato 'Turnkey' ou 'Skid-Mounted' com montagem rápida e mínima intervenção civil.",
    specs: [
      { label: "Capacidade de Tratamento", val: "De 5 m³/h a mais de 800 m³/h" },
      { label: "Eficiência de DBO/DQO", val: "Até 98.5% de remoção" },
      { label: "Padrão de Potabilidade", val: "Conforme Portaria GM/MS nº 888/2021" },
      { label: "Material Estrutural", val: "Aço Inox 304/316L, PRFV e Polipropileno" }
    ]
  },
  adutoras: {
    title: "Sistemas de Abastecimento, Redes e Adutoras",
    subtitle: "Dimensionamento e macrodrenagem com controle hidráulico",
    description: "Projetos executivos para transposição e distribuição de água bruta e tratada. Modelagem hidráulica computacional avançada em WaterGEMS e EPANET para eliminação de golpe de aríete, otimização de diâmetros e controle de pressões dinâmicas. Redução drástica das perdas físicas na malha de tubulações com válvulas redutoras de pressão (VRP) inteligentes.",
    specs: [
      { label: "Extensão de Redes", val: "Malhas urbanas e industriais completas" },
      { label: "Controle de Transientes", val: "Tanques Hidropneumáticos e Válvulas Antecipadoras" },
      { label: "Tubulações Homologadas", val: "PEAD de alta densidade, Ferro Fundido Dúctil e Aço" },
      { label: "Índice de Perdas", val: "Abaixo de 3% sob gestão Hidrosol" }
    ]
  },
  reuso: {
    title: "Gestão Hídrica Circular & Reúso de Efluentes",
    subtitle: "Sustentabilidade ESG com ciclo fechado de água",
    description: "Transformação de efluentes tratados em água de reúso de alta qualidade para fins não potáveis (torres de resfriamento, lavagem de frotas, caldeiras de baixa pressão e irrigação de grandes áreas). Integração com sistemas de captação e aproveitamento pluvial de grande porte com desinfecção por ozônio e ultravioleta (UV).",
    specs: [
      { label: "Economia na Concessionária", val: "Até 70% de redução no consumo de água potável" },
      { label: "Ciclo Fechado", val: "Redução de descarte de efluente no meio ambiente" },
      { label: "Selo ESG", val: "Pontuação para certificações LEED e ISO 14001" },
      { label: "Tecnologia de Polimento", val: "Membranas de Osmose Reversa e Filtros de Zeólita" }
    ]
  },
  telemetria: {
    title: "Telemetria Hídrica & Automação Industrial IoT",
    subtitle: "Monitoramento 24/7 de vazão, pressão e qualidade em nuvem",
    description: "Arquitetura IoT com sensores industriais sem fio de alta precisão interligados a CLPs e gateway com conectividade 4G/LoRaWAN/Satélite. Acesso a dashboards web e mobile em tempo real com algoritmo de inteligência artificial para detecção preditiva de vazamentos, automação de bombas por inversor de frequência e relatórios automáticos de conformidade.",
    specs: [
      { label: "Parâmetros Monitorados", val: "Vazão instantânea, totalização, pH, turbidez, cloro e condutividade" },
      { label: "Tempo de Resposta", val: "Alertas via WhatsApp e SMS em menos de 10 segundos" },
      { label: "Protocolos Industriais", val: "Modbus-RTU, MQTT, Profinet e OPC-UA" },
      { label: "Economia de Energia", val: "Otimização de até 35% no consumo elétrico de bombeamento" }
    ]
  },
  consultoria: {
    title: "Consultoria, Licenciamento & Outorgas Hídricas",
    subtitle: "Segurança jurídica e técnica completa junto aos órgãos reguladores",
    description: "Elaboração de estudos hidrogeológicos e hidrológicos para obtenção e renovação de outorgas de captação superficial e subterrânea (poços tubulares profundos). Suporte integral para licenciamento ambiental prévio (LP), de instalação (LI) e de operação (LO) em órgãos estaduais (DAEE, CETESB, IGAM, INEA, etc.) e federais (ANA).",
    specs: [
      { label: "Taxa de Aprovação", val: "100% de conformidade técnica e ambiental" },
      { label: "Estudos Hidrogeológicos", val: "Testes de bombeamento, vazão e rebaixamento de aquíferos" },
      { label: "Responsabilidade Técnica", val: "ART (Anotação de Responsabilidade Técnica) emitida no CREA" },
      { label: "Atendimento", val: "Nacional com acompanhamento processual digital" }
    ]
  }
};

function initSolutionModals() {
  const modal = document.getElementById('solution-modal');
  const modalTitle = document.getElementById('sol-modal-title');
  const modalSubtitle = document.getElementById('sol-modal-subtitle');
  const modalDesc = document.getElementById('sol-modal-desc');
  const modalSpecs = document.getElementById('sol-modal-specs');
  const closeBtn = document.getElementById('close-sol-modal');
  const detailButtons = document.querySelectorAll('.open-sol-modal');

  if (!modal || !detailButtons.length) return;

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const solKey = btn.getAttribute('data-solution');
      const data = solutionsData[solKey];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalSubtitle.textContent = data.subtitle;
      modalDesc.textContent = data.description;

      modalSpecs.innerHTML = '';
      data.specs.forEach(spec => {
        const div = document.createElement('div');
        div.className = 'bg-slate-50 p-3 rounded-lg border border-slate-200';
        div.innerHTML = `<span class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">${spec.label}</span>
                         <span class="text-sm font-bold text-[#003B5C]">${spec.val}</span>`;
        modalSpecs.appendChild(div);
      });

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeSolModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeSolModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSolModal();
  });
}

/* ==========================================================================
   7. Formulário de Conversão com Validação e Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('orcamento-form');
  const feedbackModal = document.getElementById('form-feedback-modal');
  const feedbackName = document.getElementById('feedback-user-name');
  const closeFeedbackBtn = document.getElementById('close-feedback-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Estado de carregamento técnico
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg> Processando Orçamento Técnico...
    `;

    const nomeInput = form.querySelector('input[name="nome"]');
    const userName = nomeInput ? nomeInput.value.trim() : 'Cliente';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Exibir modal de sucesso
      if (feedbackModal) {
        if (feedbackName) feedbackName.textContent = userName;
        feedbackModal.classList.remove('hidden');
        feedbackModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }

      form.reset();
    }, 1200);
  });

  if (closeFeedbackBtn && feedbackModal) {
    closeFeedbackBtn.addEventListener('click', () => {
      feedbackModal.classList.add('hidden');
      feedbackModal.classList.remove('flex');
      document.body.style.overflow = '';
    });
  }
}

/* ==========================================================================
   8. Botão Voltar ao Topo
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'invisible');
      backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
      backToTopBtn.classList.add('opacity-0', 'invisible');
      backToTopBtn.classList.remove('opacity-100', 'visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
