export abstract class GameState {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract init(): void;
  abstract receiveInputText(text: string): void;
  abstract redraw(): void;
}
