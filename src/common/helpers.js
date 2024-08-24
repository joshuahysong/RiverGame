import { actionTypes, tileTypes, playerIcons, boardStats } from './constants'

const helpers = {
    getTileNameByType(tileType) {
        return pascalToKebab(Object.keys(tileTypes).find(key => tileTypes[key] === tileType));
    },
    getCoordinatesByIndex(index) {
        var row = Math.floor(index / boardStats.columns) + 10
        return `${row.toString(36).toUpperCase()}-${(index % boardStats.columns + 1)}`;
    },
    getPlayerIconNameById(id) {
        const iconName = Object.keys(playerIcons).find(key => playerIcons[key] === id);
        return `suit-${iconName}-fill`
    },
    getActionNameByType(actionTypeId) {
        return Object.keys(actionTypes).find(key => actionTypes[key] === actionTypeId);
    },
}

function pascalToKebab(string) {
    return string
      .split(/(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('-')
  }

export default helpers;