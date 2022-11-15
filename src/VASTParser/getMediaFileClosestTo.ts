import Logger from './../Logger'
import getNodeValue from './getNodeValue'

const getClosest = (data: any, toFind: number): any => {
  // @ts-expect-error
  return data.reduce(({ width, ...restof }, { width: a, ...rest }) => {
    return Math.abs(toFind - a) < Math.abs(toFind - width) ? { width: a, ...rest } : { width, ...restof }
  })
}

const getMediaFilesArray = (mediaFiles: any): any => {
  const mediaFilesArray = []
  for (let i = 0; i < mediaFiles.length; i++) {
    const mediaFileNode = mediaFiles[i]
    if (mediaFileNode.getAttribute('type') !== 'video/mp4') continue
    mediaFilesArray.push({
      width: mediaFileNode.getAttribute('width'),
      src: getNodeValue(mediaFileNode)
    })
    Logger.log('mediaFileNode is', mediaFileNode)
  }
  return mediaFilesArray
}

const GetMediaFileClosestTo = (mediaFiles: any, width: number): any => {
  Logger.log('mediaFiles is:', mediaFiles)
  const mediaFilesArray = getMediaFilesArray(mediaFiles)
  Logger.log('mediaFilesArray is:', mediaFilesArray)
  const mediaFile = getClosest(mediaFilesArray, width)
  Logger.log('mediaFile is:', mediaFile)
  return mediaFile
}

export default GetMediaFileClosestTo
