<template>
  <div class="tabela-com-filtros">
    <table>
      <thead>
        <tr>
          <th v-for="(coluna, index) in colunas" :key="index">
            <div class="header-cell">
              <span>{{ coluna }}</span>
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
          <td v-for="coluna in colunas" :key="coluna">{{ linha[coluna] }}</td>
        </tr>
      </tbody>
    </table>
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
      filtros: {},
    };
  },
  computed: {
    dadosFiltrados() {
      // Retorna os dados filtrados com base nos filtros aplicados
      return this.dados.filter((linha) => {
        return Object.keys(this.filtros).every((coluna) => {
          const filtro = (this.filtros[coluna] || "").toLowerCase();
          const valor = (linha[coluna] || "").toString().toLowerCase();
          return valor.includes(filtro);
        });
      });
    },
  },
  methods: {
    aplicarFiltro() {
      this.$emit("filtro-aplicado", this.dadosFiltrados);
    },
  },
};
</script>

<style scoped>
.tabela-com-filtros {
  max-width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.header-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header-cell input {
  margin-top: 5px;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
}

.sem-resultados {
  margin-top: 10px;
  text-align: center;
  color: #888;
}
</style>
