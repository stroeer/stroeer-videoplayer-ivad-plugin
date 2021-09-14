const getUnixtimestamp = (): number => {
  return Math.floor(Date.now() / 1000)
}

export default getUnixtimestamp
