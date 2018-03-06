export default function () {
  const canvas = document.getElementById("overview-canvas");
  const c = canvas.getContext("2d");

  var levelMap = [
    ["↟", "s", "↟", "III", "↟", "↟", "↟", "↟", "¦", "↟", "↟", "o"],
    ["↟", "s", "↟", "| |", "↟", "↟", "Ø", "↟", "↟", "r", "s", "↟"],
    ["↟", "↟", "↟", "| |", "↟", "↟", "↟", "↟", "↟", "↟", "↟", "↟"],
    ["↟", "↟", "↟", "\\ \\", "↟", "↟", "↟", "+", "↟", "↟", "O", "↟"],
    ["↟", "↟", "o", "↟", "\\ \\", "↟", "↟", "↟", "↟", "↟", "↟", "↟"],
    ["↟", "↟", "↟", "↟", "| |", "↟", "↟", "↟", "↟", "o", "↟", "↟"],
    ["@", "s", "↟", "↟", "| |", "↟", "↟", "↟", "↟", "↟", "↟", "o"],
    ["↟", "↟", "↟", "+", "| |", "¢", "#", "↟", "↟", "↟", "↟", "↟"],
    ["↟", "↟", "↟", "↟", "| |", "↟", "«※»", "↟", "↟", "↟", "↟", "↟"],
    ["↟", "↟", "o", "↟", "| |", "↟", "↟", "s", "↟", "↟", "↟", "↟"],
    ["↟", "↟", "↟", "↟", "| |", "O", "↟", "S", "↟", "↟", "S", "↟"],
    ["↟", "v", "↟", "↟", "| |", "↟", "O", "↟", "↟", "ø", "↟", "↟"]
  ];

  c.font = "10px monospace";
  c.fillStyle = "#262626";
  c.fillRect(0, 0, canvas.width, canvas.height);

  var rows = levelMap.length;
  var cols = Math.max(...levelMap.map((row) => row.length));

  var rowHeight = canvas.height / rows - 1;
  var colWidth = canvas.width / cols - 1;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      c.fillStyle = levelMap[j][i] === "↟" ? "green" : "#daddd8";
      c.fillText(levelMap[j][i], colWidth * i + 0.5 * colWidth, rowHeight * j + 0.5 * rowHeight);
    }
  }

  c.beginPath();
  c.strokeStyle = "blue";
  c.moveTo(118, 0);
  c.lineTo(118, 117);
  c.lineTo(151, 148);
  c.lineTo(151, 400);
  c.stroke();
  c.beginPath();
  c.strokeStyle = "blue";
  c.moveTo(124, 0);
  c.lineTo(124, 117);
  c.lineTo(157, 148);
  c.lineTo(157, 400);
  c.stroke();
}