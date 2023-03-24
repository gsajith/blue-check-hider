/* eslint-disable @typescript-eslint/no-floating-promises */
{
  // TODO: These functions seems brittle
  const getUsernameFromUserName = (userName: Element): string => {
    return userName.children[0].children[0].children[1].children[0].children[0]
      .children[0].children[0].innerHTML
  }
  const getUsernameFromUserCell = (userCell: Element): string => {
    return (userCell?.lastChild as Element)?.children[1].children[0].children[0].children[0]
      .children[1].children[0].children[0].children[0].children[0].children[0]
      .innerHTML
  }
  const getUsernameFromUsername = (username: Element): string => {
    return username.children[1].children[0].children[0].children[0].children[0]
      .children[0].innerHTML
  }
  const updateStoredCheckNames = async (checkNames: Set<string>): Promise<any> => {
    const storedNames = await chrome.storage.local.get('storedBlueCheckNames')

    let allNames = new Set<string>([...checkNames])

    if (storedNames.storedBlueCheckNames !== undefined) {
      allNames = new Set([...allNames, ...storedNames.storedBlueCheckNames])
    }

    chrome.storage.local.set({
      storedBlueCheckNames: [...allNames]
    })
  }

  const readPage = (): void => {
    const UserNames = document.querySelectorAll('[data-testid="UserName"]')
    const UserCells = document.querySelectorAll('[data-testid="UserCell"]')
    const Usernames = document.querySelectorAll('[data-testid="User-Name"]')

    const checkSelector = '[data-testid="icon-verified"]'

    const checkNames = new Set<string>()

    UserNames.forEach((userName) => {
      if (userName.querySelectorAll(checkSelector).length > 0) {
        checkNames.add(getUsernameFromUserName(userName))
      }
    })

    UserCells.forEach((userCell) => {
      if (userCell.querySelectorAll(checkSelector).length > 0) {
        checkNames.add(getUsernameFromUserCell(userCell))
      }
    })

    Usernames.forEach((username) => {
      if (username.querySelectorAll(checkSelector).length > 0) {
        checkNames.add(getUsernameFromUsername(username))
      }
    })

    updateStoredCheckNames(checkNames)
    chrome.runtime.sendMessage(
      {
        from: 'content',
        type: 'parsed-page',
        message: { names: [...checkNames] }
      },
      function (response) {
        // TODO: Handle response
      }
    )
  }

  readPage()
  setInterval(readPage, 1000)
}

export { }
