interface BarParams {
  percentage: number,
  totalLength: number,
  char: string,
  finalChar?: string,
  endChars?: string[]
}

const toBar = ({percentage, totalLength, char, finalChar = "", endChars = ["[", "]"]}: BarParams) => {
  let barLength = Math.round(percentage * totalLength);
  let emptyLength = totalLength - barLength;
  let bar = endChars[0]
  for (let i = 0; i < barLength; i++) {
    bar += char;
  }
  bar += finalChar;
  for (let i = 0; i < emptyLength; i++) {
    bar += " ";
  }
  bar += endChars[1];

  return bar;
}

export default toBar;