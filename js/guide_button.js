// Script para garantir que o botão de guia de resultados funcione corretamente

// Função principal para adicionar o evento ao botão
function setupGuideButton() {
    //console.log("Configurando botão de guia de resultados...");
    
    // Obter referência ao botão
    const viewGuideBtn = document.getElementById('view-guide-btn');
    
    if (!viewGuideBtn) {
        //console.error("Botão 'view-guide-btn' não encontrado no DOM");
        return;
    }
    
    //console.log("Botão encontrado, adicionando evento de clique");
    
    // Adicionar evento de clique
    viewGuideBtn.addEventListener('click', function(e) {
        //console.log("Botão de guia clicado!");
        
        // Evitar comportamento padrão se houver
        e.preventDefault();
        
        // Obter os resultados calculados
        const wastedRevenueElement = document.getElementById('wasted-revenue');
        const currentConversionElement = document.getElementById('current-conversion-display');
        const benchmarkConversionElement = document.getElementById('benchmark-conversion-display');
        
        // Verificar se os elementos existem
        if (!wastedRevenueElement) {
            console.error("Elemento 'wasted-revenue' não encontrado");
        }
        if (!currentConversionElement) {
            console.error("Elemento 'current-conversion-display' não encontrado");
        }
        if (!benchmarkConversionElement) {
            console.error("Elemento 'benchmark-conversion-display' não encontrado");
        }
        
        // Valores padrão caso os elementos não sejam encontrados
        let moneyOnTable = 0;
        let currentConversion = 0;
        let benchmarkConversion = 0;
        
        if (wastedRevenueElement) {
            const text = wastedRevenueElement.textContent || wastedRevenueElement.innerText || "0";
            // Usar formatação correta para extrair o valor numérico
            moneyOnTable = parseFloat(
                text.replace(/[^\d,]/g, '')  // Remove tudo exceto números e vírgula
                    .replace('.', '')        // Remove pontos de milhar se existirem
                    .replace(',', '.')       // Substitui vírgula decimal por ponto
            ) || 0;
            
            //console.log("Valor extraído:", moneyOnTable);
        }                
        
        if (currentConversionElement) {
            const text = currentConversionElement.textContent || currentConversionElement.innerText || "0";
            currentConversion = parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            //console.log("Conversão atual:", currentConversion);
        }
        
        if (benchmarkConversionElement) {
            const text = benchmarkConversionElement.textContent || benchmarkConversionElement.innerText || "0";
            benchmarkConversion = parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            //console.log("Benchmark de conversão:", benchmarkConversion);
        }
        
        // Determinar a categoria numérica (1-7) com base nos resultados
        // Categorias 1, 2, 3 e 5 são de conversão
        // Categorias 4, 6 e 7 são de ciclo de decisão
        let categoryNum;
        
        // Calcular a diferença percentual entre a taxa atual e o benchmark
        const conversionGapPercentage = ((benchmarkConversion - currentConversion) / benchmarkConversion) * 100;
        
        // Determinar a categoria com base no dinheiro na mesa e na diferença de conversão
        if (moneyOnTable > 100000) {
            if (conversionGapPercentage > 50) {
                categoryNum = '1'; // Alto impacto - Conversão
            } else {
                categoryNum = '4'; // Alto impacto - Ciclo de decisão
            }
        } else if (moneyOnTable > 50000) {
            if (conversionGapPercentage > 30) {
                categoryNum = '2'; // Médio impacto - Conversão
            } else {
                categoryNum = '6'; // Médio impacto - Ciclo de decisão
            }
        } else {
            if (conversionGapPercentage > 20) {
                categoryNum = '3'; // Baixo impacto - Conversão
            } else if (conversionGapPercentage > 10) {
                categoryNum = '5'; // Baixo impacto - Conversão (alternativo)
            } else {
                categoryNum = '7'; // Baixo impacto - Ciclo de decisão
            }
        }
        
        //console.log("Categoria numérica determinada:", categoryNum);
        
        // Construir a URL com os parâmetros
        const params = new URLSearchParams({
            money: moneyOnTable,
            conversion: currentConversion,
            benchmark: benchmarkConversion,
            category: categoryNum,
            utm_source: 'calculadora',
            utm_medium: 'resultado',
            utm_campaign: 'dinheiro_mesa',
            utm_content: categoryNum
        });
        
        // Adicionar o parâmetro cycle_impact se disponível
        // Verificar se temos informações do ciclo de decisão
        if (window.APP && APP.data && APP.data.decisionCycleImpact && APP.data.decisionCycleImpact.cycleImpactPercentage) {
            params.append('cycle_impact', APP.data.decisionCycleImpact.cycleImpactPercentage);
        }
        
        // URL para redirecionamento
        const redirectUrl = `results_guide.html?${params.toString()}`;
        //console.log("Redirecionando para:", redirectUrl);
        
        // Redirecionar para a página do guia de resultados
        window.location.href = redirectUrl;
    });
    
    //console.log("Evento de clique adicionado com sucesso");
}

// Executar quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    //console.log("DOM carregado, verificando botão...");
    
    // Tentar configurar o botão imediatamente
    setupGuideButton();
    
    // Se o botão for adicionado dinamicamente após o carregamento da página
    // (por exemplo, após o cálculo), configurar um observador
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Verificar se o botão foi adicionado
                const viewGuideBtn = document.getElementById('view-guide-btn');
                if (viewGuideBtn && !viewGuideBtn.hasAttribute('data-event-added')) {
                    //console.log("Botão detectado após mutação do DOM");
                    setupGuideButton();
                    viewGuideBtn.setAttribute('data-event-added', 'true');
                }
            }
        });
    });
    
    // Observar todo o documento para mudanças
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Como alternativa ao MutationObserver, também podemos verificar periodicamente
    const checkInterval = setInterval(function() {
        const viewGuideBtn = document.getElementById('view-guide-btn');
        if (viewGuideBtn && !viewGuideBtn.hasAttribute('data-event-added')) {
            //console.log("Botão detectado durante verificação periódica");
            setupGuideButton();
            viewGuideBtn.setAttribute('data-event-added', 'true');
            clearInterval(checkInterval);
        }
    }, 1000);
    
    // Limpar o intervalo após 20 segundos para não consumir recursos desnecessariamente
    setTimeout(function() {
        clearInterval(checkInterval);
    }, 20000);
});

// Verificação adicional para garantir que o script seja executado mesmo se o DOMContentLoaded já tiver ocorrido
if (document.readyState === 'loading') {
    //console.log("Documento ainda carregando, aguardando DOMContentLoaded");
} else {
    //console.log("Documento já carregado, executando imediatamente");
    setupGuideButton();
}
