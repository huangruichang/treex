
import { app, BrowserWindow, nativeImage, Menu } from 'electron'
import { join, resolve } from 'path'
import createMenu from './helpers/menu'

const icon = nativeImage.createFromPath(resolve(__dirname, './assets/logo/treex-square.png'))

app.dock.setIcon(icon)

app.on('ready', () => {

  const win = new BrowserWindow({
    width: 480,
    height: 622,
  })
  win.setOverlayIcon(icon, '')
  win.setIcon && win.setIcon(icon)
  win.loadURL(`file:\/\/${join(__dirname, 'index.html#\/projects')}`)

  let menu = Menu.buildFromTemplate(createMenu(app))
  Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', () => {
  app.quit()
})
