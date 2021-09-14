const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * max) + min
}

export default getRandomNumber
