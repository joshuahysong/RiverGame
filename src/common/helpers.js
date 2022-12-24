import { tileTypes, playerIcons, boardStats } from './constants'

const helpers = {
    getTileNameByType(tileType) {
        return Object.keys(tileTypes).find(key => tileTypes[key] === tileType);
    },
    getCoordinatesByIndex(index) {        
        var row = Math.floor(index / boardStats.columns) + 10
        return `${row.toString(36).toUpperCase()}-${(index % boardStats.columns + 1)}`;
    },
    getPlayerIconNameById(id) {
        const iconName = Object.keys(playerIcons).find(key => playerIcons[key] === id);
        return `suit-${iconName}-fill`
    },
}

export default helpers;