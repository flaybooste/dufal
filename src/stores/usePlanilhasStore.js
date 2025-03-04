import { defineStore } from "pinia";
import * as XLSX from "xlsx";
import { calcularDifal, checkNCM } from "@/utils/difalUtils";
import { exportarParaExcel } from "@/services/ExcelService";
import axios from "axios";

export const usePlanilhaStore = defineStore("planilha", {
  state: () => ({
    colunas: [],
    dados: [],
    linhasDiferentesRJ: [], // Lista de linhas com UF_Emit !== "RJ"
    prodDifal: [],
    totDifal: 0,
    totFCP: 0,
  }),
  getters: {
    totalDifal(state) {
      return parseFloat(state.totDifal);
    },
    totalFCP(state) {
      return parseFloat(state.totFCP);
    },
  },
  actions: {
    async carregarPlanilha(arquivo) {
      if (!arquivo) throw new Error("Arquivo não encontrado");

      const leitor = new FileReader();

      leitor.onload = (e) => {
        const arrayBuffer = e.target.result;
        const dadosBinarios = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(dadosBinarios, { type: "array", raw: true });
        const primeiraPlanilha = workbook.SheetNames[0];
        const planilha = workbook.Sheets[primeiraPlanilha];
        const dadosJSON = XLSX.utils.sheet_to_json(planilha, { header: 1 });
        // A primeira linha contém os nomes das colunas
        this.colunas = dadosJSON[0];

        const processarLinha = async (linha, index) => {
          const dadosLinha = linha.reduce((acc, valor, colIndex) => {
            acc[this.colunas[colIndex]] = valor;
            return acc;
          }, {});

          // Validate columns

          // Verificar UF_Emit
          if (dadosLinha["UF_Emit"] && dadosLinha["UF_Emit"] !== "RJ") {
            if (
              dadosLinha.ICMS_Base_Calculo != 0 &&
              dadosLinha.ICMS_Base_Calculo != "0"
            ) {
              this.tratarUfEmitDiferenteRJ(dadosLinha); // Gatilho
              if (!checkNCM(String(dadosLinha.NCM))) {
                let temp = calcularDifal(
                  parseFloat(dadosLinha.ICMS_Base_Calculo),
                  parseFloat(dadosLinha.ICMS_Percentual) / 100
                );
                this.totDifal += parseFloat(temp[0]);
                this.totFCP += parseFloat(temp[1]);
                let objeto = {
                  nome: dadosLinha.Produto,
                  ncm: dadosLinha.NCM,
                  valor: dadosLinha.Valor_Produto,
                  base_dupla: temp[2],
                  difal: temp[0],
                  fcp: temp[1],
                  nf: dadosLinha.Numero,
                  chave: dadosLinha.Chave,
                  PDF:
                    "https://cofre.sieg.com/gerardanfe?nfe=" + dadosLinha.Chave,
                };
                this.prodDifal.push(objeto);
              }
            } else {
              this.tratarUfEmitDiferenteRJ(dadosLinha); // Gatilho
              if (!checkNCM(String(dadosLinha.NCM))) {
                let temp = calcularDifal(
                  parseFloat(dadosLinha.Valor_Produto),
                  parseFloat(0.12)
                );
                this.totDifal += parseFloat(temp[0]);
                this.totFCP += parseFloat(temp[1]);
                let objeto = {
                  nome: dadosLinha.Produto,
                  ncm: dadosLinha.NCM,
                  valor: dadosLinha.Valor_Produto,
                  base_dupla: temp[2],
                  difal: temp[0],
                  fcp: temp[1],
                  nf: dadosLinha.Numero,
                  chave: dadosLinha.Chave,
                  PDF:
                    "https://cofre.sieg.com/gerardanfe?nfe=" + dadosLinha.Chave,
                };
                this.prodDifal.push(objeto);
              }
            }
          }

          this.dados.push(dadosLinha); // Atualiza os dados no estado atual
        };

        // Iterar sobre as linhas (excluindo o cabeçalho)
        dadosJSON.slice(1).forEach(async (linha, index) => {
          await processarLinha(linha, index); // Processa a linha em tempo real
        });
      };

      leitor.onerror = (e) => {
        console.error("Erro ao ler o arquivo:", e);
        throw new Error("Erro ao processar o arquivo.");
      };
      leitor.readAsArrayBuffer(arquivo);
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
      this.prodDifal = [];
      this.totDifal = 0;
      this.totFCP = 0;
    },
    incrementDifal(valorDifal) {
      this.totDifal = this.totDifal + parseFloat(valorDifal);
    },
    incrementFCP(valorFcp) {
      this.totFCP = this.totFCP + parseFloat(valorFcp);
    },
    exportExcelDifal() {
      exportarParaExcel(this.prodDifal);
    },
    async enviarDadosParaServidor() {
      try {
        const response = await axios.post(
          "http://dufal.tech/api/v1/ins_nf",
          {
            linhasDiferentesRJ: this.linhasDiferentesRJ,
          }
        );
        console.log("Dados enviados com sucesso:", response.data);
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
      }
    },
  },
});
