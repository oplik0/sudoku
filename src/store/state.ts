export interface Cell {
    value: number;
    valid: boolean;
    enabled: boolean;
}
export interface State {
    sudoku: Cell[];
    invalidCells: Set<number>;
    selected: number;
}

export const state: State = {
    sudoku: Array.from(new Array(81), () => {
        return { value: NaN, valid: true, enabled: true };
    }),
    invalidCells: new Set(),
    selected: NaN
};
