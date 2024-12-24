<template>
  <div>
    <div v-if="dados && dados.length">
      <h3>Notas Fiscais:</h3>
      <div v-for="(nf, i) in dados" :key="i" class="nota-fiscal">
        <ul>
          <li>
            <strong>Emitente:</strong> {{ nf.emitente?.xNome || "Não informado" }}<br />
            <strong>Destinatário:</strong> {{ nf.destinatario?.xNome || "Não informado"
            }}<br />
            <strong>UF:</strong> {{ nf.emitente?.enderEmit?.UF || "Não informado" }}
            <ul>
              <li v-for="item in nf.produtos || []" :key="item.prod?.NCM">
                <span>
                  <strong>Produto:</strong>
                  {{ item.prod?.xProd || "Desconhecido" }} - R${{ item.prod?.vProd || 0 }}
                  <br />
                  <strong>NCM:</strong> {{ item.prod?.NCM || "Não informado" }}
                  <button @click="removerProduto(item.prod?.NCM)">Remover produto</button>
                  <strong> (NCM inválido para a atividade)</strong>
                  <br />
                  <strong v-if="!isOrigemNacional(item.imposto?.ICMS)"> DIFAL: </strong>
                  {{ calcularDifal(item.prod?.vProd)[0] }}
                  <strong>FCP:</strong>
                  {{ calcularDifal(item.prod?.vProd)[1] }}
                </span>
              </li>
            </ul>
            <br />
            <strong>Total NF:</strong> {{ nf.totais?.vNF || 0 }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>Nenhuma nota fiscal encontrada para os filtros aplicados.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dados: {
      type: Array,
      required: true, // Adicione required para garantir que é passada corretamente
    },
  },
  watch: {
    dados: {
      handler(newVal) {
        console.log("Dados atualizados:", newVal); // Depuração para garantir que está recebendo os novos valores
      },
      immediate: true, // Executa o watcher logo na inicialização
    },
  },
  methods: {
    removerProduto(ncm) {
      // Emitir evento para remover o NCM
      this.$emit("remover-produto", ncm);
    },
    calcularDifal(valorProd, aliq = 0.12) {
      try {
        const icmsNota = valorProd * aliq;
        const base = valorProd - icmsNota;
        const baseCal = base / (1 - 0.2);
        const icmsInt = baseCal * 0.2;
        const difal = icmsInt - icmsNota;
        const fcp = baseCal * 0.02;
        return [difal.toFixed(2), fcp.toFixed(2)];
      } catch (e) {
        console.error(e);
        return [0, 0];
      }
    },
    isOrigemNacional(icms) {
      // Verifica se a origem do ICMS é nacional
      return Object.values(icms)[0].orig === "1";
    },
  },
};
</script>

<style scoped>
.nota-fiscal {
  background: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
button {
  padding: 5px 10px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #d9363e;
}
</style>
