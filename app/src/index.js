
import { app, BrowserWindow } from 'electron'
import { join } from 'path'

app.on('ready', () => {
  const win = new BrowserWindow({
    width: 480,
    height: 622,
  })
  win.loadURL(`file:\/\/${join(__dirname, 'index.html')}`)
})
