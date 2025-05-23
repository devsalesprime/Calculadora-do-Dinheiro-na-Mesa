// Garante que o namespace APP exista
window.APP = window.APP || {};

APP.benchmarkData = {
  setores: {
    SaaS: {
      taxa_conversao_total_benchmark: 3.8,
      fonte:
        "Taxa de conversão varia por setor, dispositivo e rede social (mLabs, Outubro 2024)",
      taxas_conversao: {
        lead_para_mql: 20,
        mql_para_sql: 30,
        sql_para_oportunidade: 50,
        oportunidade_para_cliente: 25,
        total_benchmark: 0, 
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    "E-commerce": {
      taxa_conversao_total_benchmark: 3.28,
      fonte:
        "Panorama de Geração de Leads no Brasil 2025 (Leadster, via Agendor - Taxa para B2C em geral)",
      taxas_conversao: {
        visitante_para_carrinho: 10,
        carrinho_para_checkout: 60,
        checkout_para_compra: 70,
        total_benchmark: 0, 
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    Indústria: {
      taxa_conversao_total_benchmark: 3.81,
      fonte:
        "Panorama de Geração de Leads no Brasil 2025 (Leadster, via Agendor)",
      taxas_conversao: {
        contato_para_qualificacao: 25,
        qualificacao_para_proposta: 40,
        proposta_para_negociacao: 60,
        negociacao_para_fechamento: 30,
        total_benchmark: 0, 
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    "Serviços B2B": {
      taxa_conversao_total_benchmark: 2.5,
      fonte:
        "Panorama de Geração de Leads no Brasil 2025 (Leadster, via Agendor - Taxa para B2B em geral)",
      taxas_conversao: {
        lead_para_reuniao: 15,
        reuniao_para_proposta: 50,
        proposta_para_negociacao: 65,
        negociacao_para_cliente: 35,
        total_benchmark: 0, 
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    Educação: {
      taxa_conversao_total_benchmark: 8.4,
      fonte:
        "Taxa de conversão varia por setor, dispositivo e rede social (mLabs, Outubro 2024)",
      taxas_conversao: {
        interessado_para_inscrito: 10,
        inscrito_para_matriculado: 40,
        total_benchmark: 0, 
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    Consultoria: {
      taxa_conversao_total_benchmark: 1.55,
      fonte:
        "Panorama de Geração de Leads no Brasil 2025 (Leadster, via Agendor)",
      taxas_conversao: {
        primeiro_contato_para_diagnostico: 30,
        diagnostico_para_proposta: 60,
        proposta_para_fechamento: 40,
        total_benchmark: 0, 
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
    Saúde: {
      taxa_conversao_total_benchmark: 4.07,
      fonte:
        "Panorama de Geração de Leads no Brasil 2025(Leadster, via Agendor)",
      taxas_conversao: {
        // Para Saúde, o total_benchmark já é fornecido diretamente e não há etapas individuais
        total_benchmark: 4.07,
      },
      ciclo_decisao_dias: {
        transacional: [0, 30],
        consultivo_medio_valor: [31, 90],
        consultivo_alto_valor: [91, 180],
        enterprise: [181, 360],
      },
    },
  },
};

// Calcula o total_benchmark para cada setor, se não estiver definido e houver taxas de conversão por etapa
for (const sector in APP.benchmarkData.setores) {
  const setorAtual = APP.benchmarkData.setores[sector];
  if (
    setorAtual.taxas_conversao && // Verifica se existe o objeto de taxas de conversão
    (setorAtual.taxas_conversao.total_benchmark === 0 || typeof setorAtual.taxas_conversao.total_benchmark === 'undefined') && // Verifica se o total_benchmark é 0 ou indefinido
    Object.keys(setorAtual.taxas_conversao).filter(key => key !== 'total_benchmark').length > 0 // Verifica se há outras chaves além de total_benchmark
  ) {
    let etapas = setorAtual.taxas_conversao;
    let benchmarkTotal = 1;
    let countEtapas = 0;
    for (const etapa in etapas) {
      if (etapa !== "total_benchmark" && etapas[etapa] > 0) {
        benchmarkTotal *= etapas[etapa] / 100;
        countEtapas++;
      }
    }
    if (countEtapas > 0) {
      setorAtual.taxas_conversao.total_benchmark =
        parseFloat((benchmarkTotal * 100).toFixed(2));
    }
  } else if (setorAtual.taxas_conversao && typeof setorAtual.taxas_conversao.total_benchmark !== 'undefined' && Object.keys(setorAtual.taxas_conversao).filter(key => key !== 'total_benchmark').length === 0 && setorAtual.taxa_conversao_total_benchmark) {
    // Caso especial como Saúde, onde o total_benchmark é o único valor em taxas_conversao e também existe taxa_conversao_total_benchmark no nível superior do setor.
    // Garante que o valor em taxas_conversao.total_benchmark seja o mesmo do nível superior, se este existir.
    setorAtual.taxas_conversao.total_benchmark = setorAtual.taxa_conversao_total_benchmark;
  }
}

