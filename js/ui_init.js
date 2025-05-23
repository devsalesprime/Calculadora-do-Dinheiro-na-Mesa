// Garante que o namespace APP exista
window.APP = window.APP || {};
APP.ui = APP.ui || {};
APP.config = APP.config || {};
APP.state = APP.state || {};
APP.data = APP.data || {}; // Para armazenar dados do formulário e resultados
APP.pdfData = APP.pdfData || {}; // Para dados específicos do PDF

// Descrições dos tipos de venda (integrado aqui)
APP.config.saleTypeDescriptions = {
  transacional:
    "Até R$ 15 mil (Ciclo curto, baixo envolvimento consultivo, menor número de decisores)",
  consultivo_medio_valor:
    "De R$ 15 mil a R$ 80 mil (Envolve diagnóstico, múltiplos decisores, maior análise de ROI)",
  consultivo_alto_valor:
    "De R$ 80 mil a R$ 300 mil (Processo estruturado, geralmente requer demonstrações, estudos de caso, e comitê de compras)",
  enterprise:
    "Acima de R$ 300 mil (Alto grau de personalização, contratos longos, múltiplas etapas, envolvimento do C-level)",
};

// Faixas de ticket para pré-seleção do tipo de venda
APP.config.ticketRangesForSaleType = {
  transacional: { min: 0, max: 15000 },
  consultivo_medio_valor: { min: 15001, max: 80000 },
  consultivo_alto_valor: { min: 80001, max: 300000 },
  enterprise: { min: 300001, max: Infinity },
};
// Adicione esta função no início do arquivo (fora do DOMContentLoaded)
function setupViewGuideButton() {
    const viewGuideBtn = document.getElementById('view-guide-btn');
    
    if (viewGuideBtn) {
        viewGuideBtn.addEventListener('click', function() {
            // Obter os valores dos resultados
            const moneyOnTable = parseFloat(
              document.getElementById('wasted-revenue').textContent
                  .replace('R$', '')
                  .replace('.', '')
                  .replace(',', '.')
                  .trim()
          ) || 0;
                      
            const currentConversion = parseFloat(
                document.getElementById('current-conversion-display').textContent
                    .replace('%', '')
                    .replace(',', '.')
                    .trim()
            ) || 0;
            
            const benchmarkConversion = parseFloat(
                document.getElementById('benchmark-conversion-display').textContent
                    .replace('%', '')
                    .replace(',', '.')
                    .trim()
            ) || 0;

            // Determinar a categoria
            let category = 'baixo_impacto';
            if (moneyOnTable > 100000) {
                category = 'alto_impacto';
            } else if (moneyOnTable > 50000) {
                category = 'medio_impacto';
            }

            // Redirecionar para a página de guia
            window.location.href = `results_guide.html?money=${moneyOnTable}&conversion=${currentConversion}&benchmark=${benchmarkConversion}&category=${category}`;
        });
    }
}

// Dentro do DOMContentLoaded, adicione esta linha no final:
document.addEventListener('DOMContentLoaded', function() {
    // ... todo o código existente ...
    
    // Adicionar o evento ao botão quando os resultados são calculados
  if (document.querySelector('seletor-do-formulário')) {
    if (APP.ui.elements.form) {
        APP.ui.elements.form.addEventListener("submit", function(e) {
            // ... código existente do submit ...
            
            // Depois de mostrar os resultados, configurar o botão
            if(APP.ui.elements.resultsSection) {
                APP.ui.elements.resultsSection.style.display = "block";
                setupViewGuideButton(); // Adiciona o evento ao botão
                APP.ui.elements.resultsSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // Referências aos elementos DOM
  APP.ui.elements = {
    currentYear: document.getElementById("current-year"),
    form: document.getElementById("calculator-form"),
    resultsSection: document.getElementById("results"),
    conversionTypeSelect: document.getElementById("conversion-type"),
    totalConversionGroup: document.getElementById("total-conversion-group"),
    stagesInputsDiv: document.getElementById("stages-inputs"),
    stageAnalysisDiv: document.getElementById("stage-analysis"),
    stageGapListDiv: document.getElementById("stage-gap-list"),
    worstStageInfoDiv: document.getElementById("worst-stage-info"),
    includeDecisionCycleCheckbox: document.getElementById("include-decision-cycle"),
    decisionCycleFields: document.getElementById("decision-cycle-fields"),
    decisionCycleResultsDiv: document.getElementById("decision-cycle-results"),
    downloadPdfButton: document.getElementById("download-pdf-btn"),
    steps: Array.from(document.querySelectorAll(".form-step")),
    nextButtons: Array.from(document.querySelectorAll(".next-step")),
    prevButtons: Array.from(document.querySelectorAll(".prev-step")),
    calculateButton: document.getElementById("calculate-btn"),

    resultCompanyName: document.getElementById("result-company-name"),
    resultContactName: document.getElementById("result-contact-name"),
    resultEmail: document.getElementById("result-email"),
    resultWhatsapp: document.getElementById("result-whatsapp"),
    resultUserConversionRate: document.getElementById("result-user-conversion-rate") || document.getElementById("current-conversion-display"),
    resultClients: document.getElementById("result-clients"),
    resultRevenue: document.getElementById("result-revenue") || document.getElementById("current-revenue"),
    resultBenchmarkConversionRate: document.getElementById("result-benchmark-conversion-rate") || document.getElementById("benchmark-conversion-display"),
    resultPotentialRevenue: document.getElementById("result-potential-revenue") || document.getElementById("potential-revenue"),
    resultRevenueGap: document.getElementById("result-revenue-gap") || document.getElementById("wasted-revenue"),
    resultWorstStage: document.getElementById("result-worst-stage"),
    logoPreview: document.getElementById("logo-preview"),

    saleTypeDisplayResult: document.getElementById("sale-type-display"),
    currentCycleValueResult: document.getElementById("current-cycle-value"),
    benchmarkCycleRangeResult: document.getElementById("benchmark-cycle-range"),
    cycleComparisonTextResult: document.getElementById("cycle-comparison-text"),

    saleTypeSelectInput: document.getElementById("sale-type"),
    saleTypeDescriptionDiv: document.getElementById("sale-type-description"),

    revenueProgress: document.getElementById("revenue-progress"),
    conversionProgress: document.getElementById("conversion-progress"),
    wasteProgress: document.getElementById("waste-progress"),
    capturePercentageText: document.getElementById("capture-percentage"),
    wastePercentageText: document.getElementById("waste-percentage"),

    conversionGapSpan: document.getElementById("conversion-gap"),
    conversionComparisonSpan: document.getElementById("conversion-comparison")
  };

  APP.config.inputs = {
    "company-name": { element: document.getElementById("company-name"), errorElement: document.getElementById("company-name-error"), validator: (val) => val.trim() !== "", step: 0, required: true },
    "contact-name": { element: document.getElementById("contact-name"), errorElement: document.getElementById("contact-name-error"), validator: (val) => val.trim() !== "", step: 0, required: true },
    email: { element: document.getElementById("email"), errorElement: document.getElementById("email-error"), validator: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), step: 0, required: true },
    whatsapp: { element: document.getElementById("whatsapp"), errorElement: document.getElementById("whatsapp-error"), validator: (val) => /^\d{10,15}$/.test(val.replace(/\D/g, "")), step: 0, required: true },
    sector: { element: document.getElementById("sector"), errorElement: document.getElementById("sector-error"), validator: (val) => val !== "", step: 1, required: true },
    traffic: { element: document.getElementById("traffic"), errorElement: document.getElementById("traffic-error"), validator: (val) => parseFloat(val) > 0, step: 1, required: true },
    ticket: { element: document.getElementById("ticket"), errorElement: document.getElementById("ticket-error"), validator: (val) => parseFloat(val) > 0, step: 1, required: true },
    "conversion-rate": { element: document.getElementById("conversion-rate"), errorElement: document.getElementById("conversion-rate-error"), validator: (val) => val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100), step: 2, required: () => APP.ui.elements.conversionTypeSelect.value === "total" },
    "lead-to-mql": { element: document.getElementById("lead-to-mql"), errorElement: document.getElementById("lead-to-mql-error"), validator: (val) => val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100), step: 2, required: false },
    "mql-to-sql": { element: document.getElementById("mql-to-sql"), errorElement: document.getElementById("mql-to-sql-error"), validator: (val) => val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100), step: 2, required: false },
    "sql-to-opportunity": { element: document.getElementById("sql-to-opportunity"), errorElement: document.getElementById("sql-to-opportunity-error"), validator: (val) => val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100), step: 2, required: false },
    "opportunity-to-client": { element: document.getElementById("opportunity-to-client"), errorElement: document.getElementById("opportunity-to-client-error"), validator: (val) => val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100), step: 2, required: false },
    "current-cycle": { element: document.getElementById("current-cycle"), errorElement: document.getElementById("current-cycle-error"), validator: (val) => val === "" || parseFloat(val) > 0, step: 3, required: () => APP.ui.elements.includeDecisionCycleCheckbox.checked },
    "visitante-para-carrinho": { element: document.getElementById("visitante-para-carrinho"), errorElement: document.getElementById("visitante-para-carrinho-error"), validator: (val) => val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100), step: 2, required: false },
    "carrinho-para-checkout": { element: document.getElementById("carrinho-para-checkout"), errorElement: document.getElementById("carrinho-para-checkout-error"), validator: (val) => val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100), step: 2, required: false },
    "checkout-para-compra": { element: document.getElementById("checkout-para-compra"), errorElement: document.getElementById("checkout-para-compra-error"), validator: (val) => val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100), step: 2, required: false }
  };

  APP.state.currentStep = 0;

  if (APP.ui.elements.currentYear) {
    APP.ui.elements.currentYear.textContent = new Date().getFullYear();
  }

  APP.ui.updateStepVisibility = function() {
    APP.ui.elements.steps.forEach((step, index) => {
      step.style.display = index === APP.state.currentStep ? "block" : "none";
      step.classList.toggle("step-active", index === APP.state.currentStep);
    });
    if (APP.ui.elements.calculateButton) {
        APP.ui.elements.calculateButton.style.display = APP.state.currentStep === APP.ui.elements.steps.length - 1 ? "block" : "none";
    }
    APP.ui.elements.nextButtons.forEach(btn => btn.style.display = APP.state.currentStep === APP.ui.elements.steps.length - 1 ? "none" : "inline-block");
    APP.ui.elements.prevButtons.forEach(btn => btn.style.display = APP.state.currentStep === 0 ? "none" : "inline-block");
  };

  APP.ui.elements.nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (APP.validations.validateCurrentStepFields()) {
        if (APP.state.currentStep < APP.ui.elements.steps.length - 1) {
          APP.state.currentStep++;
          APP.ui.updateStepVisibility();
        }
      }
    });
  });

  APP.ui.elements.prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (APP.state.currentStep > 0) {
        APP.state.currentStep--;
        APP.ui.updateStepVisibility();
      }
    });
  });

  Object.keys(APP.config.inputs).forEach((id) => {
    const inputConfig = APP.config.inputs[id];
    if (inputConfig.element) {
      inputConfig.element.addEventListener("input", () => {
        APP.validations.validateInput(id);
        // Se o campo de ticket for alterado, tenta pré-selecionar o tipo de venda
        if (id === "ticket") {
          APP.ui.preselectSaleTypeByTicket(inputConfig.element.value);
        }
      });
    }
  });

  // Função para pré-selecionar o tipo de venda com base no ticket
  APP.ui.preselectSaleTypeByTicket = function(ticketValue) {
    const ticket = parseFloat(String(ticketValue).replace(/[^\d.-]/g, '')); // Limpa e converte para número
    if (isNaN(ticket) || !APP.ui.elements.saleTypeSelectInput) {
      return;
    }

    let selectedSaleType = APP.ui.elements.saleTypeSelectInput.value; // Mantém o valor atual como padrão

    for (const type in APP.config.ticketRangesForSaleType) {
      const range = APP.config.ticketRangesForSaleType[type];
      if (ticket >= range.min && ticket <= range.max) {
        selectedSaleType = type;
        break;
      }
    }
    
    // Só atualiza se o tipo de venda calculado for diferente do atual, para evitar loops ou sobrescrever seleção manual desnecessariamente
    // Ou se o usuário ainda não interagiu com o campo (a ser implementado se necessário)
    if (APP.ui.elements.saleTypeSelectInput.value !== selectedSaleType) {
        APP.ui.elements.saleTypeSelectInput.value = selectedSaleType;
        // Dispara o evento change para atualizar a descrição e outros listeners
        const event = new Event('change', { bubbles: true });
        APP.ui.elements.saleTypeSelectInput.dispatchEvent(event);
    }
  };

  if (APP.ui.elements.conversionTypeSelect) {
    APP.ui.elements.conversionTypeSelect.addEventListener("change", (e) => {
      const isTotal = e.target.value === "total";
      APP.ui.elements.totalConversionGroup.style.display = isTotal ? "block" : "none";
      APP.ui.elements.stagesInputsDiv.style.display = isTotal ? "none" : "block";
      APP.config.inputs["conversion-rate"].required = isTotal;
      if (isTotal) {
        APP.config.inputs["conversion-rate"].element.value = "";
        APP.validations.validateInput("conversion-rate");
        APP.validations.clearStageInputsErrorsAndValues();
      } else {
        APP.config.inputs["conversion-rate"].element.value = "";
        APP.config.inputs["conversion-rate"].element.classList.remove("is-invalid");
        if (APP.config.inputs["conversion-rate"].errorElement) {
          APP.config.inputs["conversion-rate"].errorElement.style.display = "none";
        }
      }
      if(APP.config.inputs.sector.element) APP.ui.updateFunnelFieldsVisibility(APP.config.inputs.sector.element.value);
    });
  }

  if (APP.ui.elements.includeDecisionCycleCheckbox) {
    APP.ui.elements.includeDecisionCycleCheckbox.addEventListener("change", (e) => {
      APP.ui.elements.decisionCycleFields.style.display = e.target.checked ? "block" : "none";
      APP.config.inputs["current-cycle"].required = e.target.checked;
      if (!e.target.checked) {
        APP.config.inputs["current-cycle"].element.value = "";
        APP.validations.validateInput("current-cycle");
      }
    });
  }
  
  APP.ui.updateFunnelFieldsVisibility = function(selectedSector) {
    const allFunnelGroups = document.querySelectorAll(".funnel-fields-group");
    allFunnelGroups.forEach(group => group.style.display = "none");
    if (APP.ui.elements.conversionTypeSelect && APP.ui.elements.conversionTypeSelect.value === "stages") {
        const sectorFunnelId = "funnel-" + selectedSector.toLowerCase().replace(/\s+/g, "-");
        const specificFunnelGroup = document.getElementById(sectorFunnelId);
        if (specificFunnelGroup) {
            specificFunnelGroup.style.display = "block";
        } else {
            const defaultFunnelGroup = document.getElementById("funnel-saas"); 
            if (defaultFunnelGroup) defaultFunnelGroup.style.display = "block";
        }
    }
  };

  if (APP.config.inputs.sector.element) {
      APP.config.inputs.sector.element.addEventListener("change", (e) => {
          APP.ui.updateFunnelFieldsVisibility(e.target.value);
      });
  }

  APP.ui.updateSaleTypeDescription = function() {
    if (APP.ui.elements.saleTypeSelectInput && APP.ui.elements.saleTypeDescriptionDiv) {
      const selectedValue = APP.ui.elements.saleTypeSelectInput.value;
      APP.ui.elements.saleTypeDescriptionDiv.textContent = APP.config.saleTypeDescriptions[selectedValue] || "";
    }
  };

  if (APP.ui.elements.saleTypeSelectInput) {
    APP.ui.elements.saleTypeSelectInput.addEventListener("change", APP.ui.updateSaleTypeDescription);
    // Inicializa a descrição com o valor padrão do select (se houver)
    // A pré-seleção pelo ticket vai chamar isso também via dispatchEvent('change')
    APP.ui.updateSaleTypeDescription(); 
  }

  if (APP.ui.elements.form) {
    APP.ui.elements.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!APP.validations.validateCurrentStepFields()) {
        if(APP.ui.elements.resultsSection) APP.ui.elements.resultsSection.style.display = "none";
        return;
      }

      APP.data.formData = {};
      for (const id in APP.config.inputs) {
        if (APP.config.inputs[id].element) {
          APP.data.formData[id] = APP.config.inputs[id].element.value;
        }
      }
      if(APP.ui.elements.conversionTypeSelect) APP.data.formData.conversionType = APP.ui.elements.conversionTypeSelect.value;
      if(APP.ui.elements.includeDecisionCycleCheckbox) APP.data.formData.includeDecisionCycle = APP.ui.elements.includeDecisionCycleCheckbox.checked;
      if(APP.ui.elements.saleTypeSelectInput) APP.data.formData.saleType = APP.ui.elements.saleTypeSelectInput.value;

      const selectedSector = APP.data.formData.sector;
      const sectorBenchmark = APP.benchmarkData.setores[selectedSector];

      if (!sectorBenchmark) {
        console.error("Benchmark para o setor selecionado não encontrado:", selectedSector);
        if(APP.ui.elements.resultsSection) APP.ui.elements.resultsSection.style.display = "none";
        return;
      }

      const calculatedResults = APP.calculations.calculateMetrics(APP.data.formData, sectorBenchmark);
      if (!calculatedResults) {
        if(APP.ui.elements.resultsSection) APP.ui.elements.resultsSection.style.display = "none";
        return;
      }

      let stageAnalysis = { stageGaps: [], worstStage: null, worstStageUser: null, worstStageBenchmark: null };
      if (APP.data.formData.conversionType === "stages") {
        stageAnalysis = APP.calculations.analyzeStageGaps(APP.data.formData, sectorBenchmark);
      }

      let decisionCycleImpact = null;
      if (APP.data.formData.includeDecisionCycle) {
        decisionCycleImpact = APP.calculations.calculateDecisionCycleImpact(APP.data.formData, sectorBenchmark);
      }

      if(APP.ui.elements.resultCompanyName) APP.ui.elements.resultCompanyName.textContent = APP.data.formData["company-name"];
      if(APP.ui.elements.resultContactName) APP.ui.elements.resultContactName.textContent = APP.data.formData["contact-name"];
      if(APP.ui.elements.resultEmail) APP.ui.elements.resultEmail.textContent = APP.data.formData.email;
      if(APP.ui.elements.resultWhatsapp) APP.ui.elements.resultWhatsapp.textContent = APP.data.formData.whatsapp;

      if(APP.ui.elements.resultUserConversionRate) APP.ui.elements.resultUserConversionRate.textContent = calculatedResults.userConversionRate.toFixed(2) + "%";
      if(APP.ui.elements.resultClients) APP.ui.elements.resultClients.textContent = calculatedResults.clients.toFixed(2);
      if(APP.ui.elements.resultRevenue) APP.ui.elements.resultRevenue.textContent = APP.utils.formatCurrency(calculatedResults.revenue);
      if(APP.ui.elements.resultBenchmarkConversionRate) APP.ui.elements.resultBenchmarkConversionRate.textContent = calculatedResults.benchmarkConversionRate.toFixed(2) + "%";
      if(APP.ui.elements.resultPotentialRevenue) APP.ui.elements.resultPotentialRevenue.textContent = APP.utils.formatCurrency(calculatedResults.potentialRevenue);
      if(APP.ui.elements.resultRevenueGap) APP.ui.elements.resultRevenueGap.textContent = APP.utils.formatCurrency(calculatedResults.revenueGap);
      
      if (APP.ui.elements.conversionGapSpan && APP.ui.elements.conversionComparisonSpan) {
        const diff = calculatedResults.userConversionRate - calculatedResults.benchmarkConversionRate;
        const absDiff = Math.abs(diff);
        APP.ui.elements.conversionGapSpan.textContent = absDiff.toFixed(2) + "%";
        if (diff < 0) {
          APP.ui.elements.conversionComparisonSpan.textContent = "abaixo";
        } else if (diff > 0) {
          APP.ui.elements.conversionComparisonSpan.textContent = "acima";
        } else {
          APP.ui.elements.conversionComparisonSpan.textContent = "igual";
        }
      }

      if(APP.ui.elements.stageAnalysisDiv) {
        APP.ui.elements.stageAnalysisDiv.style.display = "none";
        if (stageAnalysis.stageGaps.length > 0) {
          APP.ui.elements.stageAnalysisDiv.style.display = "block";
          if(APP.ui.elements.stageGapListDiv) {
            APP.ui.elements.stageGapListDiv.innerHTML = ""; 
            stageAnalysis.stageGaps.forEach(gap => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `${gap.stage}: <strong>Sua taxa ${gap.userRate.toFixed(2)}%</strong> (Benchmark ${gap.benchmarkRate.toFixed(2)}%) - Gap: <span class="${gap.gap > 0 ? "text-danger" : "text-success"}">${gap.gap.toFixed(2)}%</span>`;
                APP.ui.elements.stageGapListDiv.appendChild(li);
            });
          }
          if (stageAnalysis.worstStage && APP.ui.elements.worstStageInfoDiv) {
            APP.ui.elements.worstStageInfoDiv.innerHTML = `Principal Gargalo: <strong>${stageAnalysis.worstStage}</strong> (Sua taxa: ${stageAnalysis.worstStageUser.toFixed(2)}% vs Benchmark: ${stageAnalysis.worstStageBenchmark.toFixed(2)}%)`;
          } else if (APP.ui.elements.worstStageInfoDiv) {
            APP.ui.elements.worstStageInfoDiv.innerHTML = "";
          }
        } else {
          APP.ui.elements.stageAnalysisDiv.style.display = "none";
          if(APP.ui.elements.stageGapListDiv) APP.ui.elements.stageGapListDiv.innerHTML = "";
          if(APP.ui.elements.worstStageInfoDiv) APP.ui.elements.worstStageInfoDiv.innerHTML = "";
        }
      }

      if(APP.ui.elements.decisionCycleResultsDiv) {
        APP.ui.elements.decisionCycleResultsDiv.style.display = "none";
        if (decisionCycleImpact) {
          APP.ui.elements.decisionCycleResultsDiv.style.display = "block";
          if(APP.ui.elements.saleTypeDisplayResult && decisionCycleImpact.benchmarkCycleCategory) APP.ui.elements.saleTypeDisplayResult.textContent = decisionCycleImpact.benchmarkCycleCategory;
          if(APP.ui.elements.currentCycleValueResult && decisionCycleImpact.currentCycle) APP.ui.elements.currentCycleValueResult.textContent = decisionCycleImpact.currentCycle;
          
          const benchmarkCycleRangeArray = (APP.benchmarkData.setores[selectedSector] && 
                                          APP.benchmarkData.setores[selectedSector].ciclo_decisao_dias && 
                                          APP.benchmarkData.setores[selectedSector].ciclo_decisao_dias[decisionCycleImpact.benchmarkCycleCategory]) 
                                          ? APP.benchmarkData.setores[selectedSector].ciclo_decisao_dias[decisionCycleImpact.benchmarkCycleCategory]
                                          : [decisionCycleImpact.benchmarkCycleDays]; // Fallback se não for array
          
          let benchmarkCycleText = "N/A";
          if (Array.isArray(benchmarkCycleRangeArray)) {
            benchmarkCycleText = benchmarkCycleRangeArray.join("-") + " dias";
          } else if (!isNaN(benchmarkCycleRangeArray)){
            benchmarkCycleText = benchmarkCycleRangeArray + " dias";
          }

          if(APP.ui.elements.benchmarkCycleRangeResult) APP.ui.elements.benchmarkCycleRangeResult.textContent = benchmarkCycleText;

          if(APP.ui.elements.cycleComparisonTextResult) {
            let comparisonText = `Seu ciclo é ${decisionCycleImpact.cycleGapDays} dias `;
            if (parseFloat(decisionCycleImpact.cycleImpactPercentage) > 0) {
                comparisonText += `mais longo que o benchmark (${decisionCycleImpact.cycleImpactPercentage}%).`;
            } else if (parseFloat(decisionCycleImpact.cycleImpactPercentage) < 0) {
                comparisonText += `mais curto que o benchmark (${Math.abs(parseFloat(decisionCycleImpact.cycleImpactPercentage))}%).`;
            } else {
                comparisonText += `igual ao benchmark.`;
            }
            APP.ui.elements.cycleComparisonTextResult.textContent = comparisonText;
          }
        }
      }

      let revenuePercentage = 0;
      if (calculatedResults.potentialRevenue > 0) {
        revenuePercentage = (calculatedResults.revenue / calculatedResults.potentialRevenue) * 100;
      }
      revenuePercentage = Math.max(0, Math.min(revenuePercentage, 100));
      if (APP.ui.elements.revenueProgress) {
        APP.ui.elements.revenueProgress.style.width = revenuePercentage.toFixed(2) + "%";
        APP.ui.elements.revenueProgress.setAttribute("aria-valuenow", revenuePercentage.toFixed(2));
      }

      let conversionPercentage = 0;
      if (calculatedResults.benchmarkConversionRate > 0) {
        conversionPercentage = (calculatedResults.userConversionRate / calculatedResults.benchmarkConversionRate) * 100;
      }
      conversionPercentage = Math.max(0, Math.min(conversionPercentage, 100));
      if (APP.ui.elements.conversionProgress) {
        APP.ui.elements.conversionProgress.style.width = conversionPercentage.toFixed(2) + "%";
        APP.ui.elements.conversionProgress.setAttribute("aria-valuenow", conversionPercentage.toFixed(2));
      }

      let capturePercentageNum = 0;
      let wastePercentageNum = 100;
      if (calculatedResults.potentialRevenue > 0) {
        capturePercentageNum = (calculatedResults.revenue / calculatedResults.potentialRevenue) * 100;
        wastePercentageNum = 100 - capturePercentageNum;
      } else if (calculatedResults.revenue > 0) { 
        capturePercentageNum = 100;
        wastePercentageNum = 0;
      }
      capturePercentageNum = Math.max(0, Math.min(capturePercentageNum, 100));
      wastePercentageNum = Math.max(0, Math.min(wastePercentageNum, 100));

      if (APP.ui.elements.capturePercentageText) {
        APP.ui.elements.capturePercentageText.textContent = capturePercentageNum.toFixed(0) + "%";
      }
      if (APP.ui.elements.wastePercentageText) {
        APP.ui.elements.wastePercentageText.textContent = wastePercentageNum.toFixed(0) + "%";
      }
      if (APP.ui.elements.wasteProgress) {
        APP.ui.elements.wasteProgress.style.width = wastePercentageNum.toFixed(2) + "%";
        APP.ui.elements.wasteProgress.setAttribute("aria-valuenow", wastePercentageNum.toFixed(2));
      }

      if(APP.ui.elements.resultsSection) {
        APP.ui.elements.resultsSection.style.display = "block";
        APP.ui.elements.resultsSection.scrollIntoView({ behavior: "smooth" });
      }

      APP.pdfData.templateData = {
        companyName: APP.data.formData["company-name"],
        contactName: APP.data.formData["contact-name"],
        email: APP.data.formData.email,
        whatsapp: APP.data.formData.whatsapp,
        sector: APP.data.formData.sector,
        traffic: APP.data.formData.traffic,
        ticket: APP.data.formData.ticket,
        userConversionRate: calculatedResults.userConversionRate,
        clients: calculatedResults.clients,
        revenue: calculatedResults.revenue,
        benchmarkConversionRate: calculatedResults.benchmarkConversionRate,
        potentialRevenue: calculatedResults.potentialRevenue,
        revenueGap: calculatedResults.revenueGap,
        stageGaps: stageAnalysis.stageGaps,
        worstStage: stageAnalysis.worstStage,
        worstStageUserRate: stageAnalysis.worstStageUser,
        worstStageBenchmarkRate: stageAnalysis.worstStageBenchmark,
        decisionCycle: decisionCycleImpact,
        logoUrl: APP.ui.elements.logoPreview ? APP.ui.elements.logoPreview.src : "./assets/img/logo-padrao.svg"
      };
      if(APP.data.formData.saleType) APP.pdfData.templateData.saleType = APP.data.formData.saleType;
    });
  }

  if (APP.ui.elements.downloadPdfButton) {
    APP.ui.elements.downloadPdfButton.addEventListener("click", () => {
      if (APP.pdf && typeof APP.pdf.generateAndDownloadReport === 'function') {
        APP.pdf.generateAndDownloadReport();
      } else {
        console.error("Função APP.pdf.generateAndDownloadReport não encontrada.");
        alert("Erro ao tentar gerar PDF: funcionalidade não carregada.");
      }
    });
  }

  APP.ui.updateStepVisibility();
  if (APP.config.inputs.sector.element && APP.ui.elements.conversionTypeSelect) { APP.ui.updateFunnelFieldsVisibility(APP.config.inputs.sector.element.value); }
  if (APP.ui.elements.conversionTypeSelect) APP.ui.elements.conversionTypeSelect.dispatchEvent(new Event('change'));
  if (APP.ui.elements.includeDecisionCycleCheckbox) APP.ui.elements.includeDecisionCycleCheckbox.dispatchEvent(new Event('change'));
  if (APP.ui.elements.saleTypeSelectInput) { APP.ui.updateSaleTypeDescription(); }
  // Inicializa a pré-seleção do tipo de venda caso o ticket já tenha valor no carregamento (pouco provável, mas seguro)
  if (APP.config.inputs.ticket.element) {
    APP.ui.preselectSaleTypeByTicket(APP.config.inputs.ticket.element.value);
  }

});