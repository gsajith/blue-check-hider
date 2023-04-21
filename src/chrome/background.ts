import { type ChromeMessage, Sender } from '../types'
type MessageResponse = (response?: any) => void

chrome.runtime.onInstalled.addListener(() => {
  console.log('Installed')
})

chrome.runtime.onMessage.addListener(
  (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: MessageResponse
  ) => {
    if (message.from === Sender.Content && message.type === 'parsed-page') {
      console.log(message.message)
    }
  }
)
