const args = process.argv;
const pattern = args[3];

const inputLine: string = await Bun.stdin.text();

function matchPattern(inputLine: string, pattern: string): boolean {
  if (pattern.length === 1) {
    return inputLine.includes(pattern);
  } else if (pattern === '\\d') {
    for (const char of inputLine) {
      if (char >= '0' && char <= '9') {
        return true;
      }
    }
    return false;
  } else if (pattern === '\\w') {
    for (const char of inputLine) {
      if (char.toLowerCase() !== char.toUpperCase()) {
        return true;
      }
    }
    return false;
  } else if (pattern.startsWith('[') &&
    pattern.endsWith(']')) {
    const charactersToMatch = pattern.substring(1, pattern.length - 1);
    for (const char of inputLine) {
      if (charactersToMatch.includes(char)) {
        return true;
      }
    }
    return false;
  }
  else {
    throw new Error(`Unhandled pattern: ${pattern}`);
  }
}

if (args[2] !== "-E") {
  console.log("Expected first argument to be '-E'");
  process.exit(1);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.error("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
if (matchPattern(inputLine, pattern)) {
  process.exit(0);
} else {
  process.exit(1);
}
