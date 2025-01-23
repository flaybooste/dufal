<template>
  <div>
    <div v-if="dados" class="p-4">
      <h3 class="text-lg font-bold mb-4">Notas Fiscais:</h3>
      <div v-for="(nf, i) in dados" :key="i" class="nota-fiscal p-4 mb-4 bg-gray-100 rounded shadow-sm">
        <ul>
          <li>
            <strong>Emitente:</strong> {{ nf.emitente || "Não informado" }}<br />
            <strong>Destinatário:</strong> {{ nf.destinatario?.xNome || "Não informado"
            }}<br />
            <strong>UF:</strong> {{ nf.emitente?.enderEmit?.UF || "Não informado" }}
            <ul class="ml-4 mt-2">
              <li v-for="item in nf.produtos || []" :key="item.prod?.NCM" class="p-2 bg-white rounded mb-2 shadow">
                <span>
                  <strong>Produto:</strong>
                  {{ item.prod?.xProd || "Desconhecido" }} -
                  <span class="font-bold text-green-600">
                    R${{ item.prod?.vProd || 0 }}
                  </span>
                  <br />
                  <strong>NCM:</strong> {{ item.prod?.NCM || "Não informado" }}
                  <button @click="removerProduto(item.prod?.NCM)"
                    class="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Remover produto
                  </button>
                  <strong class="text-red-600"> (NCM inválido para a atividade)</strong>
                  <br />
                  <strong v-if="!isOrigemNacional(item.imposto?.ICMS)"> DIFAL: </strong>
                  {{
                    calcularDifal(
                      (cfop = item.prod?.CFOP),
                      (valorProd = item.prod?.vProd)
                    )[0]
                  }}
                  <strong class="ml-2">FCP:</strong>
                  {{
                    calcularDifal(
                      (cfop = item.prod?.CFOP),
                      (valorProd = item.prod?.vProd)
                    )[1]
                  }}
                </span>
              </li>
            </ul>
            <br />
            <strong>Total NF:</strong>
            <span class="font-bold text-blue-600">
              {{ nf.totais?.vNF || 0 }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">
      <p>Nenhuma nota fiscal encontrada para os filtros aplicados.</p>
    </div>
  </div>
</template>

<script>
import { useNotasStore } from "@/stores/useNotasStore";

export default {
  props: {
    dados: {
      type: Array,
      required: true, // Adicione required para garantir que é passada corretamente
    },
  },
  setup() {
    const notasStore = useNotasStore();

    const calcularDifal = (cfop, valorProd) => {
      notasStore.calcularDifal((cfop = cfop), (valorProd = valorProd));
    };
  },
  watch: {
    dados: {
      handler(newVal) {
        //console.log("Dados atualizados:", newVal); // Depuração para garantir que está recebendo os novos valores
      },
      immediate: true, // Executa o watcher logo na inicialização
    },
  },
  methods: {
    removerProduto(ncm) {
      // Emitir evento para remover o NCM
      this.$emit("remover-produto", ncm);
    },
    isOrigemNacional(icms) {
      // Verifica se a origem do ICMS é nacional
      return Object.values(icms)[0].orig === "1";
    },
  },
};
</script>
