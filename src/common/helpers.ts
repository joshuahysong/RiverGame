import {
  actionTypes,
  tileTypes,
  playerIcons,
  boardStats,
  messageTypes,
  monumentTypes,
} from './constants'

interface BoardTile {
  playerId?: number
  tileType: number
  isLeaderTile?: boolean
}

const helpers = {
  getTileNameByType(tileType: number): string {
    return pascalToKebab(
      Object.keys(tileTypes).find((key) => tileTypes[key as keyof typeof tileTypes] === tileType) ||
        ''
    )
  },

  getCoordinatesByIndex(index: number): string {
    const row = Math.floor(index / boardStats.columns) + 10
    return `${row.toString(36).toUpperCase()}-${(index % boardStats.columns) + 1}`
  },

  getPlayerIconNameById(id: number): string {
    return playerIcons[id - 1] || ''
  },

  getActionNameByType(actionTypeId: number): string | undefined {
    return Object.keys(actionTypes).find(
      (key) => actionTypes[key as keyof typeof actionTypes] === actionTypeId
    )
  },

  getMessageNameByType(messageType: number): string {
    return pascalToKebab(
      Object.keys(messageTypes).find(
        (key) => messageTypes[key as keyof typeof messageTypes] === messageType
      ) || ''
    )
  },

  capitalizeFirstLetter(string: string): string {
    return string && string[0].toUpperCase() + string.slice(1)
  },

  getMonumentNameByType(monumentType: number): string {
    return this.capitalizeFirstLetter(
      pascalToProper(
        Object.keys(monumentTypes).find(
          (key) => monumentTypes[key as keyof typeof monumentTypes] === monumentType
        ) || ''
      )
    ).replace(' ', ' & ')
  },

  getLogToken(tile: BoardTile | null): string | null {
    return tile ? `{${tile.playerId}|${tile.tileType}}` : null
  },
}

function pascalToKebab(string: string): string {
  return string
    .split(/(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join('-')
}

function pascalToProper(string: string): string {
  return string.split(/(?=[A-Z])/).join(' ')
}

export default helpers
