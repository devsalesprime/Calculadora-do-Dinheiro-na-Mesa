// Garante que o namespace APP exista
window.APP = window.APP || {};
APP.pdf = APP.pdf || {};

APP.pdf.generateAndDownloadReport = function () {
  const { jsPDF } = window.jspdf; // jsPDF é carregado via CDN
  const html2canvas = window.html2canvas; // html2canvas é carregado via CDN

  if (!jsPDF || !html2canvas) {
    console.error("jsPDF ou html2canvas não estão carregados.");
    alert("Erro: As bibliotecas para gerar PDF não foram carregadas corretamente.");
    return;
  }

  // Elemento que contém todo o conteúdo a ser impresso no PDF
  // O usuário mencionou que a seção de resultados tem id="results"
  const elementToCapture = document.getElementById("results");

  if (!elementToCapture) {
    console.error("Elemento #results não encontrado para gerar o PDF.");
    alert("Erro: Não foi possível encontrar a seção de resultados para gerar o PDF.");
    return;
  }

  // Ocultar o botão de download para não aparecer no PDF
  const downloadButton = document.getElementById("download-pdf-btn");
  let originalDisplayButton = "";
  if (downloadButton) {
    originalDisplayButton = downloadButton.style.display;
    downloadButton.style.display = "none";
  }

  // Mostrar a seção de resultados se estiver oculta (ela é oculta inicialmente)
  // e garantir que ela esteja visível para captura correta pelo html2canvas
  const resultsSectionVisible = elementToCapture.style.display !== "none";
  if (!resultsSectionVisible) {
    elementToCapture.style.display = "block";
  }

  console.log("Iniciando captura do HTML para PDF...");

  html2canvas(elementToCapture, {
    scale: 2, // Aumenta a resolução da captura
    useCORS: true, // Para carregar imagens de outras origens, se houver
    logging: true,
    onclone: (documentClone) => {
        // Pode ser útil para aplicar estilos específicos apenas para a captura do PDF
        // Por exemplo, garantir que todos os elementos estejam visíveis
        // ou que fontes específicas sejam usadas.
        // Neste caso, vamos garantir que a seção de resultados esteja visível no clone.
        const clonedResults = documentClone.getElementById("results");
        if (clonedResults) {
            clonedResults.style.display = "block";
        }
    }
  })
    .then((canvas) => {
      console.log("Captura do HTML concluída. Gerando PDF...");
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait", // p ou portrait
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular a proporção da imagem para caber na página A4
      // Mantendo uma pequena margem
      const margin = 10; // Margem de 10mm
      const availableWidth = pdfWidth - 2 * margin;
      const availableHeight = pdfHeight - 2 * margin;

      let newImgWidth = imgProps.width;
      let newImgHeight = imgProps.height;
      const ratio = imgProps.width / imgProps.height;

      if (imgProps.width > availableWidth) {
        newImgWidth = availableWidth;
        newImgHeight = newImgWidth / ratio;
      }

      if (newImgHeight > availableHeight) {
        newImgHeight = availableHeight;
        newImgWidth = newImgHeight * ratio;
      }
      
      // Centralizar a imagem
      const x = (pdfWidth - newImgWidth) / 2;
      const y = margin; // Começa após a margem superior

      pdf.addImage(imgData, "PNG", x, y, newImgWidth, newImgHeight);
      pdf.save("Relatorio_Calculadora_Performance.pdf");
      console.log("PDF gerado e download iniciado.");

      // Restaurar a visibilidade do botão e da seção de resultados
      if (downloadButton) {
        downloadButton.style.display = originalDisplayButton;
      }
      if (!resultsSectionVisible) {
        elementToCapture.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Erro ao gerar PDF com html2canvas:", error);
      alert("Ocorreu um erro ao tentar gerar o relatório em PDF. Verifique o console para mais detalhes.");
      // Restaurar a visibilidade do botão e da seção de resultados em caso de erro
      if (downloadButton) {
        downloadButton.style.display = originalDisplayButton;
      }
      if (!resultsSectionVisible) {
        elementToCapture.style.display = "none";
      }
    });
};

