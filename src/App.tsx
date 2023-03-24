import React, { useEffect, useState } from 'react'
import './App.css'
import { getCurrentTabUId } from './chrome/utils'

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
    <div className="App">
      <header className="App-header">
        <h3>{currentTabId}</h3>
        <ul>
          {names.map((name) => <li key={name}>{name}</li>)}
        </ul>
        <br/><br/>
        <ul>
          {allNames.map((name) => <li key={name}>{name}</li>)}
        </ul>
      </header>
    </div>
  )
}
