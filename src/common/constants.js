export const tileTypes = {
    empty: 0,
    treasure: 1,
    temple: 2,
    market: 3,
    settlement: 4,
    farm: 5,
    catastrophe: 6,
    // TODO leaders here for single bit storage of types?
}

export const mapTypes = {
    ground: 0,
    water: 1
}

export const actionTypes = {
    playUnit: 0,
    swapTiles: 1
}
