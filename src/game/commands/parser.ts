import * as Lexer from "./lexer";

export const parse = (input: string) => Lexer.run(input);
