<template>
    <div class="sudoku" id="sudoku-container" :class="{ solved: solved }">
        <Cell
            v-for="(cell, index) in sudoku"
            :key="index"
            :index="index"
            :value="cell.value"
            :enabled="cell.enabled"
            :valid="cell.enabled"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import Cell from "./Cell.vue";
import { useStore } from "../store";

export default defineComponent({
    name: "Sudoku",
    setup() {
        const store = useStore();
        const sudoku = computed(() => store.getters.sudoku);
        const solved = computed(() => store.getters.isSolved);
        return {
            sudoku,
            solved
        };
    },
    components: { Cell }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sudoku {
    max-width: 95vw;
    max-height: 95vw;
    width: min(82vh, 97vw);
    height: min(82vh, 97vw);
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    justify-self: center;
    justify-items: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
}
.solved {
    background-color: #ffffff;
}
.solved::after {
    position: absolute;
    width: 50vw;
    content: "Gratulacje!";
    font-size: 8rem;
    background-color: green;
}
</style>
