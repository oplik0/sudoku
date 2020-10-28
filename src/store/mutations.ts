import { MutationTree } from "vuex";
import { State } from "./state";
import { checkValidity, generateSudoku } from "./sudokuHelpers";

export type Mutations<S = State> = {
    SetCell(
        state: S,
        payload: {
            index: number;
            value: number;
            quickCheck: boolean | undefined;
        }
    ): void;
    Select(state: S, payload: { index: number }): void;
    GenerateNew(state: S, payload: { difficulty: number }): void;
};

export const mutations: MutationTree<State> & Mutations = {
    SetCell(state, payload) {
        if (payload.value === 0) {
            payload.value = NaN;
        }
        if (state.sudoku[payload.index].enabled) {
            state.sudoku[payload.index].value = payload.value % 10;
            checkValidity(state, payload.index, payload.quickCheck ?? false);
            for (const invalidCell of state.invalidCells) {
                checkValidity(state, invalidCell, true);
            }
        }
    },
    Select(state, payload) {
        state.selected = state.sudoku[payload.index].value;
    },
    GenerateNew(state, payload) {
        const difficulty = payload.difficulty ?? 32;
        generateSudoku(state, difficulty);
    }
};
