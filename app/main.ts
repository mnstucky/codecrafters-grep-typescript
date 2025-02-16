const args = process.argv;
const pattern = args[3];

const testResult = matchPattern('cat', 'cat$');
const inputLine: string = await Bun.stdin.text();

function matchAtPosition(inputChar: string, pattern: string): boolean {
  if (pattern === '' || pattern === undefined) {
    return true;
  }
  else if (pattern.length === 1) {
    return inputChar === pattern;
  } else if (pattern === '\\d') {
    return (inputChar >= '0' && inputChar <= '9')
  } else if (pattern === '\\w') {
    return inputChar.toLowerCase() !== inputChar.toUpperCase();
  } else if (pattern.startsWith('[^') &&
    pattern.endsWith(']')) {
    const charactersToNotMatch = pattern.substring(2, pattern.length - 1);
    return !charactersToNotMatch.includes(inputChar);
  } else if (pattern.startsWith('[') &&
    pattern.endsWith(']')) {
    const charactersToMatch = pattern.substring(1, pattern.length - 1);
    return charactersToMatch.includes(inputChar);
  }
  else {
    throw new Error(`Unhandled pattern: ${pattern}`);
  }
}

function matchPattern(inputLine: string, pattern: string): boolean {
  const startOfLine = pattern.startsWith('^');
  const endOfLine = pattern.endsWith('$');
  let patternPos = startOfLine ? 1 : 0;
  let match = false;
  for (let inputPos = 0; inputPos < inputLine.length; inputPos++) {
    let patternToMatch = pattern[patternPos] ?? '';
    if (patternToMatch === '\\') {
      patternToMatch = pattern.substring(patternPos, patternPos + 2);
    }
    else if (patternToMatch === '[') {
      const endOfGroup = pattern.substring(patternPos).indexOf(']');
      patternToMatch = pattern.substring(patternPos, endOfGroup + 1);
    }
    match = matchAtPosition(inputLine[inputPos], patternToMatch);
    if (startOfLine && !match) {
      return false;
    }
    if (endOfLine && !match && inputPos === inputLine.length - 1) {
      return false;
    }
    if (match) {
      patternPos += patternToMatch.length;
    }
  }
  if (patternPos < (endOfLine ? pattern.length + 1 : pattern.length)) {
    return false;
  }
  return match;
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
