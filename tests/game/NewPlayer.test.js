import newPlayer from "../../src/game/Generators/NewPlayer";

test("sets the player name to Sam", () => {
  expect(newPlayer("Sam").name).toBe("Sam");
});

test("level defaults to 1", () => {
  expect(newPlayer().attributes.level).toBe(1);
});

test("sets level to 5", () => {
  expect(newPlayer("testPlayer", 5).attributes.level).toBe(5);
});

test("hp is 100 at level 1", () => {
  expect(newPlayer().attributes.currentHP).toBe(100);
});

test("hp is 420 at level 15", () => {
  expect(newPlayer("test", 15).attributes.currentHP).toBe(420);
});