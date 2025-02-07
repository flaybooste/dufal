import * as XLSX from "xlsx";

export function exportarParaExcel(dadosFiltrados) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(dadosFiltrados);


  XLSX.utils.book_append_sheet(workbook, worksheet, "Notas Fiscais");
  XLSX.writeFile(workbook, "notas_fiscais.xlsm", { bookType: "xlsm" });
}
