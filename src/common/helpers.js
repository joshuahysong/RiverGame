import { tileTypes, playerIcons } from './constants'

const helpers = {
    getTileNameByType(tileType) {
        return Object.keys(tileTypes).find(key => tileTypes[key] === tileType);
    },
    getCoordinatesByIndex(index) {        
        var row = Math.floor(index / 16) + 10
        return `${row.toString(36).toUpperCase()}-${(index % 16 + 1)}`;
    },
    getPlayerIconNameById(id) {
        return Object.keys(playerIcons).find(key => playerIcons[key] === id);
    },
}

export default helpers;