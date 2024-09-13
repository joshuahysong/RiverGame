export const tileTypes = {
    empty: 0,
    temple: 1,
    market: 2,
    settlement: 3,
    farm: 4,
    catastrophe: 5,
    king: 6,
    priest: 7,
    farmer: 8,
    trader: 9,
    generic: 10,
    monumentTopLeft: 11,
    monumentTopRight: 12,
    monumentBottomLeft: 13,
    monumentBottomRight: 14
}

export const leaderTileTypes = [
    tileTypes.king,
    tileTypes.priest,
    tileTypes.farmer,
    tileTypes.trader
]

export const mapTypes = {
    ground: '0'
}

export const actionTypes = {
    loading: 0,
    playTile: 1,
    swapTiles: 2,
    takeTreasure: 3,
    buildMonument: 4,
    buildMonumentMultiple: 5,
    revoltAttack: 6,
    revoltDefend: 7,
    warAttack: 8,
    warDefend: 9,
    warChooseLeader: 10
}

export const playerIcons = [
    'suit-diamond-fill',
    'star-fill',
    'suit-heart-fill',
    'egg-fill'
]

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
    blackBlue: 6,
    redMonuments: [1,3,4],
    blueMonuments: [1,2,6],
    greenMonuments: [2,3,5],
    blackMonuments: [4,5,6]
}

export const messageTypes = {
    system: 0,
    action: 1
}
