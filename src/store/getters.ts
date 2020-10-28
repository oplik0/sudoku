import { GetterTree } from "vuex";
import { State, Cell } from "./state";

export type Getters = {
    isSolved(state: State): boolean;
    sudoku(state: State): Cell[];
    selected(state: State): number;
};

export const getters: GetterTree<State, State> & Getters = {
    isSolved(state: State): boolean {
        return state.sudoku.reduce((solved: boolean, cell: Cell) => {
            return solved && cell.valid && !Number.isNaN(cell.value);
        }, true);
    },
    sudoku(state: State): Cell[] {
        return state.sudoku;
    },
    selected(state: State): number {
        return state.selected;
    }
};
