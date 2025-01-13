import { defineStore } from "pinia";
import * as XLSX from "xlsx";

export const usePlanilhaStore = defineStore("planilha", {
  state: () => ({
    colunas: [],
    dados: [],
  }),
  actions: {
    async carregarPlanilha(arquivo) {
      if (!arquivo) throw new Error("Arquivo não encontrado");

      const leitor = new FileReader();

      leitor.onload = (e) => {
        const dadosBinarios = e.target.result;
        const workbook = XLSX.read(dadosBinarios, { type: "binary" });
        const primeiraPlanilha = workbook.SheetNames[0];
        const planilha = workbook.Sheets[primeiraPlanilha];
        const dadosJSON = XLSX.utils.sheet_to_json(planilha, { header: 1 });

        this.colunas = dadosJSON[0];
        this.dados = dadosJSON.slice(1).map((linha) =>
          linha.reduce((acc, valor, index) => {
            acc[this.colunas[index]] = valor;
            return acc;
          }, {})
        );
      };

      leitor.readAsBinaryString(arquivo);
    },
    getNotasPorEstado(estado) {
      return this.dados.filter((registro) => registro["UF_Emit"] === estado);
    },
    limparDados() {
      this.colunas = [];
      this.dados = [];
    },
  },
});
