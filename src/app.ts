//Core framework
import express = require('express');
import bodyParser = require('body-parser');

export class App {

    //#region Properties
    
    private _expressApp : express.Application;

    //#endregion

    //#region Methods

    constructor( port: number )
    {
        //Create Express App
        this._expressApp = express();
        this._expressApp.set('port', port);

        this.middleware();        
    }

    private middleware():void 
    {
        //Parser
        this._expressApp.use(bodyParser.json());

        //Test
        this._expressApp.get('/', ( request:express.Request, response: express.Response )=>{
            
                response.json({
                    message: "Servidor funcionando correctamente"
                });
            
            });
    }

    //#endregion


    //#region Accessors

    get instanceApp(): express.Application {
        return this._expressApp;
    }

    //#endregion
}
