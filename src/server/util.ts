

export function popRandomElement<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  const randomElement = arr[randomIndex];
  arr.splice(randomIndex, 1);
  return randomElement;
}


  

  


  
  