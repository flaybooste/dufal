import { defineStore } from 'pinia';
import * as XLSX from 'xlsx';

export const usePlanilhaStore = defineStore('planilha', {
  state: () => ({
    colunas: [],
    dados: [],
  }),
  actions: {
    async carregarPlanilha(file) {
      if (!file) return;

      const leitor = new FileReader();

      leitor.onload = (e) => {
        const dadosBinarios = e.target.result;
        const workbook = XLSX.read(dadosBinarios, { type: 'binary' });

        // Ler a primeira planilha
        const primeiraPlanilha = workbook.SheetNames[0];
        const planilha = workbook.Sheets[primeiraPlanilha];

        // Converter os dados da planilha em JSON
        const dadosJSON = XLSX.utils.sheet_to_json(planilha, { header: 1 });

        // A primeira linha contém os nomes das colunas
        this.colunas = dadosJSON[0];

        // As linhas seguintes contêm os dados
        this.dados = dadosJSON.slice(1).map((linha) =>
          linha.reduce((acc, valor, index) => {
            acc[this.colunas[index]] = valor;
            return acc;
          }, {})
        );
      };

      leitor.readAsBinaryString(file);
    },
    limparDados() {
      this.colunas = [];
      this.dados = [];
    },
  },
});
