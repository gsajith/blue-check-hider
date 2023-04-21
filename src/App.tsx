import React, { useEffect, useState } from 'react'
import { getCurrentTabUId } from './chrome/utils'
import { Accordion } from './components/Accordion'
import ToggleSwitch from './components/ToggleSwitch'

export const App = (): JSX.Element => {
  const [names, setNames] = useState<string[]>([])
  const [allNames, setAllNames] = useState<string[]>([])
  const [currentTabId, setCurrentTabId] = useState<number>(-1)
  const [hidingEnabled, setHidingEnabled] = useState<boolean>(true)
  const initialLoadFlag = React.useRef(true)

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

  useEffect(() => {
    // Save enabled state to local storage
    if (initialLoadFlag.current) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      chrome.storage.local.get('hidingEnabled').then((result) => {
        if (result.hidingEnabled === undefined) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          chrome.storage.local.set({ hidingEnabled })
        }
      })
      initialLoadFlag.current = false
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      chrome.storage.local.set({ hidingEnabled })
    }
  }, [hidingEnabled])

  useEffect(() => {
    // Get enabled state from local storage
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    chrome.storage.local.get('hidingEnabled').then((result) => {
      if (result.hidingEnabled !== undefined) {
        setHidingEnabled(result.hidingEnabled)
      } else {
        setHidingEnabled(true)
      }
    })
  }, [])

  return (
    <div>
      <div style={{ padding: 12 }}>
        <ToggleSwitch onText="Hiding enabled" offText="Hiding disabled" handleChecked={(checked) => { setHidingEnabled(checked) }} checked={hidingEnabled} />
      </div>
      <Accordion items={names} title={'found on this page'} />
      <br /><br />
      <div style={{ display: 'none' }}>
        <Accordion items={allNames} title={'total found'} />
      </div>
    </div>
  )
}
