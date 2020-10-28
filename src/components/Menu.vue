<template>
    <div class="menu" id="sudoku-menu">
        <select v-model="difficulty">
            <option value="3500">Bardzo łatwe</option>
            <option value="4000">Łatwe</option>
            <option value="5000">Średnie</option>
            <option value="6000">Trudne</option>
        </select>
        <button @click="generateNewSudoku">Wygeneruj</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {useStore} from "../store";

export default defineComponent({
    name: "Menu",
    data() {
        return {
            difficulty: "4000"
        }
    },
    setup() {
        const store = useStore();
        const generateSudoku = (difficulty: number) => store.commit("GenerateNew", {difficulty})
        return {generateSudoku}
    },
    methods: {
        generateNewSudoku(e: Event) {
            this.generateSudoku(parseInt(this.$data.difficulty, 10))
        }
    }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sudoku {
    width: 80vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>
