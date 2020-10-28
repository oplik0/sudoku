<template>
    <div
        class="cell"
        :id="'cell-' + index"
        :class="{ enabled: enabled, valid: valid, 'border-top': index%27<9, 'border-bottom': index%27>=18, 'border-right': index%3===2, 'border-left': index%3===0}"
    >
        <input
            type="text"
            pattern="^\d$"
            maxlength="1"
            spellcheck="no"
            v-model.number="value"
            :name="'cell-' + index"
            :id="'cell-' + index + '-input'"
            :readonly="!enabled"
            @focus="select"
            @click="select"
            @input="select"
            @keyup.down="selectDifferentCell(index > 71 ? index%9 : index + 9)"
            @keyup.up="selectDifferentCell(index < 9 ? 72+index%9 : index - 9)"
            @keyup.left="selectDifferentCell(index % 9 === 0 ? index + 8 : index - 1)"
            @keyup.right="selectDifferentCell(index%9 === 8 ? index - 8 : index + 1)"
            :class="{ enabled: enabled, valid: valid, matched: matched, }"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store";

export default defineComponent({
    data() {
        const store = useStore();
        const index = this.index;
        const inputRegex = /^\d$/i
        const setCell = (value: number) =>
            store.commit("SetCell", { index, value, quickCheck: false });
        const value = computed({
            get: () =>
                Number.isNaN(store.getters.sudoku[index].value)
                    ? ""
                    : store.getters.sudoku[index].value,
            set: val => setCell(typeof val === "number" ? val : NaN)
        });
        const valid = computed(() => store.getters.sudoku[index].valid);
        const enabled = computed(() => store.getters.sudoku[index].enabled);
        const matched = computed(
            () => store.getters.selected === store.getters.sudoku[index].value
        );
        const select = (e: Event) => {
            const cell = e?.target;
            if (cell instanceof HTMLInputElement) {
                if (!inputRegex.test(cell.value) && cell.value !== "NaN")
                    cell.value = ""
                cell.focus();
                cell.select();

            }
            store.commit("Select", {index});
        };
        const selectDifferentCell = (index: number) => {
            const cell = document.querySelector(`#cell-${index}-input`)
            if (cell instanceof HTMLInputElement) {
                cell.focus();
                cell.select();
            }
        }
        return {
            value,
            valid,
            enabled,
            matched,
            select,
            selectDifferentCell
        };
    },
    name: "Cell",
    props: {
        index: { type: Number, required: true }
    }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    display: block;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px #505050 solid;
}
input {
    display: block;
    -moz-appearance: textfield;
    width: 98%;
    height: 98%;
    min-width: min(8vh, 10vw);
    min-height: min(8vh, 10vw);
    font-size: min(7vh, 9vw);
    text-align: center;
    margin: 0;
    padding: 0;
    caret-color: transparent;
    color: #00f;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input:not(.valid) {
    background-color: rgba(255, 17, 17, 0.2);
    color: #a00;
}
input::selection {
    text-shadow: none;
}
input.matched {
    background-color: rgba(101, 155, 255, 0.27);
}
input:not(.enabled) {
    color: #000000;
}
input:focus-within {
    background-color: rgba(0, 79, 227, 0.41);
}
.border-right {
    border-right: min(1vh, 1.125vw) solid #000000;
}
.border-bottom {
    border-bottom: min(1vh, 1.125vw) solid #000000;
}
.border-left {
    border-left: min(1vh, 1.125vw) solid #000000;
}

.border-top {
    border-top: min(1vh, 1.125vw) solid #000000;
}
</style>
