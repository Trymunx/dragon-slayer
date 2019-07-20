import { gamePlugin } from "../game/vue-game-plugin";

declare module "vue/types/vue" {
  interface Vue {
    $game: gamePlugin;
  }
}
