<template>
    <div>
        <h3>Selecione a UF:</h3>
        <select v-model="ufSelecionada" @change="aplicarFiltros">
            <option value="">Todas</option>
            <option v-for="uf in ufsDisponiveis" :key="uf" :value="uf">
                {{ uf }}
            </option>
        </select>

        <h3>Selecione o Emitente:</h3>
        <select v-model="emitenteSelecionado" @change="aplicarFiltros">
            <option value="">Todos</option>
            <option v-for="emitente in emitentesDisponiveis" :key="emitente" :value="emitente">
                {{ emitente }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    props: {
        ufsDisponiveis: {
            type: Array,
            required: true, // Recebe as UFs disponíveis como prop
        },
        emitentesDisponiveis: {
            type: Array,
            required: true, // Recebe os Emitentes disponíveis como prop
        },
    },
    data() {
        return {
            ufSelecionada: "", // Estado para armazenar a UF selecionada
            emitenteSelecionado: "", // Estado para armazenar o Emitente selecionado
        };
    },
    methods: {
        aplicarFiltros() {
            // Emite um evento com os filtros aplicados
            this.$emit("filtrar", {
                uf: this.ufSelecionada,
                emitente: this.emitenteSelecionado,
            });
        },
    },
    watch: {
        ufSelecionada(newUF) {
            this.$emit("update:filtros", { uf: newUF, emitente: this.emitenteSelecionado });
        },
        emitenteSelecionado(newEmitente) {
            this.$emit("update:filtros", { uf: this.ufSelecionada, emitente: newEmitente });
        },
    },
    mounted() {
        this.$emit("update:filtros", { uf: this.ufSelecionada, emitente: this.emitenteSelecionado });
    }

};
</script>

<style scoped>
select {
    padding: 5px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: block;
}

h3 {
    margin-top: 20px;
}
</style>