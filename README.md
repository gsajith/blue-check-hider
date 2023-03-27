# Blue Check Blocker

Blue check blocker is a Chrome Extension which detects and creates a block-list of verified users on Twitter.

---

## Development

- Clone the repo.
- Install dependencies with `yarn install`.
- Set up ESLint `npm init @eslint/config`
- Create a `build` folder with `yarn run build` (once) or `yarn run watch` (continuous build).
- Follow the instructions to [load an unpacked Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked), and load the `build` folder generated in the previous step

---

## Progress

### Done

- Scan DOM for blue checks
- Send list of blue checks to Popup via message
- Store both blue checks on current page, and all detected blue checks

### To do

- Set up backend DB
- Button to send data to backend DB
- Button to block the list

## Reference

- [Blue Blocker](https://github.com/kheina-com/Blue-Blocker/): Chrome and Firefox extension. Only blocks users that you come across.
- [Twitter Block Chain](https://github.com/ceceradio/twitter-block-chain): Mass block all users on a followers/following page.
- [Block The Blue](https://twitter.com/BlockTheBlue): Block list using [theblockbot.com](https://www.theblockbot.com/show-blocks/9BjDYX6HOyx7e4_4NT6-Y4YylY3UmpojDxvo6Zu8) to block 282,000+ Twitter Blue users.
