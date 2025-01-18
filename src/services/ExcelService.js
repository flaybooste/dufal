import * as XLSX from "xlsx";
import { validarNCM, validarCFOP } from "@/utils/ValidationUtils";

export function exportarParaExcel(dadosFiltrados) {
  const workbook = XLSX.utils.book_new();
  const worksheetData = criarDadosWorksheet(dadosFiltrados);

  if (worksheetData.length === 1) {
    alert("Nenhum dado válido para exportar!");
    return;
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Notas Fiscais");

  XLSX.writeFile(workbook, "notas_fiscais.xlsm", { bookType: "xlsm" });
}

function criarDadosWorksheet(dadosFiltrados) {
  const worksheetData = [
    [
      "CPF/CNPJ",
      "Razão Social",
      "UF",
      "Município",
      "Endereço",
      "Número Documento",
      "Série",
      "Data",
      "Situação",
      "CFOP",
      "Valor Produtos",
      "Valor Contábil",
      "Código do Item",
      "Quantidade",
      "Valor Unitário",
    ],
  ];

  dadosFiltrados.forEach((nf) => {
    nf.produtos.forEach((produto) => {
        worksheetData.push([
          nf.emitente.CNPJ,
          nf.emitente.xNome,
          nf.emitente.enderEmit.UF,
          nf.emitente.enderEmit.xMun,
          nf.emitente.enderEmit.xLgr,
          nf.numero,
          nf.serie,
          nf.data,
          nf.situacao,
          produto.prod.CFOP,
          produto.prod.vProd,
          nf.totais.vNF,
          produto.prod.cProd,
          produto.prod.qCom,
          produto.prod.vUnCom,
        ]);
    });
  });

  return worksheetData;
}
