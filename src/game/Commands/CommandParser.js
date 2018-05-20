// This file will handle all input, parse and call the commands
export default {
  ParseCommand(command) {
    console.log("Parsing: " + command);
    return {
      entity: "Game",
      message: "Response to " + command
    }
  }
}
