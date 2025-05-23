// Garante que o namespace APP exista
window.APP = window.APP || {};
APP.validations = {};

// Valida um campo de input individualmente
// Depende de APP.config.inputs e APP.ui.elements (a serem definidos em ui_init.js)
APP.validations.validateInput = function(inputId) {
  const inputConfig = APP.config.inputs[inputId];
  if (!inputConfig || !inputConfig.element) return true; // Se não houver configuração ou elemento, considera válido

  const value = inputConfig.element.value.trim();
  let isRequired =
    typeof inputConfig.required === "function"
      ? inputConfig.required()
      : inputConfig.required;

  // Limpa classes de erro e mensagens
  inputConfig.element.classList.remove("is-invalid");
  if (inputConfig.errorElement) {
    inputConfig.errorElement.style.display = "none";
  }

  // Validação de campo obrigatório
  if (isRequired && value === "") {
    inputConfig.element.classList.add("is-invalid");
    if (inputConfig.errorElement) {
      inputConfig.errorElement.textContent = "Este campo é obrigatório."; // Mensagem genérica
      inputConfig.errorElement.style.display = "block";
    }
    return false;
  }

  // Validação específica do campo (se não for obrigatório e estiver preenchido, ou se for obrigatório)
  if (value !== "") {
    const numericValue = parseFloat(value);
    // Usa o valor numérico para validação se o tipo for number e o valor for um número válido
    const validationValue =
      inputConfig.element.type === "number" && !isNaN(numericValue)
        ? numericValue
        : value;

    if (!inputConfig.validator(validationValue)) {
      inputConfig.element.classList.add("is-invalid");
      if (inputConfig.errorElement) {
        // Idealmente, a mensagem de erro viria da configuração do input
        inputConfig.errorElement.textContent = "Valor inválido."; // Mensagem genérica
        inputConfig.errorElement.style.display = "block";
      }
      return false;
    }
  }
  return true;
};

// Valida todos os campos da etapa atual do formulário
// Depende de APP.config.inputs e APP.state.currentStep (a serem definidos em ui_init.js)
APP.validations.validateCurrentStepFields = function() {
  let stepIsValid = true;
  if (!APP.config || !APP.config.inputs || typeof APP.state.currentStep === "undefined") {
    console.error("APP.config.inputs ou APP.state.currentStep não estão definidos. Validação da etapa pulada.");
    return false; // Ou true, dependendo de como lidar com a ausência de configuração
  }
  for (const id in APP.config.inputs) {
    if (APP.config.inputs[id].step === APP.state.currentStep) {
      if (!APP.validations.validateInput(id)) {
        stepIsValid = false;
      }
    }
  }
  return stepIsValid;
};

// Limpa os valores e erros dos campos de input de estágios
// Depende de APP.config.inputs (a ser definido em ui_init.js)
APP.validations.clearStageInputsErrorsAndValues = function() {
  if (!APP.config || !APP.config.inputs) {
    console.error("APP.config.inputs não está definido. Limpeza de campos de estágio pulada.");
    return;
  }
  const stageInputIds = [
    "lead-to-mql",
    "mql-to-sql",
    "sql-to-opportunity",
    "opportunity-to-client",
  ];
  stageInputIds.forEach((id) => {
    const inputConfig = APP.config.inputs[id];
    if (inputConfig && inputConfig.element) {
      inputConfig.element.value = "";
      inputConfig.element.classList.remove("is-invalid");
      if (inputConfig.errorElement) {
        inputConfig.errorElement.style.display = "none";
      }
    }
  });
};

