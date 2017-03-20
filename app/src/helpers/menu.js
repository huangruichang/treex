
import { BrowserWindow } from 'electron'

const createMenu = (app) => {
  let menu = [
    {
      label: '视图',
      submenu: [
        {
          label: '重新加载',
          click: () => {
            BrowserWindow.getFocusedWindow().reload()
          },
        },
        {
          label: '打开调试工具',
          click: () => {
            BrowserWindow.getFocusedWindow().toggleDevTools()
          },
        },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '文档',
          click: () => {

          },
        },
      ],
    },
  ]

  if (process.platform === 'darwin') {
    let name = app.getName()
    menu.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: 'Services',
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers',
        },
        {
          label: 'Show All',
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.exit(0)
          },
        },
      ],
    })
  }

  return menu
}

export default createMenu
