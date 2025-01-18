import { defineStore } from "pinia";
import * as XLSX from "xlsx";
import { diFal } from "@/utils/difalUtils";

export const usePlanilhaStore = defineStore("planilha", {
  state: () => ({
    colunas: [],
    dados: [],
    linhasDiferentesRJ: [], // Lista de linhas com UF_Emit !== "RJ"
  }),
  getters:{

  },
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

        // A primeira linha contém os nomes das colunas
        this.colunas = dadosJSON[0];

        // Processar as linhas em tempo real
        const processarLinha = async (linha, index) => {
          const dadosLinha = linha.reduce((acc, valor, colIndex) => {
            acc[this.colunas[colIndex]] = valor;
            return acc;
          }, {});

          // Verificar UF_Emit
          if (dadosLinha["UF_Emit"] && dadosLinha["UF_Emit"] !== "RJ") {
            this.tratarUfEmitDiferenteRJ(dadosLinha); // Gatilho
          }

          this.dados.push(dadosLinha); // Atualiza os dados no estado atual
        };

        // Iterar sobre as linhas (excluindo o cabeçalho)
        dadosJSON.slice(1).forEach((linha, index) => {
          setTimeout(() => {
            processarLinha(linha, index); // Processa a linha em tempo real
          }, 0); // Executa sem bloquear o loop
        });
      };

      leitor.onerror = (e) => {
        console.error("Erro ao ler o arquivo:", e);
        throw new Error("Erro ao processar o arquivo.");
      };

      leitor.readAsBinaryString(arquivo);
    },
    tratarUfEmitDiferenteRJ(linha) {
      // Adiciona a linha à lista de linhas com UF_Emit diferente de "RJ"
      this.linhasDiferentesRJ.push(linha);
    },
    getNotasPorEstado(estado) {
      return this.dados.filter((registro) => registro["UF_Emit"] === estado);
    },
    limparDados() {
      this.colunas = [];
      this.dados = [];
      this.linhasDiferentesRJ = []; // Limpa as linhas com UF_Emit !== "RJ"
    },
  },
});
