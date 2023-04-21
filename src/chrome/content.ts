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

  let unhideCount = 0

  let shouldHide:(boolean | null) = null

  chrome.storage.local.get('hidingEnabled', (result) => {
    if (result.hidingEnabled !== undefined) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      shouldHide = result.hidingEnabled
    }
  })

  const readPage = (): void => {
    // Detects profile page header blue check
    const UserNames = document.querySelectorAll('[data-testid="UserName"]')
    // Detects "You might like" page blue checks
    const UserCells = document.querySelectorAll('[data-testid="UserCell"]')
    // Detects feed blue checks
    const Usernames = document.querySelectorAll('[data-testid="User-Name"]')

    const checkSelector = '[data-testid="icon-verified"]'

    const checkNames = new Set<string>()

    UserNames.forEach((userName) => {
      if (userName.querySelectorAll(checkSelector).length > 0) {
        // This is on profile page, nothing to do here
        // userName.setAttribute('style', 'display: none;')
        checkNames.add(getUsernameFromUserName(userName))
      }
    })

    UserCells.forEach((userCell) => {
      if (userCell.querySelectorAll(checkSelector).length > 0) {
        if (shouldHide === true) {
          userCell.setAttribute('style', 'display: none;')
        }
        checkNames.add(getUsernameFromUserCell(userCell))
      }
    })

    Usernames.forEach((username) => {
      if (username.querySelectorAll(checkSelector).length > 0) {
        const extractedName = getUsernameFromUsername(username)
        if (shouldHide === true) {
          const hideStyle = 'display: none;'
          // const hideStyle = 'background-color: #345345;'
          const parentContainer = username.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
          if (parentContainer !== undefined && parentContainer != null) {
            const hiddenDiv = document.createElement('div')
            const id = `unhide-${unhideCount++}`
            hiddenDiv.setAttribute('style', 'padding: 12px; font-family: sans-serif; color: #1d9bf0; border-bottom: 1px solid #1d9bf0;opacity: 0.5;')
            hiddenDiv.innerHTML = 'Blue check ' + extractedName + ' hidden by extension <u id="' + id + '" style="cursor: pointer;">Show</u>'
            if (parentContainer.children.length === 1) {
              // Single tweet on Timeline
              parentContainer.appendChild(hiddenDiv)
              document.getElementById(id)?.addEventListener('click', (e) => {
                e.preventDefault()
                parentContainer.children[0].lastElementChild?.setAttribute('style', '')
                parentContainer.children[1].setAttribute('style', 'display: none;')
              })
              parentContainer.children[0].lastElementChild?.setAttribute('style', hideStyle)
            } else if (parentContainer.children.length === 4) {
              // Quote tweet on timeline
              parentContainer.insertBefore(hiddenDiv, parentContainer.children[3])
              document.getElementById(id)?.addEventListener('click', (e) => {
                e.preventDefault()
                parentContainer.children[2].lastElementChild?.setAttribute('style', '')
                parentContainer.children[3].setAttribute('style', 'display: none;')
              })
              parentContainer.children[2].lastElementChild?.setAttribute('style', hideStyle)
            }
          }
        }
        checkNames.add(extractedName)
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
  setInterval(readPage, 250)
}

export { }
