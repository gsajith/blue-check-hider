{
  // TODO: These functions seems brittle
  const getUsernameForCheckSvg = (checkSvg) => {
    const seventhParent =
      checkSvg.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        .parentNode;
    if (seventhParent.dataset.testid === "User-Name") {
      // Name in timeline post
      return seventhParent.children[1].children[0].children[0].children[0]
        .children[0].children[0].innerHTML;
    } else {
      // User cell in side panel or 'Connect' page — suggested users
      const sixthParent = seventhParent.children[0];
      return sixthParent.children[1].children[0].children[0].children[0]
        .children[0].children[0].innerHTML;
    }
  };
  const getUsernameFromUserName = (userName) => {
    return userName.children[0].children[0].children[1].children[0].children[0]
      .children[0].children[0].innerHTML;
  };
  const getUsernameFromUserCell = (userCell) => {
    return userCell.lastChild.children[1].children[0].children[0].children[0]
      .children[1].children[0].children[0].children[0].children[0].children[0]
      .innerHTML;
  };
  const getUsernameFromUser_Name = (user_name) => {
    return user_name.children[1].children[0].children[0].children[0].children[0]
      .children[0].innerHTML;
  };

  const readPage = () => {
    const UserNames = document.querySelectorAll('[data-testid="UserName"]');
    const UserCells = document.querySelectorAll('[data-testid="UserCell"]');
    const User_Names = document.querySelectorAll('[data-testid="User-Name"]');

    const checkSelector = '[data-testid="icon-verified"]';

    const checkNames = new Set();

    UserNames.forEach((userName) => {
      if (userName.querySelectorAll(checkSelector).length > 0) {
        checkNames.add(getUsernameFromUserName(userName));
      }
    });

    UserCells.forEach((userCell) => {
      if (userCell.querySelectorAll(checkSelector).length > 0) {
        checkNames.add(getUsernameFromUserCell(userCell));
      }
    });

    User_Names.forEach((user_name) => {
      if (user_name.querySelectorAll(checkSelector).length > 0) {
        checkNames.add(getUsernameFromUser_Name(user_name));
      }
    });

    console.log(checkNames);

    chrome.runtime.sendMessage(
      {
        from: "content",
        type: "parsed-page",
        data: { names: [...checkNames] },
      },
      function (response) {
        // TODO: Handle response
      }
    );
  };

  readPage();
  const readPageInterval = setInterval(readPage, 1000);
}
