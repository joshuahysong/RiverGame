import { actionTypes, tileTypes, playerIcons, boardStats, messageTypes, monumentTypes } from './constants'

const helpers = {
    getTileNameByType(tileType) {
        return pascalToKebab(Object.keys(tileTypes).find(key => tileTypes[key] === tileType));
    },
    getCoordinatesByIndex(index) {
        var row = Math.floor(index / boardStats.columns) + 10
        return `${row.toString(36).toUpperCase()}-${(index % boardStats.columns + 1)}`;
    },
    getPlayerIconNameById(id) {
        return playerIcons[id - 1]
    },
    getActionNameByType(actionTypeId) {
        return Object.keys(actionTypes).find(key => actionTypes[key] === actionTypeId);
    },
    getMessageNameByType(messageType) {
        return pascalToKebab(Object.keys(messageTypes).find(key => messageTypes[key] === messageType));
    },
    capitalizeFirstLetter(string) {
        return string && string[0].toUpperCase() + string.slice(1);
    },
    getMonumentNameByType(monumentType) {
        return this.capitalizeFirstLetter(
            pascalToProper(Object.keys(monumentTypes).find(key => monumentTypes[key] === monumentType))
        ).replace(' ', ' & ');
    },
    getLogToken(playerId, tileType) {
        return `{${playerId}|${tileType}}`
    }
}

function pascalToKebab(string) {
    return string
        .split(/(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('-')
}
function pascalToProper(string) {
    return string
        .split(/(?=[A-Z])/)
        .join(' ')
}

export default helpers;