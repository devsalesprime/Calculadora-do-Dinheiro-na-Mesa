// Garante que o namespace APP exista
window.APP = window.APP || {};
APP.calculations = {};

APP.calculations.calculateMetrics = function(formData, sectorBenchmark) {
  const results = {};
  const traffic = parseFloat(formData.traffic);
  const ticket = parseFloat(formData.ticket);
  let conversionRate = 0; // Inicializa com 0, será sobrescrita

  if (isNaN(traffic) || traffic <= 0 || isNaN(ticket) || ticket <= 0) {
    console.error("Tráfego ou ticket médio inválido para cálculo.");
    return null;
  }

  // Mapeamento das chaves do benchmark_data.js para os IDs dos inputs no HTML/formData
  const benchmarkToFormKeyMapping = {
    "lead_para_mql": "lead-to-mql",
    "mql_para_sql": "mql-to-sql",
    "sql_para_oportunidade": "sql-to-opportunity",
    "oportunidade_para_cliente": "opportunity-to-client",
    "visitante_para_carrinho": "visitante-para-carrinho",
    "carrinho_para_checkout": "carrinho-para-checkout",
    "checkout_para_compra": "checkout-para-compra",
    "contato_para_qualificacao": "contato-para-qualificacao",
    "qualificacao_para_proposta": "qualificacao-para-proposta",
    "proposta_para_negociacao": "proposta-para-negociacao",
    "negociacao_para_fechamento": "negociacao-para-fechamento",
    "lead_para_reuniao": "lead-para-reuniao",
    "reuniao_para_proposta": "reuniao-para-proposta",
    "interessado_para_inscrito": "interessado-para-inscrito",
    "inscrito_para_matriculado": "inscrito-para-matriculado",
    "primeiro_contato_para_diagnostico": "primeiro-contato-para-diagnostico",
    "diagnostico_para_proposta": "diagnostico-para-proposta",
    "proposta_para_fechamento": "proposta-para-fechamento"
  };

  if (formData.conversionType === "stages") {
    let calculatedStageConversion = 1;
    let stagesFilled = 0;

    if (sectorBenchmark && sectorBenchmark.taxas_conversao) {
      const benchmarkStagesKeys = Object.keys(sectorBenchmark.taxas_conversao).filter(k => k !== 'total_benchmark');
      
      benchmarkStagesKeys.forEach(benchmarkStageKey => {
        // Usa o mapeamento para obter a chave correta do formulário
        const formStageKey = benchmarkToFormKeyMapping[benchmarkStageKey] || benchmarkStageKey.replace(/_/g, '-');
        
        if (formData.hasOwnProperty(formStageKey) && formData[formStageKey] !== null && String(formData[formStageKey]).trim() !== "" && !isNaN(parseFloat(formData[formStageKey]))) {
          calculatedStageConversion *= (parseFloat(formData[formStageKey]) / 100);
          stagesFilled++;
        } else {
          // console.log(`Etapa ${benchmarkStageKey} (form key: ${formStageKey}) não encontrada ou vazia no formData.`);
        }
      });

      if (stagesFilled > 0) {
        conversionRate = calculatedStageConversion * 100;
      } else {
        // console.log("Nenhuma etapa do funil preenchida, conversão por etapas será 0.");
        conversionRate = 0; 
      }
    } else {
      // console.log("Benchmark ou taxas de conversão não encontradas para o setor.");
      conversionRate = 0; 
    }
  } else {
    conversionRate = parseFloat(formData["conversion-rate"]);
    if (isNaN(conversionRate)) {
        conversionRate = 0; 
    }
  }

  if (isNaN(conversionRate) || conversionRate < 0) { 
    // console.error("Taxa de conversão final inválida, usando 0.");
    conversionRate = 0; 
  }

  const conversionRateDecimal = conversionRate / 100;
  results.clients = traffic * conversionRateDecimal;
  results.revenue = results.clients * ticket;
  results.userConversionRate = conversionRate; 

  if (sectorBenchmark) {
    results.benchmarkConversionRate = sectorBenchmark.taxa_conversao_total_benchmark || (sectorBenchmark.taxas_conversao ? sectorBenchmark.taxas_conversao.total_benchmark : 0);
    if (results.benchmarkConversionRate > 0) {
      const benchmarkClients = traffic * (results.benchmarkConversionRate / 100);
      results.benchmarkRevenue = benchmarkClients * ticket;
      results.revenueGap = results.benchmarkRevenue - results.revenue;
      results.potentialRevenue = results.benchmarkRevenue;
    } else {
      results.benchmarkRevenue = 0;
      results.revenueGap = 0;
      results.potentialRevenue = results.revenue;
    }
  } else {
    results.benchmarkConversionRate = 0;
    results.benchmarkRevenue = 0;
    results.revenueGap = 0;
    results.potentialRevenue = results.revenue;
  }
  return results;
};

APP.calculations.analyzeStageGaps = function(formData, sectorBenchmark) {
  if (formData.conversionType !== "stages" || !sectorBenchmark || !sectorBenchmark.taxas_conversao) {
    return { stageGaps: [], worstStage: null, worstStageUser: null, worstStageBenchmark: null };
  }

  const benchmarkRates = sectorBenchmark.taxas_conversao;
  const benchmarkStageKeys = Object.keys(benchmarkRates).filter(k => k !== 'total_benchmark');

  // Reutiliza o mesmo mapeamento para consistência
  const benchmarkToFormKeyMapping = {
    "lead_para_mql": "lead-to-mql",
    "mql_para_sql": "mql-to-sql",
    "sql_para_oportunidade": "sql-to-opportunity",
    "oportunidade_para_cliente": "opportunity-to-client",
    "visitante_para_carrinho": "visitante-para-carrinho",
    "carrinho_para_checkout": "carrinho-para-checkout",
    "checkout_para_compra": "checkout-para-compra",
    "contato_para_qualificacao": "contato-para-qualificacao",
    "qualificacao_para_proposta": "qualificacao-para-proposta",
    "proposta_para_negociacao": "proposta-para-negociacao",
    "negociacao_para_fechamento": "negociacao-para-fechamento",
    "lead_para_reuniao": "lead-para-reuniao",
    "reuniao_para_proposta": "reuniao-para-proposta",
    "interessado_para_inscrito": "interessado-para-inscrito",
    "inscrito_para_matriculado": "inscrito-para-matriculado",
    "primeiro_contato_para_diagnostico": "primeiro-contato-para-diagnostico",
    "diagnostico_para_proposta": "diagnostico-para-proposta",
    "proposta_para_fechamento": "proposta-para-fechamento"
  };

  const stageGaps = [];
  let worstStageLabel = null;
  let worstStageUserRate = null;
  let worstStageBenchmarkRate = null;
  let maxAbsoluteGap = -1; 

  benchmarkStageKeys.forEach(benchmarkStageKey => {
    const formStageKey = benchmarkToFormKeyMapping[benchmarkStageKey] || benchmarkStageKey.replace(/_/g, '-');
    const userRateValueString = formData[formStageKey];

    if (formData.hasOwnProperty(formStageKey) && userRateValueString !== null && String(userRateValueString).trim() !== "" && !isNaN(parseFloat(userRateValueString))) {
      const userRate = parseFloat(userRateValueString);
      const benchmarkRate = benchmarkRates[benchmarkStageKey];

      if (typeof benchmarkRate !== "undefined" && benchmarkRate >= 0) {
        const gap = benchmarkRate - userRate; 
        
        let stageLabel = formStageKey; 
        if (window.APP && APP.config && APP.config.inputs && APP.config.inputs[formStageKey] && APP.config.inputs[formStageKey].element && APP.config.inputs[formStageKey].element.labels && APP.config.inputs[formStageKey].element.labels.length > 0) {
          stageLabel = APP.config.inputs[formStageKey].element.labels[0].textContent.replace(":", "").trim();
        } else {
          // Tenta obter o label de um input que não está em APP.config.inputs (inputs dinâmicos)
          const dynamicInput = document.getElementById(formStageKey);
          if (dynamicInput && dynamicInput.labels && dynamicInput.labels.length > 0) {
            stageLabel = dynamicInput.labels[0].textContent.replace(":", "").trim();
          } else {
            stageLabel = formStageKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          }
        }

        stageGaps.push({
          stage: stageLabel,
          userRate: userRate,
          benchmarkRate: benchmarkRate,
          gap: gap, 
        });

        if (gap > maxAbsoluteGap) { 
          maxAbsoluteGap = gap;
          worstStageLabel = stageLabel;
          worstStageUserRate = userRate;
          worstStageBenchmarkRate = benchmarkRate;
        }
      }
    }
  });

  return {
    stageGaps,
    worstStage: worstStageLabel,
    worstStageUser: worstStageUserRate,
    worstStageBenchmark: worstStageBenchmarkRate
  };
};

APP.calculations.calculateDecisionCycleImpact = function(formData, sectorBenchmark) {
  if (!formData.includeDecisionCycle || !sectorBenchmark || !sectorBenchmark.ciclo_decisao_dias) {
    return null;
  }
  const currentCycle = parseFloat(formData["current-cycle"]);
  if (isNaN(currentCycle) || currentCycle <= 0) {
    return null;
  }

  let benchmarkCycleCategory = formData.saleType || "transacional"; 
  
  let benchmarkCycleRange = sectorBenchmark.ciclo_decisao_dias[benchmarkCycleCategory];
  
  if (!benchmarkCycleRange || benchmarkCycleRange.length < 1) { 
    const fallbackCategory = Object.keys(sectorBenchmark.ciclo_decisao_dias)[0];
    if (fallbackCategory && sectorBenchmark.ciclo_decisao_dias[fallbackCategory] && sectorBenchmark.ciclo_decisao_dias[fallbackCategory].length > 0) {
        benchmarkCycleCategory = fallbackCategory;
        benchmarkCycleRange = sectorBenchmark.ciclo_decisao_dias[fallbackCategory];
    } else {
        return { currentCycle: currentCycle, benchmarkCycleDays: "N/A", benchmarkCycleCategory: benchmarkCycleCategory, cycleGapDays: "N/A", cycleImpactPercentage: "N/A" };
    }
  }

  const benchmarkCycleDays = benchmarkCycleRange.length > 1 ? benchmarkCycleRange[1] : benchmarkCycleRange[0];
  const cycleGapDays = currentCycle - benchmarkCycleDays;
  let cycleImpactPercentage = 0;

  if (benchmarkCycleDays > 0) {
    cycleImpactPercentage = (cycleGapDays / benchmarkCycleDays) * 100;
  }

  return {
    currentCycle: currentCycle,
    benchmarkCycleDays: benchmarkCycleDays,
    benchmarkCycleCategory: benchmarkCycleCategory, 
    cycleGapDays: cycleGapDays,
    cycleImpactPercentage: cycleImpactPercentage.toFixed(2),
  };
};
