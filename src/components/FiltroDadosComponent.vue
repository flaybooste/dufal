<template>
  <div class="tabela-com-filtros">
    <table>
      <thead>
        <tr>
          <th v-for="(coluna, index) in colunas" :key="index">
            <div class="header-cell">
              <span>{{ coluna }}</span>
              <!-- Campo de filtro dinâmico -->
              <input
                v-if="habilitarFiltros"
                type="text"
                v-model="filtros[coluna]"
                @input="aplicarFiltro"
                :placeholder="`Filtrar ${coluna}...`"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(linha, index) in dadosFiltrados" :key="index">
          <!-- Renderiza as células dinamicamente com base nas colunas -->
          <td v-for="coluna in colunas" :key="coluna">
            {{ linha[coluna] || "-" }}
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Mensagem caso nenhum resultado seja encontrado -->
    <div v-if="!dadosFiltrados.length" class="sem-resultados">
      <p>Nenhum resultado encontrado para os filtros aplicados.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colunas: {
      type: Array,
      required: true,
    },
    dados: {
      type: Array,
      required: true,
    },
    habilitarFiltros: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      filtros: {}, // Armazena os filtros aplicados
    };
  },
  computed: {
    dadosFiltrados() {
      // Computa os dados com base nos filtros
      return this.dados.filter((linha) => {
        return Object.entries(this.filtros).every(([coluna, filtro]) => {
          if (!filtro) return true; // Ignora filtros vazios
          const valor = (linha[coluna] || "").toString().toLowerCase();
          return valor.includes(filtro.toLowerCase());
        });
      });
    },
  },
  methods: {
    aplicarFiltro() {
      // Emite evento para o componente pai com os dados filtrados
      this.$emit("filtro-aplicado", this.dadosFiltrados);
    },
  },
};
</script>

<style scoped>
.tabela-com-filtros {
  max-width: 100%;
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f9f9f9;
  font-weight: bold;
}

.header-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header-cell input {
  margin-top: 5px;
  padding: 6px;
  font-size: 12px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.sem-resultados {
  margin-top: 15px;
  text-align: center;
  color: #999;
}
</style>
