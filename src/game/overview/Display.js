import ROT from "rot-js";
import config from "../config/display";

var display = new ROT.Display({
  fontSize: config.fontSize,
  fg: "#daddd8",
  // bg: "#47681D",
  bg: "#1e1e1e",
  // bg: "#9e9e9e", // For debugging
  forceSquareRatio: true
});

export default display;
