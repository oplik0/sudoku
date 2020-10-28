<template>
    <div class="menu" id="sudoku-menu">
        <select v-model="difficulty">
            <option value="3500">Bardzo łatwe</option>
            <option value="4500">Łatwe</option>
            <option value="6500">Średnie</option>
            <option value="9500">Trudne</option>
        </select>
        <button @click="generateNewSudoku" :disabled="lockInterface">Wygeneruj</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "../store";

export default defineComponent({
    name: "Menu",
    data() {
        return {
            difficulty: "4500",
            lockInterface: false
        };
    },
    setup() {
        const store = useStore();
        const generateSudoku = (difficulty: number) =>
            store.commit("GenerateNew", { difficulty });
        return { generateSudoku };
    },
    methods: {
        generateNewSudoku(e: Event) {
            this.lockInterface = true;
            try{
                this.generateSudoku(parseInt(this.$data.difficulty, 10));
            }
            catch {
                this.generateSudoku(4500);
            }
             this.lockInterface = false;
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
