const { app, BrowserWindow } = require('electron');
const { createServer } = require('./server/index.js');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadURL('http://localhost:3000/index.html?token='+process.env.MAPBOX_API_TOKEN);
}

app.whenReady().then(async () => {
    await createServer();
    createWindow();
})