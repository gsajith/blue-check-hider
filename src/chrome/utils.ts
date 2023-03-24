export const getCurrentTabUrl = (
  callback: (url: string | undefined) => void
): void => {
  const queryInfo = { active: true, lastFocusedWindow: true }

  chrome.tabs.query(queryInfo, (tabs) => {
    callback(tabs[0].url)
  })
}

export const getCurrentTabUId = (
  callback: (id: number | undefined) => void
): void => {
  const queryInfo = { active: true, lastFocusedWindow: true }

  chrome.tabs.query(queryInfo, (tabs) => {
    callback(tabs[0].id)
  })
}
