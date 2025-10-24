const { app, BrowserWindow } = require('electron')
const isDev = process.env.NODE_ENV === 'development'

if (!isDev) {
  const express = require("../backend/dist/index")
}
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

function createWindow() {
  let win = new BrowserWindow({
    show: false,
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { nodeIntegration: true },
  })
  // win.webContents.openDevTools()
  win.maximize()

  win.loadURL(isDev ? 'http://localhost:3000' : 'http://localhost:4000')
  win.setMenu(null)
  win.once('ready-to-show', () => {
    win.show()
  });

  win.focus()
}

app.whenReady().then(createWindow)

const adminClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

const sqlFilePath = path.join(__dirname, '../backend/prisma/migrations/20230817133741_dev/migration.sql')
const sqlFileContent = fs.readFileSync(sqlFilePath, 'utf8')

adminClient.connect()

const createDatabaseQuery = 'CREATE DATABASE sistolda'
adminClient.query(createDatabaseQuery, (dbErr) => {
  if (dbErr) {
    console.error('Erro ao criar o banco de dados: ', dbErr)
    adminClient.end()
  } else {
    console.log('Banco de dados criado com sucesso')

    adminClient.end()

    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'sistolda',
      password: 'postgres',
      port: 5432,
    })

    client.connect()

    client.query(sqlFileContent, (sqlErr) => {
      if (sqlErr) {
        console.error('Erro ao executar o arquivo SQL: ', sqlErr)
      } else {
        console.log('Arquivo SQL executado com sucesso (tabelas criadas)')
      }
      client.end()
    })
  }
})