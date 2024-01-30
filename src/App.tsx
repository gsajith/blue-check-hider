/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState } from 'react'
import { getCurrentTabUId } from './chrome/utils'
import { Accordion } from './components/Accordion'
import ToggleSwitch from './components/ToggleSwitch'

export const App = (): JSX.Element => {
  const [names, setNames] = useState<string[]>([])
  const [allNames, setAllNames] = useState<string[]>([])
  const [currentTabId, setCurrentTabId] = useState<number>(-1)
  const [hidingEnabled, setHidingEnabled] = useState<boolean>(true)
  const [hideRepliesOnly, setHideRepliesOnly] = useState<boolean>(false)
  const [hideGoldChecks, setHideGoldChecks] = useState<boolean>(true)
  const [hideGreyChecks, setHideGreyChecks] = useState<boolean>(true)
  const [fullyHide, setFullyHide] = useState<boolean>(false)
  const initialLoadFlagHiding = React.useRef(true)
  const initialLoadFlagHideRepliesOnly = React.useRef(true)
  const initialLoadFlagFullyHide = React.useRef(true)
  const initialLoadFlagHideGold = React.useRef(true)
  const initialLoadFlagHideGrey = React.useRef(true)

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      getCurrentTabUId((id) => { setCurrentTabId(id ?? -1) })

      if (
        message.from === 'content' &&
        message.type === 'parsed-page' &&
        sender?.tab?.id === currentTabId
      ) {
        setNames(message.message.names)

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
    if (initialLoadFlagHiding.current) {
      chrome.storage.local.get('hidingEnabled').then((result) => {
        if (result.hidingEnabled === undefined) {
          chrome.storage.local.set({ hidingEnabled })
        }
      })
      initialLoadFlagHiding.current = false
    } else {
      chrome.storage.local.set({ hidingEnabled })
    }
  }, [hidingEnabled])

  useEffect(() => {
    // Save enabled state to local storage
    if (initialLoadFlagHideRepliesOnly.current) {
      chrome.storage.local.get('hideRepliesOnly').then((result) => {
        if (result.hideRepliesOnly === undefined) {
          chrome.storage.local.set({ hideRepliesOnly })
        }
      })
      initialLoadFlagHideRepliesOnly.current = false
    } else {
      chrome.storage.local.set({ hideRepliesOnly })
    }
  }, [hideRepliesOnly])

  useEffect(() => {
    // Save enabled state to local storage
    if (initialLoadFlagFullyHide.current) {
      chrome.storage.local.get('fullyHide').then((result) => {
        if (result.fullyHide === undefined) {
          chrome.storage.local.set({ fullyHide })
        }
      })
      initialLoadFlagFullyHide.current = false
    } else {
      chrome.storage.local.set({ fullyHide })
    }
  }, [fullyHide])

  useEffect(() => {
    // Save enabled state to local storage
    if (initialLoadFlagHideGold.current) {
      chrome.storage.local.get('hideGoldChecks').then((result) => {
        if (result.hideGoldChecks === undefined) {
          chrome.storage.local.set({ hideGoldChecks })
        }
      })
      initialLoadFlagHideGold.current = false
    } else {
      chrome.storage.local.set({ hideGoldChecks })
    }
  }, [hideGoldChecks])

  useEffect(() => {
    // Save enabled state to local storage
    if (initialLoadFlagHideGrey.current) {
      chrome.storage.local.get('hideGreyChecks').then((result) => {
        if (result.hideGreyChecks === undefined) {
          chrome.storage.local.set({ hideGreyChecks })
        }
      })
      initialLoadFlagHideGrey.current = false
    } else {
      chrome.storage.local.set({ hideGreyChecks })
    }
  }, [hideGreyChecks])

  useEffect(() => {
    // Get enabled state from local storage
    chrome.storage.local.get('hidingEnabled').then((result) => {
      if (result.hidingEnabled !== undefined) {
        setHidingEnabled(result.hidingEnabled)
      } else {
        setHidingEnabled(true)
      }
    })
    chrome.storage.local.get('hideRepliesOnly').then((result) => {
      if (result.hideRepliesOnly !== undefined) {
        setHideRepliesOnly(result.hideRepliesOnly)
      } else {
        setHideRepliesOnly(false)
      }
    })
    chrome.storage.local.get('fullyHide').then((result) => {
      if (result.fullyHide !== undefined) {
        setFullyHide(result.fullyHide)
      } else {
        setFullyHide(false)
      }
    })
    chrome.storage.local.get('hideGoldChecks').then((result) => {
      if (result.hideGoldChecks !== undefined) {
        setHideGoldChecks(result.hideGoldChecks)
      } else {
        setHideGoldChecks(true)
      }
    })
    chrome.storage.local.get('hideGreyChecks').then((result) => {
      if (result.hideGreyChecks !== undefined) {
        setHideGreyChecks(result.hideGreyChecks)
      } else {
        setHideGreyChecks(true)
      }
    })
  }, [])

  return (
    <div>
      <div style={{ padding: 12 }}>
        <ToggleSwitch onText="Hiding enabled" offText="Hiding disabled" handleChecked={(checked) => { setHidingEnabled(checked) }} checked={hidingEnabled} />
      </div>

      <div style={{ padding: 12 }}>
        <ToggleSwitch onText="Hide gold checks (organizations)" offText="Hide gold checks (organizations)" handleChecked={(checked) => { setHideGoldChecks(checked) }} checked={hideGoldChecks} />
      </div>

      <div style={{ padding: 12 }}>
        <ToggleSwitch onText="Hide grey checks (government)" offText="Hide grey checks (government)" handleChecked={(checked) => { setHideGreyChecks(checked) }} checked={hideGreyChecks} />
      </div>

      <div style={{ padding: 12 }}>
        <ToggleSwitch onText="Don't even show the 'tweet hidden' message" offText="Don't even show the 'tweet hidden' message" handleChecked={(checked) => { setFullyHide(checked) }} checked={fullyHide} />
      </div>

      <div style={{ padding: 12 }}>
        <ToggleSwitch onText="Applies to replies only" offText="Applies to all tweets" handleChecked={(checked) => { setHideRepliesOnly(checked) }} checked={hideRepliesOnly} />
      </div>

      <Accordion items={names} title={'found on this page'} />
      <br /><br />
      <div style={{ display: 'none' }}>
        <Accordion items={allNames} title={'total found'} />
      </div>
    </div>
  )
}
