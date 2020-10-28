import { State } from "./state";
// prettier-ignore
const startingSudoku = [
    5, 6, 3, 8, 7, 9, 2, 1, 4,
    7, 1, 9, 4, 2, 3, 6, 5, 8,
    2, 8, 4, 5, 6, 1, 3, 9, 7,
    4, 2, 6, 1, 5, 7, 9, 8, 3,
    1, 9, 5, 6, 3, 8, 4, 7, 2,
    8, 3, 7, 2, 9, 4, 1, 6, 5,
    9, 4, 8, 3, 1, 5, 7, 2, 6, 
    6, 5, 1, 7, 4, 2, 8, 3, 9,
    3, 7, 2, 9, 8, 6, 5, 4, 1,
]

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function checkValidity(state: State, index: number, quick?: boolean) {
    if (quick) {
        quick = false;
    }
    const position = {
        row: Math.floor(index / 9),
        column: index % 9,
        boxRow: Math.floor((index % 27) / 9),
        boxColumn: index % 3
    };
    const checkedIndexes = [];
    for (let i = 0; i < 9; i++) {
        if (position.column + i * 9 !== index) {
            checkedIndexes.push(position.column + i * 9);
        }
        if (position.row * 9 + i !== index) {
            checkedIndexes.push(position.row * 9 + i);
        }
    }
    switch (position.boxRow) {
        case 0:
            checkedIndexes.push(
                index + 10 - Math.ceil(position.boxColumn * 1.5)
            );
            checkedIndexes.push(
                index + 11 - Math.floor(position.boxColumn * 1.5)
            );
            checkedIndexes.push(
                index + 19 - Math.ceil(position.boxColumn * 1.5)
            );
            checkedIndexes.push(
                index + 20 - Math.floor(position.boxColumn * 1.5)
            );
            break;
        case 1:
            checkedIndexes.push(
                index + 10 - Math.ceil(position.boxColumn * 1.5)
            );
            checkedIndexes.push(
                index + 11 - Math.floor(position.boxColumn * 1.5)
            );
            checkedIndexes.push(
                index - 8 - Math.ceil(position.boxColumn * 1.5)
            );
            checkedIndexes.push(
                index - 7 - Math.floor(position.boxColumn * 1.5)
            );
            break;
        case 2:
            checkedIndexes.push(
                index - 8 - Math.ceil(position.boxColumn * 1.5)
            );
            checkedIndexes.push(
                index - 7 - Math.floor(position.boxColumn * 1.5)
            );
            checkedIndexes.push(
                index - 17 - Math.ceil(position.boxColumn * 1.5)
            );
            checkedIndexes.push(
                index - 16 - Math.floor(position.boxColumn * 1.5)
            );
            break;
        default:
            console.error(
                "This shouldn't be possible... Like mathematically not possible on a 9x9 board"
            );
            break;
    }
    let invalid = false;
    for (const checkedIndex of checkedIndexes) {
        if (state.sudoku[checkedIndex].value === state.sudoku[index].value) {
            state.sudoku[index].valid = false;
            state.sudoku[checkedIndex].valid = false;
            state.invalidCells.add(index);
            state.invalidCells.add(checkedIndex);
            invalid = true;
        }
    }
    if (!invalid) {
        state.sudoku[index].valid = true;
        state.invalidCells.delete(index);
    }
}

function swapColumn(
    sudoku: number[],
    index: number,
    position: number
): number[] {
    if (position === index % 3) return sudoku;
    for (let i = 0; i < 9; i++) {
        [
            sudoku[index + i * 9],
            sudoku[index - (index % 3) + position + i * 9]
        ] = [
            sudoku[index - (index % 3) + position + i * 9],
            sudoku[index + i * 9]
        ];
    }
    return sudoku;
}
function swapRow(sudoku: number[], index: number, position: number): number[] {
    if (position === index % 3) return sudoku;
    for (let i = 0; i < 9; i++) {
        [
            sudoku[index * 9 + i],
            sudoku[(index - (index % 3)) * 9 + position * 9 + i]
        ] = [
            sudoku[(index - (index % 3)) * 9 + position * 9 + i],
            sudoku[index * 9 + i]
        ];
    }
    return sudoku;
}

function difficultyTest(sudoku: number[]): number {
    const setIndexes = new Set<number>();
    const sudokuWithCandidates: Array<number | Set<number>> = sudoku.map(
        (val, index) => {
            if (Number.isNaN(val)) {
                setIndexes.add(index);
                return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }
            return val;
        }
    );
    let difficulty = 0;
    let noInsert = 0;
    const initSize = setIndexes.size;
    const methodsUsed = { candidateLines: false, doublePairs: false };
    while (setIndexes.size > 0) {
        const indexSnapshot = new Set([...setIndexes]);
        for (const setIndex of indexSnapshot) {
            const columnArray = new Set(
                Array.from(
                    new Array(9),
                    (_, i) => sudokuWithCandidates[(setIndex % 9) + i * 9]
                )
            );
            const rowArray = new Set(
                Array.from(
                    new Array(9),
                    (_, i) =>
                        sudokuWithCandidates[setIndex - (setIndex % 9) + i]
                )
            );
            const blockArray = new Set(
                Array.from(
                    new Array(9),
                    (_, i) =>
                        sudokuWithCandidates[
                            setIndex -
                                (setIndex % 3) -
                                (Math.floor(setIndex / 9) % 3) * 9 +
                                (i % 3) +
                                9 * Math.floor(i / 3)
                        ]
                )
            );
            const existingSet = new Set(
                [...columnArray, ...rowArray, ...blockArray].filter(
                    x => !(x instanceof Set)
                )
            );
            if (
                sudokuWithCandidates[setIndex] instanceof Set &&
                (sudokuWithCandidates[setIndex] as Set<number>).size > 1
            ) {
                const possibleNumbers = [
                    ...(sudokuWithCandidates[setIndex] as Set<number>)
                ].filter(x => !existingSet.has(x));
                if (possibleNumbers.length === 1) {
                    setIndexes.delete(setIndex);
                    sudokuWithCandidates[setIndex] = possibleNumbers[0];
                    difficulty += 100;
                    noInsert = 0;
                } else if (possibleNumbers.length === 0) {
                    //this should be impossible, but who knows
                    throw Error("impossible sudoku");
                } else {
                    sudokuWithCandidates[setIndex] = new Set(possibleNumbers);
                    noInsert++;
                }
            } else if (sudokuWithCandidates[setIndex] instanceof Set) {
                setIndexes.delete(setIndex);
                sudokuWithCandidates[setIndex] = [
                    ...(sudokuWithCandidates[setIndex] as Set<number>)
                ][0];
                difficulty += 100;
                noInsert = 0;
            }
            if (!(sudokuWithCandidates[setIndex] instanceof Set)) continue;
            const column = setIndex % 9;
            const row = Math.floor(setIndex / 9);
            const block = Array.from(
                new Array(9),
                (_, i) =>
                    setIndex -
                    (setIndex % 3) -
                    (Math.floor(setIndex / 9) % 3) * 9 +
                    (i % 3) +
                    9 * Math.floor(i / 3)
            );
            if (noInsert > initSize) {
                const blockPairs = [];
                for (const value of sudokuWithCandidates[setIndex] as Set<
                    number
                >) {
                    if (existingSet.has(value)) continue;
                    const blockSets = [...setIndexes].filter(i =>
                        block.includes(i)
                    );
                    let candidateLine = 3;
                    const pairs = [column, row];
                    for (const blockSetIndex of blockSets) {
                        if (
                            (sudokuWithCandidates[blockSetIndex] as Set<
                                number
                            >).has(value)
                        ) {
                            if (
                                blockSetIndex % 9 === column ||
                                Math.floor(blockSetIndex / 9) === row
                            ) {
                                if (candidateLine === 3)
                                    candidateLine =
                                        (blockSetIndex % 9 === column ? 1 : 0) +
                                        (Math.floor(blockSetIndex / 9) === row
                                            ? 2
                                            : 0);
                                else if (
                                    (blockSetIndex % 9 === column ? 1 : 0) +
                                        (Math.floor(blockSetIndex / 9) === row
                                            ? 2
                                            : 0) !==
                                    candidateLine
                                ) {
                                    candidateLine = 0;
                                    break;
                                }
                            }
                            pairs.push(
                                blockSetIndex % 9,
                                Math.floor(blockSetIndex / 9)
                            );
                        }
                    }
                    let lineIndexes = [];
                    switch (candidateLine) {
                        case 1:
                            //column
                            lineIndexes = [...setIndexes].filter(
                                i => i % 9 === column && i != setIndex
                            );
                            for (const columnIndex of lineIndexes) {
                                if (
                                    (sudokuWithCandidates[columnIndex] as Set<
                                        number
                                    >).size <= 1
                                )
                                    break;
                                (sudokuWithCandidates[columnIndex] as Set<
                                    number
                                >).delete(value);
                                difficulty += methodsUsed.candidateLines
                                    ? 350
                                    : 550;
                            }
                            methodsUsed.candidateLines = true;
                            break;
                        case 2:
                            //row
                            lineIndexes = [...setIndexes].filter(
                                i => Math.floor(i / 9) === row && i != setIndex
                            );
                            for (const rowIndex of lineIndexes) {
                                if (
                                    (sudokuWithCandidates[rowIndex] as Set<
                                        number
                                    >).size <= 1
                                )
                                    break;
                                (sudokuWithCandidates[rowIndex] as Set<
                                    number
                                >).delete(value);
                                difficulty += methodsUsed.candidateLines
                                    ? 350
                                    : 550;
                            }

                            break;
                        case 3:
                            // self - the only possible place for this value in a block
                            setIndexes.delete(setIndex);
                            sudokuWithCandidates[setIndex] = value;
                            difficulty += 150;
                            break;
                    }
                    if (pairs.length === 4) {
                        pairs.push(value);
                        blockPairs.push(pairs);
                    }
                }
                if (blockPairs.length > 1) {
                    const deletionIndexes = [];
                    const getIndex = (col: number, row: number) => {
                        return col + row * 9;
                    };
                    const inOneOfPairs = (
                        x: number,
                        pair: number[],
                        pair2: number[]
                    ) => {
                        return (
                            x === getIndex(pair[0], pair[1]) ||
                            x === getIndex(pair[2], pair[3]) ||
                            x === getIndex(pair2[0], pair2[1]) ||
                            x === getIndex(pair2[2], pair2[3])
                        );
                    };
                    while (blockPairs.length > 0) {
                        const pair: number[] = blockPairs.shift() as number[];
                        for (const pair2 of blockPairs) {
                            if (pair[4] !== pair2[4]) continue;
                            if (
                                (pair2[0] === pair[0] || pair2[2] == pair[0]) &&
                                (pair2[0] === pair[2] || pair2[2] == pair[2])
                            ) {
                                deletionIndexes.push(
                                    ...[...setIndexes]
                                        .filter(
                                            x =>
                                                !inOneOfPairs(x, pair, pair2) &&
                                                (x % 9 === pair[0] ||
                                                    x % 9 === pair[2])
                                        )
                                        .map(x => {
                                            return { index: x, value: pair[4] };
                                        })
                                );
                            }
                            if (
                                (pair2[1] === pair[1] || pair2[3] == pair[1]) &&
                                (pair2[1] === pair[1] || pair2[3] == pair[1])
                            ) {
                                deletionIndexes.push(
                                    ...[...setIndexes]
                                        .filter(
                                            x =>
                                                !inOneOfPairs(x, pair, pair2) &&
                                                (x % 9 === pair[0] ||
                                                    x % 9 === pair[2])
                                        )
                                        .map(x => {
                                            return { index: x, value: pair[4] };
                                        })
                                );
                            }
                        }
                    }
                    for (const deletionIndex of deletionIndexes) {
                        if (
                            (sudokuWithCandidates[deletionIndex.index] as Set<
                                number
                            >).size <= 1
                        )
                            continue;
                        setIndexes.delete(deletionIndex.index);
                        (sudokuWithCandidates[deletionIndex.index] as Set<
                            number
                        >).delete(deletionIndex.value);
                        difficulty += methodsUsed.doublePairs ? 450 : 700;
                    }
                    methodsUsed.doublePairs = true;
                }
            }
        }
        if (
            (setIndexes.size === 2 && noInsert >= setIndexes.size) ||
            (setIndexes.size < 4 && noInsert >= setIndexes.size * 2)
        ) {
            sudokuWithCandidates[[...setIndexes][0]] =
                sudokuWithCandidates[[...setIndexes][0]];
            setIndexes.delete([...setIndexes][0]);
        }
        if (noInsert > initSize * 2) {
            difficulty = 100000;
            return difficulty;
        }
    }
    return difficulty;
}

export function generateSudoku(state: State, difficulty: number): void {
    let sudoku = startingSudoku.slice();
    const iterations = randomInt(10, 50);
    for (let i = 0; i < iterations; i++) {
        sudoku = swapRow(sudoku, randomInt(0, 9), randomInt(0, 3));
        sudoku = swapColumn(sudoku, randomInt(0, 9), randomInt(0, 3));
    }
    const removalIndexes: Set<number> = new Set();
    while (removalIndexes.size < 30) {
        const removalIndex = randomInt(0, 81);
        removalIndexes.add(removalIndex);
        removalIndexes.add(80 - removalIndex);
    }
    for (const removalIndex of removalIndexes) {
        sudoku[removalIndex] = NaN;
    }
    let resultingDifficulty = difficultyTest(sudoku);
    const backupSudokus = [sudoku];
    let failCounter = 0;
    while (
        resultingDifficulty < difficulty - 500 ||
        resultingDifficulty > difficulty + 500
    ) {
        if (resultingDifficulty > difficulty + 500) {
            if (difficulty >= 10000) {
                break;
            }
            sudoku =
                backupSudokus[
                    backupSudokus.length - Math.floor(failCounter / 3)
                ];
            failCounter++;
        }
        let removalIndex = randomInt(0, 81);
        while (Number.isNaN(sudoku[removalIndex])) {
            removalIndex = randomInt(0, 81);
        }

        sudoku[removalIndex] = NaN;
        sudoku[80 - removalIndex] = NaN;
        try {
            resultingDifficulty = difficultyTest(sudoku);
            backupSudokus.push(sudoku);
            failCounter = 0;
        } catch {
            sudoku =
                backupSudokus[
                    backupSudokus.length - Math.floor(failCounter / 3)
                ];
            failCounter++;
            resultingDifficulty = difficultyTest(sudoku);
        }
    }
    state.sudoku = state.sudoku.map((_, i) => {
        return {
            value: sudoku[i],
            valid: true,
            enabled: Number.isNaN(sudoku[i])
        };
    });
}
