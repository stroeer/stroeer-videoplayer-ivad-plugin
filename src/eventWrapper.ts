const eventWrapper = function (eventName: string, eventData?: any): Event {
  const ev = document.createEvent('Event')
  ev.initEvent(eventName, true, true)
  if (eventData !== undefined) {
    (ev as any).detail = eventData
  }
  return ev
}

export default eventWrapper
