// This file will handle all input, parse and call the commands
export default {
  ParseCommand(command) {
    console.log("Parsing: " + command);
    return {
      entity: "Game",
      message: "Response to " + command,
    };
  },
};

// Should import game states here?
// import StartGame from "../GameStates/StartGame";

class CommandParser {
  constructor() {
    this.state = StartGame;
  }

  parse(command) {
    // Moojs parsing things
    let parsed = ["setName"];
    // This part is hard
    // Doesn't work as command will be a string not a function
    // let response = this.state.parsed[command](parsed.args);
    let response = this.state.command(parsed); // Instead of importing functions will have to have a switch in the gamestates
    return response;
  }

  set state(state) {
    this.state = state;
  }
}

// export default new CommandParser;

/* IDEAS
Command parser will parse the text to find commands and arguments.
Each game state will have to have a list of valid commands otherwise should
return "Can't [command] [argument] [state.reason]".
E.g. command = "walk", argument = "south", state = fight, state.reason = "while fighting".
    "Can't walk south while fighting."

States will have all of the state commands in them,
so when importing the states they will export the commands.
*/
