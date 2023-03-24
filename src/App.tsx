import React, { useEffect, useState } from 'react'
import { getCurrentTabUId } from './chrome/utils'
import { Accordion } from './components/Accordion'

export const App = (): JSX.Element => {
  const [names, setNames] = useState<string[]>([])
  const [allNames, setAllNames] = useState<string[]>([])
  const [currentTabId, setCurrentTabId] = useState<number>(-1)

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      getCurrentTabUId((id) => { setCurrentTabId(id ?? -1) })

      if (
        message.from === 'content' &&
        message.type === 'parsed-page' &&
        sender?.tab?.id === currentTabId
      ) {
        setNames(message.message.names)

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        chrome.storage.local.get('storedBlueCheckNames').then((storedNames) => {
          if (storedNames.storedBlueCheckNames !== null) {
            setAllNames(storedNames.storedBlueCheckNames)
          }
        })
      }
    })
  }, [currentTabId])

  return (
    <div>
      <h3>{currentTabId}</h3>
      <Accordion items={names} title={'found on this page'} />
      <br/><br/>
      <Accordion items={allNames} title={'total found'} />
    </div>
  )
}
