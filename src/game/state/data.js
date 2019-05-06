class GameData {
  constructor() {
    this._player = null;
    this._world = null;
    this._splash = true;
  }

  getPlayerTile() {
    return this._player != null && this.currentMap != null
      ? this.currentMap[this._player.position]
      : null;
  }

  get player() {
    return this._player;
  }

  set player(player) {
    this._player = player;
  }

  get world() {
    return this._world;
  }

  set world(map) {
    this._world = map;
  }

  get displaySplash() {
    return this._splash;
  }

  set displaySplash(bool) {
    this._splash = bool;
  }
}
let data = new GameData();

export default data;
