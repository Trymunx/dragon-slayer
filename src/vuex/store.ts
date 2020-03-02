// import { actions } from "./actions";
import { ActivityState } from "../game/entities/entity";
import { Creature } from "../game/entities/creatures";
import { Player } from "../game/entities/player";
import { Map as ROTMap } from "rot-js";
import Vue from "vue";
import Vuex from "vuex";
import { Direction, getDirStringFromVector, parseDir } from "../game/utils/direction";
import { Dungeon, generateRandomDungeon } from "../game/dungeons/dungeon";
import { getTile, World } from "../game/world/World";
import { Item, Message, SurroundingsItem } from "../types";
import Position, { Vector, VTS } from "../game/world/position";

Vue.use(Vuex);

interface Surroundings {
  creatures: {
    creature: Creature;
    dir: string;
    dist: number;
  }[];
  items: {
    [name: string]: SurroundingsItem;
  };
}

type DungeonState = { [overworldEntrance: string]: Dungeon }

export enum WorldState {
  Overworld = "OVERWORLD",
  Dungeon = "DUNGEON",
}

export interface IState {
  commandMode: string;
  creatures: {
    [location: string]: Creature[];
  };
  displayOrigin: [number, number];
  dungeons: DungeonState;
  gamePaused: boolean;
  highlit: Record<string, {} | { colour: string; symbol: string }>;
  inputText: string;
  messages: Message[];
  player: Player;
  splash: boolean;
  world?: World;
  worldState: WorldState;
}

const InitialState: IState = {
  commandMode: "text",
  creatures: {},
  displayOrigin: [0, 0],
  dungeons: {},
  gamePaused: false,
  highlit: {},
  inputText: "",
  messages: [],
  player: new Player(),
  splash: true,
  worldState: WorldState.Overworld,
};

const store = new Vuex.Store({
  actions: {
    addCreature({ commit }, creature: Creature) {
      commit("ADD_CREATURE", creature);
    },
    addMessage({ commit }, data: { entity: string; message: string }) {
      commit("ADD_MESSAGE", data);
    },
    addMessageAtPosition({ commit, state }, { entity, message, position }) {
      // Only send messages when player is there
      if (state.player.position.x === position.x && state.player.position.y === position.y) {
        commit("ADD_MESSAGE", { entity, message });
      }
    },
    clearHighlight({ commit }) {
      commit("CLEAR_HIGHLIGHTED");
    },
    dropItems({ commit }, data) {
      commit("DROP_ITEMS", data);
    },
    enterCommand({ commit, state }, text) {
      commit("ADD_MESSAGE", {
        entity: state.player.name,
        message: text,
      });
      commit("SET_INPUT_TEXT", "");
    },
    enterDungeon({ commit, state }, pos: Vector) {
      if (state.dungeons[pos.toString()]) {
        console.log("entering old dungeon");
        commit("SET_WORLD_STATE", WorldState.Dungeon);
      } else {
        console.log("new dungeon now");
        const dungeon: Dungeon = generateRandomDungeon(pos);
        commit("SET_DUNGEON", dungeon);
        commit("SET_WORLD_STATE", WorldState.Dungeon);
      }
    },
    exitDungeon({ commit }) {
      commit("SET_WORLD_STATE", WorldState.Overworld);
    },
    highlight({ commit }, tiles) {
      commit("HIGHLIGHT_TILES", tiles);
    },
    moveCreature({ commit }, { creature, newPos }: { creature: Creature; newPos: Vector }) {
      commit("MOVE_CREATURE", { creature, newPos });
    },
    movePlayer({ state, commit }, dir: Direction) {
      if (state.player.currentActivityState === ActivityState.MOVING) {
        commit("MOVE_PLAYER", parseDir(dir));
      } else if (state.player.currentActivityState === ActivityState.DEAD) {
        commit("ADD_MESSAGE", {
          entity: "",
          message: "You cannot move when you are dead.",
        });
      } else {
        commit("ADD_MESSAGE", {
          entity: "Can't esacpe!",
          message: "You can't move while you're being attacked. Use \"r\" to attempt to run away.",
        });
      }
    },
    parseCommand(_, command) {
      console.log("Parsing", command);
    },
    // receiveInput({ commit }, input) {
    // gsMan.receiveInput(input);
    // },
    setCommandMode({ commit }, mode) {
      commit("SET_COMMAND_MODE", mode);
    },
    setDisplayOrigin({ commit }, vector) {
      commit("SET_DISPLAY_ORIGIN", vector);
    },
    setDungeon({ commit }, dungeon: Dungeon) {
      commit("SET_DUNGEON", dungeon);
    },
    setInputText({ commit }, text) {
      commit("SET_INPUT_TEXT", text);
    },
    setPlayer({ commit }, player) {
      commit("SET_PLAYER", player);
    },
    setPlayerName({ commit }, name) {
      commit("SET_PLAYER_NAME", name);
    },
    setSplash({ commit }, val) {
      commit("SET_SPLASH", val);
    },
    setWorld({ commit }, world) {
      commit("SET_WORLD", world);
    },
    toggleDrawDungeon({ commit }) {
      commit("TOGGLE_DRAW_DUNGEON");
    },
    togglePaused({ commit }) {
      commit("TOGGLE_PAUSED");
    },
    // startGame({ commit }) {
    // commit("START_GAME");
    // },
  },

  getters: {
    creatures: (state): {[location: string]: Creature[]} => state.creatures,
    creaturesAt: (state): (x: number, y: number) => Creature[] => (x, y) =>
      state.creatures[VTS(x, y)] || [],
    creaturesWithinRadius: state => (
      pos: Position,
      radius: number = 10
    ): Record<string, Creature[]> => {
      if (!pos) {
        console.warn("No player position in creatureWithinRadius, returning all creatures");
        return state.creatures;
      }
      const creatures: Record<string, Creature[]> = {};
      for (let y = pos.y - radius; y < pos.y + radius; y++) {
        for (let x = pos.x - radius; x < pos.x + radius; x++) {
          if (state.creatures[VTS(x, y)]) {
            creatures[VTS(x, y)] = state.creatures[VTS(x, y)];
          }
        }
      }
      return creatures;
    },
    currentDungeon: (state): Dungeon => state.dungeons[state.player.position.key],
    currentDungeonWalls: (state): number[][] => {
      const pos = state.player.position;
      const dungeon = state.dungeons[pos.key];
      return dungeon.walls;
    },
    displayOrigin: state => state.displayOrigin,
    dungeon: state => (pos: Vector) => state.dungeons[pos.toString()],
    gamePaused: state => state.gamePaused,
    goldOnTile: state => (x: number, y: number) => {
      if (state.world) {
        const { tile } = getTile(state.world, x, y);
        return tile.gold;
      }
      return 0;
    },
    highlit: state => state.highlit || {},
    inputText: state => state.inputText,
    instantMode: state => state.commandMode === "instant",
    itemsOnTile: state => (x: number, y: number) => {
      if (state.world) {
        const { tile } = getTile(state.world, x, y);
        return tile.items;
      }
      return [];
    },
    messages: state => state.messages,
    player: state => state.player,
    playerLevel: state => state.player.level,
    playerName: state => state.player.name,
    playerPos: (state): Position => state.player.position || new Position(0, 0),
    splash: state => state.splash,
    surroundings: state => (radius: number = 2) => {
      if (!state.world) {
        return;
      }

      let surr: Surroundings = {
        creatures: [],
        items: {},
      };

      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          const pos: Vector = [state.player.position.x + x, state.player.position.y + y];

          const creatures = state.creatures[VTS(...pos)];

          if (creatures && creatures.length > 0) {
            const dir = getDirStringFromVector(x, y);
            const dist = Math.abs(x) + Math.abs(y);
            const creaturesHere = creatures
              .filter((creature: Creature) => !creature.isDead())
              .map((creature: Creature) => ({
                creature,
                dir,
                dist,
              }));
            surr.creatures = surr.creatures.concat(creaturesHere);
          }

          const { tile } = getTile(state.world, ...pos);
          if (tile.items.length) {
            tile.items.forEach((item: Item) => {
              if (surr.items[item.name]) {
                surr.items[item.name].count++;
                surr.items[item.name].locations[VTS(...pos)] = {};
                if (surr.items[item.name].expanded[VTS(x, y)]) {
                  surr.items[item.name].expanded[VTS(x, y)].count++;
                  surr.items[item.name].expanded[VTS(x, y)].totalValue += item.val;
                } else {
                  surr.items[item.name].expanded[VTS(x, y)] = {
                    count: 1,
                    dir: getDirStringFromVector(x, y),
                    loc: {
                      [VTS(...pos)]: {},
                    },
                    name: item.name,
                    plural: item.plural,
                    totalValue: item.val,
                  };
                }
              } else {
                surr.items[item.name] = {
                  count: 1,
                  expanded: {
                    [VTS(x, y)]: {
                      count: 1,
                      dir: getDirStringFromVector(x, y),
                      loc: {
                        [VTS(...pos)]: {},
                      },
                      name: item.name,
                      plural: item.plural,
                      totalValue: item.val,
                    },
                  },
                  locations: {
                    [VTS(...pos)]: {},
                  },
                  name: item.name,
                  plural: item.plural,
                };
              }
            });
          }
          if (tile.gold) {
            if (surr.items["gold"]) {
              surr.items["gold"].count++;
              surr.items["gold"].locations[VTS(...pos)] = {};
              surr.items["gold"].expanded[VTS(x, y)] = {
                count: tile.gold,
                dir: getDirStringFromVector(x, y),
                loc: {
                  [VTS(...pos)]: {},
                },
                name: "gold",
                plural: "gold",
                totalValue: tile.gold,
              };
            } else {
              surr.items["gold"] = {
                count: tile.gold,
                expanded: {
                  [VTS(x, y)]: {
                    count: tile.gold,
                    dir: getDirStringFromVector(x, y),
                    loc: {
                      [VTS(...pos)]: {},
                    },
                    name: "gold",
                    plural: "gold",
                    totalValue: tile.gold,
                  },
                },
                locations: {
                  [VTS(...pos)]: {},
                },
                name: "gold",
                plural: "gold",
              };
            }
          }
        }
      }

      surr.creatures.sort((a, b) => {
        if (a.dist !== b.dist) {
          return a.dist - b.dist; // Sort by distance
        } else if (a.creature.level !== b.creature.level) {
          return b.creature.level - a.creature.level; // Then descending order of level
        } else {
          return b.creature.hp.current - a.creature.hp.current; // Then amount of hp
        }
      });

      return surr;
    },
    world: state => state.world,
    worldExists: state => !!state.world,
    worldState: state => state.worldState,
  },

  mutations: {
    ADD_CREATURE(state, creature: Creature) {
      if (state.creatures[VTS(creature.position.x, creature.position.y)]) {
        const creatures = state.creatures[VTS(creature.position.x, creature.position.y)]
          .concat([creature])
          .sort((a, b) => b.level - a.level);
        state.creatures[VTS(creature.position.x, creature.position.y)] = creatures;
      } else {
        Vue.set(state.creatures, creature.position.key, [creature]);
      }
    },
    ADD_MESSAGE(state, { entity, message }: Message) {
      state.messages.push({
        entity: entity,
        message: message,
      });
    },
    CLEAR_HIGHLIGHTED(state) {
      state.highlit = {};
    },
    DROP_ITEMS(state, { gold, items, pos }: { gold: number; items: Item[]; pos: Position }) {
      const { tile } = getTile(state.world!, pos.x, pos.y);
      tile.items.push(...items);
      tile.gold += gold;
    },
    HIGHLIGHT_TILES(state, tiles) {
      state.highlit = tiles;
    },
    MOVE_CREATURE(state, { creature, newPos }: { creature: Creature; newPos: Vector }) {
      if (state.creatures[VTS(...newPos)]) {
        state.creatures[VTS(...newPos)].push(
          ...state.creatures[creature.position.key].splice(
            state.creatures[creature.position.key].indexOf(creature),
            1
          )
        );
        state.creatures[VTS(...newPos)].sort((a, b) => b.level - a.level);
      } else {
        Vue.set(
          state.creatures,
          VTS(...newPos),
          state.creatures[creature.position.key].splice(
            state.creatures[creature.position.key].indexOf(creature),
            1
          )
        );
      }
    },
    MOVE_PLAYER(state, [x, y]) {
      state.player.position.x += x;
      state.player.position.y += y;
    },
    SET_COMMAND_MODE(state, mode) {
      state.commandMode = mode;
    },
    SET_DISPLAY_ORIGIN(state, vector) {
      state.displayOrigin = vector;
    },
    SET_DUNGEON(state, dungeon: Dungeon) {
      if (!state.dungeons[dungeon.worldEntrancePos.toString()]) {
        state.dungeons[dungeon.worldEntrancePos.toString()] = dungeon;
      } else {
        console.error(`Dungeon already exists at ${dungeon.worldEntrancePos}`);
      }
    },
    SET_INPUT_TEXT(state, text) {
      state.inputText = text;
    },
    SET_PLAYER(state, player) {
      state.player = player;
    },
    SET_PLAYER_NAME(state, name) {
      state.player.name = name;
    },
    SET_SPLASH(state, val) {
      state.splash = val;
    },
    SET_WORLD(state, world) {
      Vue.set(state, "world", world);
    },
    SET_WORLD_STATE(state, ws: WorldState) {
      state.worldState = ws;
    },
    START_GAME() {
      console.log("Probably not going to work here buddy");
    },
    TOGGLE_PAUSED(state) {
      state.gamePaused = !state.gamePaused;
    },
  },

  state: InitialState,
});

export default store;
