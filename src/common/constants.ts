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
] as const

export const mapTypes = {
  ground: 0,
  river: 1,
  treasure: 2,
  priorityTreasure: 3
} as const

export const actionTypes = {
  loading: 0,
  playTile: 1,
  swapTiles: 2,
  takeTreasure: 3,
  buildMonument: 4,
  buildMonumentMultiple: 5,
  conflictAttack: 6,
  conflictDefend: 7,
  conflictChooseLeader: 8,
  gameOver: 9
}

export const playerIcons = [
  'suit-diamond-fill',
  'star-fill',
  'suit-heart-fill',
  'egg-fill'
] as const

export const boardStats = {
  columns: 16,
  rows: 11
} as const

export const breakpoints = {
  small: 576,
  medium: 768,
  large: 992,
  extraLarge: 1200
} as const

export const monumentTypes = {
  redBlue: 1,
  blueGreen: 2,
  greenRed: 3,
  blackRed: 4,
  blackGreen: 5,
  blackBlue: 6,
  redMonuments: [1, 3, 4] as number[],
  blueMonuments: [1, 2, 6] as number[],
  greenMonuments: [2, 3, 5] as number[],
  blackMonuments: [4, 5, 6] as number[]
}

export const messageTypes = {
  system: 0,
  action: 1
} as const

export const conflictTypes = {
  none: 0,
  revolt: 1,
  war: 2
} as const

// Type exports for better type inference
export type TileType = typeof tileTypes[keyof typeof tileTypes]
export type MapType = typeof mapTypes[keyof typeof mapTypes]
export type ActionType = typeof actionTypes[keyof typeof actionTypes]
export type PlayerIcon = typeof playerIcons[number]
export type MonumentType = typeof monumentTypes.redBlue | typeof monumentTypes.blueGreen | typeof monumentTypes.greenRed | typeof monumentTypes.blackRed | typeof monumentTypes.blackGreen | typeof monumentTypes.blackBlue
export type MessageType = typeof messageTypes[keyof typeof messageTypes]
export type ConflictType = typeof conflictTypes[keyof typeof conflictTypes]
