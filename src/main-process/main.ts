/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { app, BrowserWindow, ipcMain, dialog,webContents } from 'electron'
/* import * as PouchDB from 'pouchdb'; */
import * as path from 'path'
import * as url from 'url'
const args = process.argv.slice(1)
const serve = args.some(val => val === '--serve')

export class MainProcess {
    private static initWinTitle = 'MainWindow';
    private static mainWindowId:number;
    private window!: BrowserWindow
    // private Dblocation:string

    constructor() {
        app.requestSingleInstanceLock()
        if (!app.hasSingleInstanceLock()) {
            console.log(' ............................................')
            console.log(' A Instance of The Application is running ...')
            console.log(' ............................................')
            app.quit()
        }
        // app.setAppLogsPath(MainProcess.logpath);
        /* this.Dblocation = 'D:/node/angular/PouchDB'; */
    }

    createWindow():void  {
        this.window = new BrowserWindow({
                title: MainProcess.initWinTitle,
                width: 1050,
                height: 700,
                minWidth: 600,
                minHeight: 400,
                frame: false,
                useContentSize: true,
                icon:'./icns/icon.ico',
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                    nodeIntegrationInWorker: true
                }
        })
        if ( this.window == null ){
            console.log(' Window is Null')
            throw new Error('Window is Null')
        }
        if (__DEV__) {
            /* require('electron-reload')(__dirname, {
              electron: require(`${__dirname}/node_modules/electron`)
            }); */
            this.window.loadURL('http://localhost:4200')
        } else {
          this.window.loadURL(url.format({
                pathname: path.join(__dirname, `../renderer/index.html`),
                protocol: 'file:',
                slashes: true
                })
            )
        }

        if (serve)
        this.window.webContents.openDevTools()
        MainProcess.mainWindowId=this.window.id

        this.window.once('ready-to-show', () => {
                if (this.window.getTitle() !== 'Confirm-Window')
                this.window.show()
        })

        this.window.on('closed', () => {
            console.log(' closed event catched')
            // window = null
        })

        this.window.webContents.on('did-fail-load', (event, errorCode ,errorDescription ,validatedURL ) => {
            console.log('Your Ng Electron app (or other code) in the main window has crashed.')
            console.log('This is a serious issue that needs to be handled and/or debugged.')
            console.log(`errorCode :${errorCode} ,errorDescription :${errorDescription},validatedURL :${validatedURL}`)
            throw new Error('Window Loading Fail')
        })

        this.window.webContents.on('crashed', () => {
            console.log('Your Ng Electron app (or other code) in the main window has crashed.')
            console.log('This is a serious issue that needs to be handled and/or debugged.')
            throw new Error('Window Loading Fail')
        })

        this.window.on('unresponsive', () => {
            console.log('Your Ng Electron app (or other code) has made the window unresponsive.')
        })

        this.window.on('responsive', () => {
            console.log('The main window has become responsive again.')
        })
    }

    run() {

        app.on('ready', () => {
            this.createWindow()
        })

        ipcMain.on('window.close', (event, id) => {
            const currentWindow = BrowserWindow.fromId(id)
            if (currentWindow != null)
                currentWindow.close()
        })

        ipcMain.on('window.exist', (event, id) => {
            const currentWindow = BrowserWindow.fromId(id)
            if (currentWindow != null)
                event.returnValue = true
            else
                event.returnValue = false
        })

        ipcMain.on('window.hide', (event, id) => {
            const currentWindow = BrowserWindow.fromId(id)
            if (currentWindow != null)
                currentWindow.hide()
        })

        ipcMain.on('window.show', (event, id) => {
            const currentWindow = BrowserWindow.fromId(id)
            if (currentWindow != null)
                currentWindow.show()
        })

        ipcMain.on('dialog.Show', (event, { windowTitle, features, requestId, eventName }) => {
            const currentWindow = BrowserWindow.fromId(MainProcess.mainWindowId)
            if (currentWindow != null) {
                dialog.showOpenDialog(currentWindow,features).then(result => {
                    event.reply('window.addEventListener.' + eventName,{ requestId, result })
                }).catch(err => {
                    event.reply('window.addEventListener.' + eventName,{ requestId })
                })
            }
        })

        ipcMain.on('document-insert',(event:any,item:any)=>{
            console.log(item)
            /* let schema= path.join(this.Dblocation,item.schema);
            let database = new PouchDB(schema,{ auto_compaction: true});
            database.put(item.document).then( result=> {
                    console.log(result);
                    event.reply('insert-sucess', result);
            }).catch(   error=>{
                event.reply('insert-fail', error);
                console.log(error)
            }).finally(
                ()=>database.close()
            ) */
        })

        ipcMain.on('document-retrive',(event:any,item:any)=>{
            console.log(item)
            /* let schema= path.join(this.Dblocation,item.schema);
            let database = new PouchDB(schema,{ auto_compaction: true});
            database.get(item.id)
            .then( result=> {
                event.reply('retrival-sucess', result)
            }).catch((error)=>{
                event.reply('retrival-fail', error)
                console.log(error)
            }).finally(
                ()=>database.close()
            ) */
        })

        ipcMain.on('document-delete',(event:any,item:any)=>{
            console.log(item)
            /* let schema= path.join(this.Dblocation,item.schema);
            let database = new PouchDB(schema,{ auto_compaction: true});
            database.remove(item.document)
            .then( result=> {
                event.reply('delete-sucess', result)
            }).catch((error)=>{
                event.reply('delete-fail', error)
                console.log(error)
            })
            database.close(); */
        })

        app.on('quit', (event, exitCode) => {
            console.log(` Application is going to be Exit with code ${exitCode}`)
        })

        app.on('gpu-process-crashed', (event, killed) => {
            if (!killed) {
                console.log(` GPU Process Crashed is going to be close the Application`)
                app.quit()
            }
        })

        app.on('renderer-process-crashed', (event, webcontent:webContents, killed:boolean ) => {
            if (!killed) {
                console.log(` GPU Process Crashed is going to be close the Application`)
                app.quit()
            }
        })

        app.on('window-all-closed', () => {
            console.log(` window-all-closed event catched`)
            app.quit()
        })
    }
}


const mainProcess = new MainProcess()
mainProcess.run()
