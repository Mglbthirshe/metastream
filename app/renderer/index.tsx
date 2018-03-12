import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Root from './containers/Root'
import * as cfgStore from './store/configureStore'

import 'styles/app.global.css'

import * as packageJson from 'package.json'
import { PlatformService } from 'renderer/platform'

let store: any
let history: any

function logger() {
  chrome.ipcRenderer.on('log', (event: Electron.Event, payload: { type: string; args: any[] }) => {
    ;(console as any)[payload.type]('[MAIN]', ...payload.args)
  })
}

function init() {
  logger()

  // Set default title
  document.title = packageJson.productName

  history = cfgStore.history
  store = cfgStore.configureStore()

  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root'),
    function() {
      console.info('Render complete', arguments)
    }
  )

  // DEBUG
  const app = Object.create(null)
  Object.assign(app, {
    store,
    platform: PlatformService
  })
  ;(window as any).app = app
}

init()

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root').default
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    )
  })
}
