class GameData {
    constructor () {
        this._player = null;
        this._world = null;
    }
    getPlayerTile () {
        return this._player != null && this.currentMap != null ?
            this.currentMap[this._player.position] : null;
    }
    set player(player) {
        this._player = player;
    }

    set world(map) {
        this._world = map;
    }

    get world() {
        return this._world;
    }

    get player() {
        return this._player;
    }
};
let data = new GameData();

export default data;
