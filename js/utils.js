// Garante que o namespace APP exista
window.APP = window.APP || {};
APP.utils = {};

// Extrai texto de uma string HTML (usado para limpar dados para o PDF, por exemplo)
APP.utils.extractTextAndStyle = function(htmlString) {
  if (typeof htmlString !== 'string') return '';
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  return div.textContent || div.innerText || "";
};
// Adicionar ao final do arquivo utils.js

/**
 * Formata um valor numérico para o formato monetário brasileiro (R$)
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda (ex: R$ 107.000,00)
 */
APP.utils.formatCurrency = function(value) {
  // Garantir que o valor seja tratado como número
  const numValue = parseFloat(value);
  
  // Verificar se é um número válido
  if (isNaN(numValue)) {
      return "R$ 0,00";
  }
  
  // Usar toLocaleString para formatação consistente
  return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
  });
};