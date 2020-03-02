import { ActivityState } from "../../entities/entity";
import { Direction } from "../../utils/direction";
import { dispatchAction } from "../../../vuex/actions";
import { display } from "../../overview/Display";
import displayConf from "../../config/display.json";
import gameloop from "../../gameloop";
import { GameState } from "../GameState";
import { generateWorld } from "../../world/World";
import { gsMan } from "../gsMan";
import store, { WorldState } from "../../../vuex/store";

export class MainGameState extends GameState {
  constructor() {
    super("main");
  }

  init(): void {
    display.clear();
    display.setOptions(displayConf.main);

    dispatchAction.SetWorld(generateWorld());

    // Resize only after resetting font size to default
    const overviewDiv = document.querySelector("#overview");

    // Don't continue running if div doesn't exist
    if (!overviewDiv) {
      console.error("Overview div not found (css selector #overview)");
      return;
    }

    const { width: divWidth, height: divHeight } = overviewDiv.getBoundingClientRect();
    const [width, height] = display.computeSize(divWidth, divHeight);
    display.setOptions({
      height: height,
      width: width,
    });

    display.drawText(0, 0, "Main state initialised");
    display.drawText(2, 2, "Player: " + store.getters.playerName);

    display.drawWorld();

    dispatchAction.AddMessage({
      entity: "",
      message:
        "You find yourself in the middle of a forest. Looking around, you see trees extending " +
        "off into the distance.",
    });
    dispatchAction.AddMessage({
      entity: "Controls:",
      message:
        "Use the arrow keys to move around. Additionally, you can press 'enter' to enter " +
        "command mode, where you can type commands to interact with the world. Try entering " +
        "/help in this mode for a list of commands. You can press 'escape' to unfocus the " +
        "command input to use arrow keys to move around.",
    });

    gameloop.run();
  }

  redraw(): void {
    display.drawWorld();
  }

  keyDown(input: string) {
    if (store.getters.instantMode) {
      // Handle as an instant command
      switch (input) {
        case "ArrowUp":
          dispatchAction.MovePlayer(Direction.NORTH);
          display.drawWorld();
          break;
        case "ArrowDown":
          dispatchAction.MovePlayer(Direction.SOUTH);
          display.drawWorld();
          break;
        case "ArrowLeft":
          dispatchAction.MovePlayer(Direction.WEST);
          display.drawWorld();
          break;
        case "ArrowRight":
          dispatchAction.MovePlayer(Direction.EAST);
          display.drawWorld();
          break;

        case "a":
          const pos = store.getters.playerPos;
          const creatures = store.getters.creaturesAt(pos.x, pos.y);
          if (creatures.length) {
            let target = 0;
            let haveFoundTarget = false;
            while (target < creatures.length && !haveFoundTarget) {
              if (
                !creatures[target].isDead() &&
                creatures[target].currentActivityState === ActivityState.MOVING
              ) {
                haveFoundTarget = true;
              } else {
                target++;
              }
            }

            if (haveFoundTarget) {
              store.getters.player.targetCreature(creatures[target]);
            } else {
              dispatchAction.AddMessage({
                entity: "",
                message:
                  "You cannot attack these creatures because they are dead or already fighting.",
              });
            }
          } else {
            dispatchAction.AddMessage({
              entity: "",
              message: "There is nothing here to attack.",
            });
          }
          break;
        case "r":
          store.getters.player.run();
          display.drawWorld();
          break;

        case "p":
          dispatchAction.TogglePaused();
          break;

        case "o":
          if (store.getters.worldState === WorldState.Overworld) {
            const pos = store.getters.playerPos;
            dispatchAction.EnterDungeon([pos.x, pos.y]);
          } else {
            dispatchAction.ExitDungeon();
          }
          display.drawWorld();
          break;

        default:
          break;
      }
      dispatchAction.Highlight({});
    }
  }

  keyUp(input: string) {
    if (store.getters.instantMode) {
      // do nothing
    }
  }

  receiveInputText(input: string) {
    if (!store.getters.instantMode) {
      if (/^\/help$/.test(input)) {
        dispatchAction.AddMessage({
          entity: "Help",
          message:
            "Press 'enter' to enter typed command mode, and 'escape' to get back to command " +
            "mode.\nYou can right-click on the map to see what is on that tile.",
        });
      } else {
        if (/^run$/.test(input.trim())) {
          store.getters.player.run();
        } else {
          // Handle as text command
          dispatchAction.AddMessage({
            entity: "Main state",
            message: "Response to " + input,
          });
        }
      }
    }
  }
}

export const gsMain = new MainGameState();
