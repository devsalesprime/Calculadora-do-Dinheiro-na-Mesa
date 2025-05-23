// Namespace para o guia de resultados
window.GUIDE = window.GUIDE || {};

// Função para obter parâmetros da URL
GUIDE.getUrlParams = function() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    
    //console.log("Parâmetros obtidos da URL:", params);
    return params;
};

// Função para formatar valores monetários
GUIDE.formatCurrency = function(value) {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(value);
};

// Função para formatar percentuais corretamente
GUIDE.formatPercentage = function(value) {
    // Garantir que o valor seja tratado como número
    const numValue = parseFloat(value);
    
    // Dividir por 100 para converter de "200.00" para "2.0"
    const adjustedValue = numValue / 100;
    
    // Formatar com uma casa decimal (2.0% em vez de 200.00%)
    return adjustedValue.toFixed(1) + '%';
};

// Função para determinar o tipo de guia (conversão ou ciclo de decisão)
GUIDE.determineGuideType = function(category) {
    //console.log("Determinando tipo de guia para categoria:", category);
    
    // Categorias 1, 2, 3 e 5 são de conversão
    // Categorias 4, 6 e 7 são de ciclo de decisão
    const conversionCategories = ['1', '2', '3', '5'];
    const decisionCycleCategories = ['4', '6', '7'];
    
    if (conversionCategories.includes(category)) {
        //console.log("Tipo de guia determinado: conversao");
        return 'conversao';
    } else if (decisionCycleCategories.includes(category)) {
        //console.log("Tipo de guia determinado: ciclo_decisao");
        return 'ciclo_decisao';
    } else {
        //console.log("Categoria não reconhecida, usando padrão: conversao");
        return 'conversao';
    }
};

// Função para determinar a categoria do guia com base nos resultados
GUIDE.determineCategory = function(moneyOnTable, conversionRate, benchmarkRate) {
    // Cálculo da diferença percentual entre a taxa atual e o benchmark
    const conversionGapPercentage = ((benchmarkRate - conversionRate) / benchmarkRate) * 100;
    
    if (moneyOnTable > 100000) {
        return 'alto_impacto';
    } else if (moneyOnTable > 50000) {
        return 'medio_impacto';
    } else {
        return 'baixo_impacto';
    }
};

// Conteúdo do guia por categoria e tipo
GUIDE.content = {
    // Conteúdo para guias de conversão
    conversao: {
        alto_impacto: {
            message: "Sua empresa está deixando uma quantidade significativa de dinheiro na mesa devido a problemas de conversão. Este guia foi desenvolvido para ajudar você a implementar mudanças de alto impacto no seu processo comercial.",
            steps: [
                {
                    title: "Reestruture seu Funil de Vendas",
                    description: "Seu processo comercial atual está muito abaixo do benchmark do setor, indicando problemas estruturais no funil de vendas.",
                    actions: [
                        "Mapeie todas as etapas do seu processo de vendas atual",
                        "Identifique os principais gargalos em cada etapa",
                        "Implemente um CRM para monitorar métricas em tempo real",
                        "Estabeleça metas claras de conversão para cada etapa"
                    ],
                    resource: {
                        title: "Planilha de Mapeamento de Funil",
                        description: "Use nossa planilha para mapear seu funil atual e identificar os pontos de melhoria.",
                        link: "#planilha-funil"
                    }
                },
                {
                    title: "Revise sua Estratégia de Qualificação de Leads",
                    description: "Leads mal qualificados consomem recursos e reduzem drasticamente suas taxas de conversão.",
                    actions: [
                        "Implemente um sistema de lead scoring",
                        "Crie critérios claros de MQL e SQL",
                        "Treine sua equipe para qualificar leads corretamente",
                        "Estabeleça um processo de nutrição para leads não qualificados"
                    ],
                    resource: {
                        title: "Framework de Qualificação de Leads",
                        description: "Nosso framework ajuda a criar critérios eficazes de qualificação.",
                        link: "#framework-qualificacao"
                    }
                },
                {
                    title: "Otimize seu Processo de Vendas",
                    description: "Um processo de vendas ineficiente está custando muito dinheiro para sua empresa.",
                    actions: [
                        "Padronize seu script de vendas",
                        "Implemente um processo de objeções documentado",
                        "Crie materiais de apoio para cada etapa da venda",
                        "Estabeleça um ciclo de feedback contínuo"
                    ],
                    resource: {
                        title: "Playbook de Vendas",
                        description: "Nosso playbook de vendas contém scripts e processos testados para aumentar suas conversões.",
                        link: "#playbook-vendas"
                    }
                }
            ]
        },
        medio_impacto: {
            message: "Sua empresa está deixando um valor considerável de dinheiro na mesa devido a problemas de conversão. Este guia foi desenvolvido para ajudar você a otimizar seu processo comercial com melhorias de médio impacto.",
            steps: [
                {
                    title: "Otimize suas Taxas de Conversão",
                    description: "Suas taxas de conversão estão abaixo do benchmark do setor, indicando oportunidades de melhoria.",
                    actions: [
                        "Analise cada etapa do funil separadamente",
                        "Identifique as 2 etapas com pior desempenho",
                        "Implemente melhorias focadas nestas etapas",
                        "Monitore os resultados semanalmente"
                    ],
                    resource: {
                        title: "Calculadora de Impacto de Conversão",
                        description: "Use nossa calculadora para simular o impacto de melhorias em cada etapa do funil.",
                        link: "#calculadora-impacto"
                    }
                },
                {
                    title: "Melhore seu Processo de Qualificação",
                    description: "Um processo de qualificação mais eficiente pode aumentar significativamente suas taxas de conversão.",
                    actions: [
                        "Revise seus critérios de qualificação",
                        "Implemente perguntas de qualificação padronizadas",
                        "Treine sua equipe para identificar sinais de compra",
                        "Crie um processo de desqualificação rápida"
                    ],
                    resource: {
                        title: "Checklist de Qualificação",
                        description: "Nosso checklist ajuda a identificar leads com maior potencial de conversão.",
                        link: "#checklist-qualificacao"
                    }
                },
                {
                    title: "Reduza seu Ciclo de Vendas",
                    description: "Um ciclo de vendas mais curto permite processar mais leads com os mesmos recursos.",
                    actions: [
                        "Mapeie a duração atual de cada etapa do funil",
                        "Identifique etapas que estão demorando mais que o necessário",
                        "Implemente gatilhos de avanço para cada etapa",
                        "Crie um sistema de alertas para leads estagnados"
                    ],
                    resource: {
                        title: "Template de Gestão de Ciclo de Vendas",
                        description: "Nosso template ajuda a monitorar e reduzir a duração de cada etapa do funil.",
                        link: "#template-ciclo"
                    }
                }
            ]
        },
        baixo_impacto: {
            message: "Sua empresa está deixando algum dinheiro na mesa devido a problemas de conversão, mas já está no caminho certo. Este guia foi desenvolvido para ajudar você a fazer ajustes finos no seu processo comercial.",
            steps: [
                {
                    title: "Refine seu Processo de Vendas",
                    description: "Pequenos ajustes no seu processo podem trazer melhorias incrementais nas suas taxas de conversão.",
                    actions: [
                        "Analise os casos de sucesso e fracasso recentes",
                        "Identifique padrões nos casos bem-sucedidos",
                        "Documente as melhores práticas",
                        "Compartilhe conhecimento entre a equipe"
                    ],
                    resource: {
                        title: "Template de Análise de Casos",
                        description: "Nosso template ajuda a identificar padrões nos seus casos de sucesso e fracasso.",
                        link: "#template-analise"
                    }
                },
                {
                    title: "Melhore sua Proposta de Valor",
                    description: "Uma proposta de valor mais clara e convincente pode aumentar suas taxas de conversão.",
                    actions: [
                        "Revise sua proposta de valor atual",
                        "Colete feedback dos clientes",
                        "Teste diferentes abordagens",
                        "Mensure o impacto nas conversões"
                    ],
                    resource: {
                        title: "Framework de Proposta de Valor",
                        description: "Nosso framework ajuda a criar uma proposta de valor mais convincente.",
                        link: "#framework-proposta"
                    }
                },
                {
                    title: "Otimize seu Processo de Onboarding",
                    description: "Um processo de onboarding eficiente reduz o churn e aumenta o lifetime value dos clientes.",
                    actions: [
                        "Mapeie a jornada atual de onboarding",
                        "Identifique pontos de atrito",
                        "Implemente melhorias no processo",
                        "Colete feedback dos novos clientes"
                    ],
                    resource: {
                        title: "Checklist de Onboarding",
                        description: "Nosso checklist ajuda a criar um processo de onboarding mais eficiente.",
                        link: "#checklist-onboarding"
                    }
                }
            ]
        }
    },
    
    // Conteúdo para guias de ciclo de decisão
    ciclo_decisao: {
        alto_impacto: {
            message: "Sua empresa está deixando uma quantidade significativa de dinheiro na mesa devido a um ciclo de decisão ineficiente. Este guia foi desenvolvido para ajudar você a otimizar seu ciclo de decisão de compra.",
            steps: [
                {
                    title: "Reduza a Complexidade do Processo de Compra",
                    description: "Um processo de compra complexo aumenta significativamente o ciclo de decisão e reduz as taxas de conversão.",
                    actions: [
                        "Mapeie todas as etapas do processo de compra atual",
                        "Identifique etapas que podem ser simplificadas ou eliminadas",
                        "Crie materiais que antecipem e respondam objeções comuns",
                        "Implemente um processo de aprovação mais eficiente"
                    ],
                    resource: {
                        title: "Framework de Simplificação de Processo",
                        description: "Use nosso framework para identificar e eliminar complexidades desnecessárias no processo de compra.",
                        link: "#framework-simplificacao"
                    }
                },
                {
                    title: "Implemente um Processo de Qualificação Eficiente",
                    description: "Qualificar corretamente os prospects reduz o tempo gasto com oportunidades de baixa probabilidade de fechamento.",
                    actions: [
                        "Desenvolva critérios claros de qualificação",
                        "Treine sua equipe para identificar sinais de compra",
                        "Implemente um processo de desqualificação rápida",
                        "Priorize oportunidades com maior probabilidade de fechamento"
                    ],
                    resource: {
                        title: "Matriz de Qualificação de Oportunidades",
                        description: "Nossa matriz ajuda a priorizar oportunidades com base em critérios objetivos.",
                        link: "#matriz-qualificacao"
                    }
                },
                {
                    title: "Otimize a Comunicação com Stakeholders",
                    description: "A falta de comunicação eficiente entre stakeholders é uma das principais causas de ciclos de decisão longos.",
                    actions: [
                        "Identifique todos os stakeholders envolvidos no processo de decisão",
                        "Crie materiais específicos para cada tipo de stakeholder",
                        "Implemente um processo de comunicação transparente",
                        "Facilite a colaboração entre diferentes departamentos"
                    ],
                    resource: {
                        title: "Mapa de Stakeholders",
                        description: "Nosso template ajuda a identificar e gerenciar todos os stakeholders envolvidos no processo de decisão.",
                        link: "#mapa-stakeholders"
                    }
                }
            ]
        },
        medio_impacto: {
            message: "Sua empresa está deixando um valor considerável de dinheiro na mesa devido a ineficiências no ciclo de decisão. Este guia foi desenvolvido para ajudar você a otimizar seu processo de vendas.",
            steps: [
                {
                    title: "Agilize seu Processo de Proposta",
                    description: "Um processo de proposta lento e complexo aumenta significativamente o ciclo de decisão.",
                    actions: [
                        "Crie templates de proposta para diferentes cenários",
                        "Automatize a geração de propostas quando possível",
                        "Implemente um processo de aprovação interna mais eficiente",
                        "Desenvolva um sistema de acompanhamento de propostas"
                    ],
                    resource: {
                        title: "Templates de Proposta",
                        description: "Nossos templates de proposta ajudam a agilizar o processo de criação e aprovação.",
                        link: "#templates-proposta"
                    }
                },
                {
                    title: "Melhore a Gestão de Objeções",
                    description: "Objeções não tratadas adequadamente prolongam o ciclo de decisão e reduzem as chances de fechamento.",
                    actions: [
                        "Documente as objeções mais comuns",
                        "Desenvolva respostas padronizadas para cada objeção",
                        "Treine sua equipe para identificar e tratar objeções proativamente",
                        "Crie materiais que antecipem objeções comuns"
                    ],
                    resource: {
                        title: "Biblioteca de Objeções",
                        description: "Nossa biblioteca contém respostas eficazes para as objeções mais comuns em seu setor.",
                        link: "#biblioteca-objecoes"
                    }
                },
                {
                    title: "Implemente um Processo de Follow-up Estruturado",
                    description: "Um processo de follow-up estruturado mantém o momentum da venda e reduz o ciclo de decisão.",
                    actions: [
                        "Defina pontos de contato específicos ao longo do ciclo de vendas",
                        "Crie templates de e-mail e mensagens para cada ponto de contato",
                        "Estabeleça prazos claros para cada etapa do processo",
                        "Implemente um sistema de alertas para oportunidades estagnadas"
                    ],
                    resource: {
                        title: "Calendário de Follow-up",
                        description: "Nosso template ajuda a estruturar um processo de follow-up eficiente.",
                        link: "#calendario-followup"
                    }
                }
            ]
        },
        baixo_impacto: {
            message: "Sua empresa está deixando algum dinheiro na mesa devido a pequenas ineficiências no ciclo de decisão. Este guia foi desenvolvido para ajudar você a fazer ajustes finos no seu processo comercial.",
            steps: [
                {
                    title: "Otimize sua Comunicação com o Cliente",
                    description: "Uma comunicação clara e eficiente reduz mal-entendidos e acelera o ciclo de decisão.",
                    actions: [
                        "Revise seus materiais de comunicação atuais",
                        "Simplifique a linguagem e elimine jargões desnecessários",
                        "Crie um FAQ para perguntas comuns",
                        "Estabeleça expectativas claras sobre próximos passos"
                    ],
                    resource: {
                        title: "Guia de Comunicação Eficiente",
                        description: "Nosso guia contém dicas práticas para melhorar a comunicação com clientes.",
                        link: "#guia-comunicacao"
                    }
                },
                {
                    title: "Refine seu Processo de Negociação",
                    description: "Um processo de negociação bem estruturado reduz o tempo gasto em discussões improdutivas.",
                    actions: [
                        "Defina claramente seus limites de negociação",
                        "Prepare-se antecipadamente para concessões possíveis",
                        "Treine sua equipe em técnicas de negociação",
                        "Documente aprendizados de negociações anteriores"
                    ],
                    resource: {
                        title: "Framework de Negociação",
                        description: "Nosso framework ajuda a estruturar negociações para resultados mais rápidos e favoráveis.",
                        link: "#framework-negociacao"
                    }
                },
                {
                    title: "Implemente Ferramentas de Produtividade",
                    description: "Ferramentas adequadas podem reduzir significativamente o tempo gasto em tarefas administrativas.",
                    actions: [
                        "Identifique gargalos no processo atual",
                        "Pesquise ferramentas que podem automatizar tarefas repetitivas",
                        "Integre suas ferramentas para evitar trabalho duplicado",
                        "Treine sua equipe para utilizar as ferramentas eficientemente"
                    ],
                    resource: {
                        title: "Lista de Ferramentas Recomendadas",
                        description: "Nossa lista contém ferramentas testadas que podem aumentar a produtividade da sua equipe.",
                        link: "#ferramentas-recomendadas"
                    }
                }
            ]
        }
    }
};

// Função para renderizar o conteúdo do guia em formato de sanfona
GUIDE.renderAccordionGuideContent = function(primaryGuideType, secondaryGuideType, impactLevel) {
    //console.log("Renderizando conteúdo do guia em sanfona:", primaryGuideType, secondaryGuideType, impactLevel);
    
    // Verificar se os tipos de guia e categoria existem
    if (!GUIDE.content[primaryGuideType] || !GUIDE.content[primaryGuideType][impactLevel]) {
        //console.error(`Tipo de guia primário '${primaryGuideType}' ou nível de impacto '${impactLevel}' não encontrados`);
        return;
    }
    
    const primaryGuideContent = GUIDE.content[primaryGuideType][impactLevel];
    
    // Atualiza a mensagem da categoria
    document.getElementById('guide-category-message').innerHTML = `
        <p>${primaryGuideContent.message}</p>
    `;
    
    // Renderiza os passos do guia em formato de sanfona
    const stepsContainer = document.getElementById('guide-steps');
    stepsContainer.innerHTML = '';
    
    // Criar o container para a sanfona
    const accordionContainer = document.createElement('div');
    accordionContainer.className = 'accordion';
    accordionContainer.id = 'guideAccordion';
    
    // Adicionar o primeiro painel da sanfona (tipo primário)
    const primaryAccordionItem = document.createElement('div');
    primaryAccordionItem.className = 'accordion-item';
    
    // Determinar o título do painel baseado no tipo de guia
    const primaryTitle = primaryGuideType === 'conversao' ? 'Guia de Conversão' : 'Guia de Ciclo de Decisão';
    
    primaryAccordionItem.innerHTML = `
        <h2 class="accordion-header" id="heading-primary">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-primary" aria-expanded="true" aria-controls="collapse-primary">
                ${primaryTitle}
            </button>
        </h2>
        <div id="collapse-primary" class="accordion-collapse collapse show" aria-labelledby="heading-primary" data-bs-parent="#guideAccordion">
            <div class="accordion-body" id="primary-guide-content">
                <!-- O conteúdo do guia primário será inserido aqui -->
            </div>
        </div>
    `;
    
    accordionContainer.appendChild(primaryAccordionItem);
    
    // Se houver um tipo secundário, adicionar o segundo painel da sanfona
    if (secondaryGuideType && GUIDE.content[secondaryGuideType] && GUIDE.content[secondaryGuideType][impactLevel]) {
        const secondaryAccordionItem = document.createElement('div');
        secondaryAccordionItem.className = 'accordion-item';
        
        // Determinar o título do painel baseado no tipo de guia secundário
        const secondaryTitle = secondaryGuideType === 'conversao' ? 'Guia de Conversão' : 'Guia de Ciclo de Decisão';
        
        secondaryAccordionItem.innerHTML = `
            <h2 class="accordion-header" id="heading-secondary">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-secondary" aria-expanded="false" aria-controls="collapse-secondary">
                    ${secondaryTitle}
                </button>
            </h2>
            <div id="collapse-secondary" class="accordion-collapse collapse" aria-labelledby="heading-secondary" data-bs-parent="#guideAccordion">
                <div class="accordion-body" id="secondary-guide-content">
                    <!-- O conteúdo do guia secundário será inserido aqui -->
                </div>
            </div>
        `;
        
        accordionContainer.appendChild(secondaryAccordionItem);
    }
    
    // Adicionar a sanfona ao container de passos
    stepsContainer.appendChild(accordionContainer);
    
    // Renderizar o conteúdo do guia primário
    GUIDE.renderGuideSteps(primaryGuideContent, 'primary-guide-content');
    
    // Se houver um tipo secundário, renderizar o conteúdo do guia secundário
    if (secondaryGuideType && GUIDE.content[secondaryGuideType] && GUIDE.content[secondaryGuideType][impactLevel]) {
        const secondaryGuideContent = GUIDE.content[secondaryGuideType][impactLevel];
        GUIDE.renderGuideSteps(secondaryGuideContent, 'secondary-guide-content');
    }
    
    //console.log("Conteúdo do guia em sanfona renderizado com sucesso");
};

// Função para renderizar os passos do guia em um container específico
GUIDE.renderGuideSteps = function(guideContent, containerId) {
    //console.log("Renderizando passos do guia no container:", containerId);
    
    const container = document.getElementById(containerId);
    if (!container) {
        //console.error(`Container '${containerId}' não encontrado`);
        return;
    }
    
    guideContent.steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'guide-step';
        
        let actionsHtml = '';
        if (step.actions && step.actions.length) {
            actionsHtml = `
                <ul class="mt-3">
                    ${step.actions.map(action => `<li>${action}</li>`).join('')}
                </ul>
            `;
        }
        
        let resourceHtml = '';
        if (step.resource) {
            resourceHtml = `
                <div class="resource-box">
                    <h4>${step.resource.title}</h4>
                    <p>${step.resource.description}</p>
                    <a href="${step.resource.link}" class="btn btn-outline-primary btn-sm">Acessar Recurso</a>
                </div>
            `;
        }
        
        stepElement.innerHTML = `
            <h3>${index + 1}. ${step.title}</h3>
            <p>${step.description}</p>
            ${actionsHtml}
            ${resourceHtml}
        `;
        
        container.appendChild(stepElement);
    });
    
    //console.log(`Passos do guia renderizados com sucesso no container '${containerId}'`);
};

// Função para atualizar o resumo dos resultados com base no tipo de guia
GUIDE.updateResultsSummary = function(primaryGuideType, secondaryGuideType, moneyOnTable, currentConversion, benchmarkConversion) {
    //console.log("Atualizando resumo dos resultados:", primaryGuideType, secondaryGuideType, moneyOnTable, currentConversion, benchmarkConversion);
    
    const summaryElement = document.getElementById('result-summary');
    if (!summaryElement) {
        console.error("Elemento 'result-summary' não encontrado");
        return;
    }
    
    let summaryHtml = '';
    
    // Conteúdo comum para todos os tipos
    summaryHtml += `<h3>Dinheiro na Mesa: ${GUIDE.formatCurrency(moneyOnTable)}</h3>`;
    
    // Badges para os tipos de guia
    let badgesHtml = '';
    
    if (primaryGuideType === 'conversao' || secondaryGuideType === 'conversao') {
        badgesHtml += `<div class="guide-type-badge conversion">Guia de Conversão</div>`;
    }
    
    if (primaryGuideType === 'ciclo_decisao' || secondaryGuideType === 'ciclo_decisao') {
        badgesHtml += `<div class="guide-type-badge decision-cycle">Guia de Ciclo de Decisão</div>`;
    }
    
    summaryHtml += `<div class="guide-type-badges">${badgesHtml}</div>`;
    
    // Conteúdo específico para cada tipo de guia
    if (primaryGuideType === 'conversao' || secondaryGuideType === 'conversao') {
        summaryHtml += `
            <p>Sua taxa de conversão atual: ${GUIDE.formatPercentage(currentConversion)}</p>
            <p>Benchmark do setor: ${GUIDE.formatPercentage(benchmarkConversion)}</p>
            <p>Diferença: ${GUIDE.formatPercentage(benchmarkConversion - currentConversion)}</p>
        `;
    }
    
    if (primaryGuideType === 'ciclo_decisao' || secondaryGuideType === 'ciclo_decisao') {
        summaryHtml += `
            <p>Seu ciclo de decisão atual está impactando negativamente suas vendas.</p>
            <p>Otimizando seu ciclo de decisão, você pode recuperar até ${GUIDE.formatCurrency(moneyOnTable)} em receita mensal.</p>
        `;
    }
    
    summaryElement.innerHTML = summaryHtml;
    //console.log("Resumo dos resultados atualizado com sucesso");
};

// Função para salvar UTM com comentário
GUIDE.saveUtmWithComment = function(url, source, medium, campaign, content, comment) {
    // Aqui você implementaria a lógica para salvar no banco de dados
    // Como estamos trabalhando com JavaScript puro no frontend, vamos simular salvando no localStorage
    
    const utmData = {
        url: url,
        source: source,
        medium: medium,
        campaign: campaign,
        content: content,
        comment: comment,
        date: new Date().toISOString()
    };
    
    // Obter UTMs existentes ou inicializar array vazio
    const savedUtms = JSON.parse(localStorage.getItem('savedUtms') || '[]');
    
    // Adicionar nova UTM
    savedUtms.push(utmData);
    
    // Salvar de volta no localStorage
    localStorage.setItem('savedUtms', JSON.stringify(savedUtms));
    
    //console.log('UTM salva com comentário:', utmData);
};

// Função para determinar o nível de impacto com base no dinheiro na mesa
GUIDE.determineImpactLevel = function(moneyOnTable) {
    if (moneyOnTable > 100000) {
        return 'alto_impacto';
    } else if (moneyOnTable > 50000) {
        return 'medio_impacto';
    } else {
        return 'baixo_impacto';
    }
};

// Função para determinar se deve mostrar ambos os guias
GUIDE.shouldShowBothGuides = function(conversionGapPercentage, cycleImpact) {
    // Se tivermos informações explícitas sobre o impacto do ciclo de decisão
    if (cycleImpact !== undefined && cycleImpact > 20) {
        return true;
    }
    
    // Se a diferença de conversão for significativa (mais de 30%)
    if (conversionGapPercentage > 30) {
        return true;
    }
    
    return false;
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    //console.log('DOM carregado, inicializando guia de resultados...');
    
    // Obter parâmetros da URL
    const params = GUIDE.getUrlParams();
    //console.log('Parâmetros da URL:', params);
    
    // Valores padrão caso não haja parâmetros
    let moneyOnTable = parseFloat(params.money || '0');
    let currentConversion = parseFloat(params.conversion || '0');
    let benchmarkConversion = parseFloat(params.benchmark || '0');
    let category = params.category || '';
    let cycleImpact = params.cycle_impact ? parseFloat(params.cycle_impact) : undefined;
    
    //console.log('Valores extraídos:', {
        //moneyOnTable,
        //currentConversion,
        //benchmarkConversion,
        //category,
       //cycleImpact
    //});
    
    // Calcular a diferença percentual entre a taxa atual e o benchmark
    const conversionGapPercentage = ((benchmarkConversion - currentConversion) / benchmarkConversion) * 100;
    //console.log('Diferença percentual de conversão:', conversionGapPercentage);
    
    // Determinar o tipo de guia com base na categoria
    const primaryGuideType = GUIDE.determineGuideType(category);
    //console.log('Tipo de guia primário determinado:', primaryGuideType);
    
    // Determinar se deve mostrar ambos os guias
    const showBothGuides = GUIDE.shouldShowBothGuides(conversionGapPercentage, cycleImpact);
    //console.log('Mostrar ambos os guias?', showBothGuides);
    
    // Determinar o tipo de guia secundário, se aplicável
    let secondaryGuideType = null;
    if (showBothGuides) {
        secondaryGuideType = primaryGuideType === 'conversao' ? 'ciclo_decisao' : 'conversao';
        //console.log('Tipo de guia secundário determinado:', secondaryGuideType);
    }
    
    // Determinar o nível de impacto com base no dinheiro na mesa
    const impactLevel = GUIDE.determineImpactLevel(moneyOnTable);
    //console.log('Nível de impacto determinado:', impactLevel);
    
    // Atualizar os elementos com os valores
    document.getElementById('money-on-table').textContent = GUIDE.formatCurrency(moneyOnTable);
    document.getElementById('current-conversion').textContent = GUIDE.formatPercentage(currentConversion);
    document.getElementById('benchmark-conversion').textContent = GUIDE.formatPercentage(benchmarkConversion);
    
    // Atualizar o resumo dos resultados
    GUIDE.updateResultsSummary(primaryGuideType, secondaryGuideType, moneyOnTable, currentConversion, benchmarkConversion);
    
    // Renderizar o conteúdo do guia em formato de sanfona
    GUIDE.renderAccordionGuideContent(primaryGuideType, secondaryGuideType, impactLevel);
    
    // Adicionar estilos CSS para a sanfona
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .guide-type-badges {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .accordion-button:not(.collapsed) {
            background-color: #e6f7ff;
            color: #0066cc;
        }
        
        .accordion-button:focus {
            box-shadow: 0 0 0 0.25rem rgba(0, 102, 204, 0.25);
        }
        
        .accordion-item {
            border-color: #dee2e6;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Adicionar eventos aos botões
    document.getElementById('back-to-calculator').addEventListener('click', function() {
        // Voltar para a calculadora mantendo os dados (usando history.back())
        window.history.back();
    });
    
    // Adicionar botão "Gerar Novamente"
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        // Criar botão "Gerar Novamente"
        const regenerateBtn = document.createElement('button');
        regenerateBtn.id = 'regenerate-guide';
        regenerateBtn.className = 'btn btn-success';
        regenerateBtn.textContent = 'Gerar Novamente';
        
        // Inserir o botão entre "Voltar à Calculadora" e "Falar com um Especialista"
        const contactBtn = document.getElementById('contact-specialist');
        if (contactBtn) {
            actionButtons.insertBefore(regenerateBtn, contactBtn);
            
            // Ajustar o estilo para três botões
            actionButtons.style.justifyContent = 'space-between';
            actionButtons.style.gap = '10px';
            
            // Adicionar evento ao botão "Gerar Novamente"
            regenerateBtn.addEventListener('click', function() {
                // Recarregar a página com os mesmos parâmetros
                window.location.href = 'index.html';
            });
        }
    }
    
    document.getElementById('contact-specialist').addEventListener('click', function() {
        // Parâmetros UTM
        const utmSource = 'calculadora';
        const utmMedium = 'guia_resultados';
        const utmCampaign = 'dinheiro_mesa';
        const utmContent = secondaryGuideType ? 
            `${primaryGuideType}_${secondaryGuideType}_${impactLevel}` : 
            `${primaryGuideType}_${impactLevel}`;
        
        // Comentário automático baseado nos resultados
        const comment = `Dinheiro na mesa: ${GUIDE.formatCurrency(moneyOnTable)} - Tipos: ${secondaryGuideType ? `${primaryGuideType} e ${secondaryGuideType}` : primaryGuideType} - Categoria: ${category} - Conversão: ${GUIDE.formatPercentage(currentConversion)}`;
        
        // URL completa
        const url = `contato.html?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&utm_content=${utmContent}`;
        
        // Salvar UTM com comentário
        GUIDE.saveUtmWithComment(url, utmSource, utmMedium, utmCampaign, utmContent, comment);
        
        // Redirecionar
        window.location.href = url;
    });
    
    //console.log('Inicialização do guia de resultados concluída');
});
