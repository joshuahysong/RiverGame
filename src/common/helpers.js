import { tileTypes } from './constants'

const helpers = {
    getTileNameByType(tileType) {
        return Object.keys(tileTypes).find(key => tileTypes[key] === tileType);
    },
    getCoordinatesByIndex(index) {        
        var row = Math.floor(index / 16) + 10
        return `${row.toString(36).toUpperCase()}-${(index % 16 + 1)}`;
    }
}

export default helpers;