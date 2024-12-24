<template>
  <div>
    <h3>Importar Arquivo de Notas Fiscais</h3>
    <input type="file" @change="processarArquivo" accept=".xlsm, .xlsx, .xls" />
    <p v-if="erro" class="erro">{{ erro }}</p>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      erro: null, // Mensagem de erro caso algo dê errado
    };
  },
  methods: {
    async processarArquivo(event) {
      this.erro = null;

      const arquivo = event.target.files[0];

      if (!arquivo) {
        this.erro = "Nenhum arquivo selecionado.";
        return;
      }

      if (!/\.(xlsm|xlsx|xls)$/i.test(arquivo.name)) {
        this.erro = "Por favor, selecione um arquivo Excel válido.";
        return;
      }

      try {
        const dados = await this.lerArquivoExcel(arquivo);
        this.$emit("arquivo-processado", dados); // Emitir os dados para o componente pai
      } catch (error) {
        console.error(error);
        this.erro = "Ocorreu um erro ao processar o arquivo.";
      }
    },
    lerArquivoExcel(arquivo) {
      return new Promise((resolve, reject) => {
        const leitor = new FileReader();

        leitor.onload = (event) => {
          try {
            const dadosBinarios = event.target.result;
            const workbook = XLSX.read(dadosBinarios, { type: "binary" });
            const planilha = workbook.Sheets[workbook.SheetNames[0]];
            const dados = XLSX.utils.sheet_to_json(planilha, { header: 1 });
            resolve(dados); // Retornar os dados lidos
          } catch (error) {
            reject(error);
          }
        };

        leitor.onerror = (error) => {
          reject(error);
        };

        leitor.readAsBinaryString(arquivo);
      });
    },
  },
};
</script>

<style scoped>
.erro {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
