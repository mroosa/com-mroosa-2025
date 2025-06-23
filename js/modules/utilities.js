/* js Utils */

// max/min function
export const randRange = (max, min) => {
  if (min === null) min = 0;
  const range = max - min;
  return Math.floor( Math.random() * range ) + min;
}


// Format a number to human friendly (US) format
export const formatNumber = number => {
  // count the places of non-decimal number
  const numInts = String(number).length;

  //init newNumber
  let newNumber = '';
  let intAry = [];
  if (numInts < 4) {
    // Numbers less than 1000 get two decimal points
    newNumber = String(Number(number).toFixed(2));
  } else {
    // Round off decimals and convert to a string.
    let numStr = String(Number(number).toFixed());

    // Starting 3 from the end, add a comma every 3 digits.
    for (let i = numStr.length - 3; i >= 0; i -= 3) {
      intAry.push(numStr.slice(i, i+3));
    }
    // For numbers not divisible by 3, push remaining numbers
    if (numStr.length % 3 != 0) {
      intAry.push(numStr.slice(0,numStr.length % 3));
    }
    // Reconstitute number
    newNumber = (intAry.reverse()).join();
  }
  
  // return
  return newNumber;
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export const shuffleArray = array => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
