// Dados do questionário
const quizQuestions = [
    {
        question: "Qual é o seu principal objetivo ao investir?",
        options: [
            { text: "Preservar meu capital, evitando perdas", value: "conservador" },
            { text: "Crescimento moderado do meu capital", value: "moderado" },
            { text: "Maximizar retornos, aceitando volatilidade", value: "arrojado" }
        ]
    },
    {
        question: "Por quanto tempo você pretende manter seus investimentos?",
        options: [
            { text: "Até 1 ano", value: "conservador" },
            { text: "De 1 a 3 anos", value: "moderado" },
            { text: "Mais de 5 anos", value: "arrojado" }
        ]
    },
    {
        question: "Como você reagiria se seus investimentos perdessem 15% do valor em um mês?",
        options: [
            { text: "Venderia tudo para evitar maiores perdas", value: "conservador" },
            { text: "Aguardaria para ver se recupera", value: "moderado" },
            { text: "Aproveitaria para comprar mais", value: "arrojado" }
        ]
    },
    {
        question: "Qual porcentagem da sua renda você está disposto a investir?",
        options: [
            { text: "Até 10%", value: "conservador" },
            { text: "Entre 10% e 25%", value: "moderado" },
            { text: "Mais de 25%", value: "arrojado" }
        ]
    },
    {
        question: "Qual tipo de investimento você prefere?",
        options: [
            { text: "Poupança ou Tesouro Direto", value: "conservador" },
            { text: "Fundos de investimento ou CDBs", value: "moderado" },
            { text: "Ações ou fundos imobiliários", value: "arrojado" }
        ]
    }
];

// Perfis de investidor
const investorProfiles = {
    conservador: {
        name: "Conservador",
        description: "Você prefere segurança acima de tudo. Seus investimentos devem focar em preservar o capital com baixo risco.",
        recommendations: [
            "Tesouro Direto (Selic ou IPCA+)",
            "CDBs de bancos grandes (com garantia do FGC)",
            "Fundos de Renda Fixa",
            "LCI e LCA (isentos de IR)",
            "Poupança (para reserva de emergência)"
        ]
    },
    moderado: {
        name: "Moderado",
        description: "Você está disposto a assumir algum risco por retornos melhores, mas sem exageros. Um equilíbrio entre segurança e crescimento.",
        recommendations: [
            "Fundos Multimercado",
            "ETFs de índices amplos",
            "Ações de empresas sólidas (blue chips)",
            "Debêntures",
            "Fundos Imobiliários conservadores"
        ]
    },
    arrojado: {
        name: "Arrojado",
        description: "Você busca maximizar retornos e está disposto a enfrentar volatilidade. Tem horizonte de longo prazo e tolerância a riscos.",
        recommendations: [
            "Ações individuais",
            "Fundos Imobiliários",
            "Criptomoedas (com parcimônia)",
            "Fundos de Ações",
            "Derivativos (para investidores experientes)"
        ]
    }
};

// Variáveis de estado
let currentQuestion = 0;
let answers = [];
let userProfile = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar questionário quando clicar no botão Comece agora
    document.getElementById('btn-start').addEventListener('click', startQuiz);
    
    // Carregar primeira pergunta
    if (document.getElementById('investor-profile-quiz')) {
        loadQuestion(currentQuestion);
    }
    
    // Configurar ferramentas
    setupTools();
});

function startQuiz() {
    document.getElementById('perfil').scrollIntoView({ behavior: 'smooth' });
}

function loadQuestion(index) {
    const quizForm = document.getElementById('investor-profile-quiz');
    quizForm.innerHTML = '';
    
    // Atualizar barra de progresso
    const progress = ((index + 1) / quizQuestions.length) * 100;
    document.getElementById('quiz-progress').style.width = `${progress}%`;
    
    // Adicionar pergunta atual
    const question = quizQuestions[index];
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-question';
    
    const questionTitle = document.createElement('h4');
    questionTitle.textContent = `${index + 1}. ${question.question}`;
    questionDiv.appendChild(questionTitle);
    
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'quiz-options';
    
    question.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'quiz-option';
        input.id = `option-${index}-${i}`;
        input.value = option.value;
        
        const label = document.createElement('label');
        label.htmlFor = `option-${index}-${i}`;
        label.textContent = option.text;
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsDiv.appendChild(optionDiv);
    });
    
    questionDiv.appendChild(optionsDiv);
    quizForm.appendChild(questionDiv);
    
    // Adicionar navegação
    const navDiv = document.createElement('div');
    navDiv.className = 'quiz-navigation';
    
    if (index > 0) {
        const prevButton = document.createElement('button');
        prevButton.type = 'button';
        prevButton.className = 'secondary-button';
        prevButton.textContent = 'Anterior';
        prevButton.addEventListener('click', () => {
            currentQuestion--;
            loadQuestion(currentQuestion);
        });
        navDiv.appendChild(prevButton);
    }
    
    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'cta-button';
    nextButton.textContent = index < quizQuestions.length - 1 ? 'Próxima' : 'Finalizar';
    nextButton.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
        if (!selectedOption) {
            alert('Por favor, selecione uma opção');
            return;
        }
        
        answers[index] = selectedOption.value;
        
        if (index < quizQuestions.length - 1) {
            currentQuestion++;
            loadQuestion(currentQuestion);
        } else {
            calculateProfile();
        }
    });
    navDiv.appendChild(nextButton);
    
    quizForm.appendChild(navDiv);
}

function calculateProfile() {
    // Contar respostas
    const profileCount = {
        conservador: 0,
        moderado: 0,
        arrojado: 0
    };
    
    answers.forEach(answer => {
        profileCount[answer]++;
    });
    
    // Determinar perfil predominante
    let maxCount = 0;
    let determinedProfile = 'conservador';
    
    for (const [profile, count] of Object.entries(profileCount)) {
        if (count > maxCount) {
            maxCount = count;
            determinedProfile = profile;
        }
    }
    
    userProfile = determinedProfile;
    showResults(determinedProfile);
}

function showResults(profile) {
    document.getElementById('investor-profile-quiz').classList.add('hidden');
    
    const resultDiv = document.getElementById('quiz-result');
    const profileData = investorProfiles[profile];
    
    document.getElementById('profile-type').textContent = profileData.name;
    document.getElementById('profile-description').innerHTML = `<p>${profileData.description}</p>`;
    
    const recommendationsList = document.getElementById('investment-recommendations');
    recommendationsList.innerHTML = '';
    
    profileData.recommendations.forEach(item => {
        const recDiv = document.createElement('div');
        recDiv.className = 'recommendation-item';
        recDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${item}`;
        recommendationsList.appendChild(recDiv);
    });
    
    resultDiv.classList.remove('hidden');
    
    // Configurar botão de salvar perfil
    document.getElementById('save-profile').addEventListener('click', saveProfile);
}

function saveProfile() {
    // Aqui você implementaria a lógica para salvar no backend
    // Por enquanto, vamos apenas mostrar uma mensagem
    alert(`Perfil ${userProfile} salvo com sucesso!`);
    
    // Redirecionar ou mostrar conteúdo personalizado
    personalizeContent(userProfile);
}

function personalizeContent(profile) {
    // Personalizar recomendações de cursos baseado no perfil
    const courses = document.querySelectorAll('.path-step');
    
    courses.forEach(course => {
        const level = course.getAttribute('data-level');
        
        // Destaque cursos recomendados para o perfil
        if ((profile === 'conservador' && level === 'iniciante') ||
            (profile === 'moderado' && level === 'intermediario') ||
            (profile === 'arrojado' && level === 'avancado')) {
            course.style.borderLeft = `4px solid var(--secondary-color)`;
        }
    });
}
//setupTools()  centraliza toda a configuração das ferramentas interativas
function setupTools() {
    // Configurar eventos para as ferramentas
    document.getElementById('compound-interest').addEventListener('click', () => {
        console.log('Redirecionando para a Calculadora do Cidadão...');
        window.open('https://www3.bcb.gov.br/CALCIDADAO/jsp/index.jsp', '_blank');
    });
}

    document.getElementById('investment-simulator').addEventListener('click', () => {
        alert('Simulador de Investimentos será aberto');
        // Implementar lógica da ferramenta
    });
    
    document.getElementById('portfolio-builder').addEventListener('click', () => {
        alert('Construtor de Carteira será aberto');
        // Implementar lógica da ferramenta
    });

// ===== FUNÇÕES DO ORÇAMENTO =====
function setupBudgetTool() {
    // Adicione aqui todo o código JavaScript 
    // que estava na tag <script> do orçamento.html
}

document.addEventListener('DOMContentLoaded', function() {
    setupBudgetTool();
});
function formatReference() {
    const ref = `BRASIL. Banco Central do Brasil. <strong>Cuidando do seu dinheiro: Gestão de Finanças Pessoais</strong>. Brasília: BCB, 2021.`;
    const link = `Disponível em: <a href="https://www.bcb.gov.br/..." target="_blank">https://www.bcb.gov.br/...</a>`;
    const date = `Acesso em: ${new Date().toLocaleDateString('pt-BR')}.`;
    
    return `${ref} ${link} ${date}`;
}
// Formulário de Contato 
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulação de envio (substitua por integração real com backend)
    const formData = new FormData(this);
    const dados = Object.fromEntries(formData.entries());
    
    console.log('Mensagem enviada:', dados); // Para debug
    alert('Mensagem enviada com sucesso! Responderemos em até 48h.');
    this.reset();
});