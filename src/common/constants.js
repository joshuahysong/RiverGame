export const tileTypes = {
    empty: 0,
    treasure: 1,
    temple: 2,
    market: 3,
    settlement: 4,
    farm: 5,
    catastrophe: 6,
    king: 7,
    priest: 8,
    farmer: 9,
    trader: 10,
    generic: 11,
    monumentTopLeft: 12,
    monumentTopRight: 13,
    monumentBottomLeft: 14,
    monumentBottomRight: 15
}

export const leaderTileTypes = [
    tileTypes.king,
    tileTypes.priest,
    tileTypes.farmer,
    tileTypes.trader
]

export const mapTypes = {
    ground: '0',
}

export const actionTypes = {
    loading: 0,
    playTile: 1,
    swapTiles: 2,
    takeTreasure: 3,
    buildMonument: 4,
    revoltAttack: 5,
    revoltDefend: 6
}

export const playerIcons = {
    diamond: 1,
    club: 2,
    heart: 3,
    spade: 4
}

export const boardStats = {
    columns: 16,
    rows: 11
}

export const breakpoints = {
    small: 576,
    medium: 768,
    large: 992,
    extraLarge: 1200
}

export const monumentTypes = {
    redBlue: 1,
    blueGreen: 2,
    greenRed: 3,
    blackRed: 4,
    blackGreen: 5,
    blackBlue: 6
}