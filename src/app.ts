//Core framework
import express = require('express');
import bodyParser = require('body-parser');

interface Persona 
{
    id : number,
    nombre: string,
    apellido: string,
    edad: number
}

export class App {

    //#region Properties
    
    private _expressApp : express.Application;


    private _personas : Array<Persona> =
    [
        { id: 1, nombre: "Juan", apellido: "Rodriguez", edad: 20 },
        { id: 2, nombre: "Mario", apellido: "Martinez", edad: 18 },
        { id: 3, nombre: "Rodrigo", apellido: "Alvarado", edad: 22 }
    ];

    //#endregion

    //#region Methods

    constructor( port: number )
    {
        //Create Express App
        this._expressApp = express();
        this._expressApp.set('port', port);

        this.middleware();
        this.createMethods(this)     
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

        this._expressApp.all('/*', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
            next();
        });
    }

    private createMethods (app : App) 
    {    
        app.instanceApp.get('/api/persona', function (req, res) {
            res.json(app.personas);
        });
        
        app.instanceApp.get('/api/persona/:id', function (req, res) {
        
            var idPersona = req.params.id;
        
            var index = 0;
            for (var i = 0; i < app.personas.length; i ++)
                if (app.personas[i].id == idPersona)
                    index = i;
            
            res.json(app.personas[index]);
        });
        
        app.instanceApp.post('/api/persona', function (req, res) {
        
            var nuevaPersona = req.body;
        
            app.personas.sort((a, b) => {
                if (a.id < b.id)
                    return -1;
                if (a.id > b.id)
                    return 1;
                return 0;
            })
        
            var nuevoId = app.personas[app.personas.length-1].id + 1;
            nuevaPersona.id = nuevoId;
            app.personas.push(nuevaPersona);    
        
            res.json(nuevaPersona);
        });
        
        app.instanceApp.put('/api/persona', function (req, res) {
        
            var persona = req.body;
        
            var index = 0;
        
            for (var i = 0; i < app.personas.length; i ++)
                if (app.personas[i].id == persona.id)
                    index = i;
            
                    app.personas[index] = persona;
        
            res.json(persona);
        });
        
        app.instanceApp.delete('/api/persona/:id', function (req, res) {
        
            var idPersona = req.params.id;
        
            var index = 0;
            for (var i = 0; i < app.personas.length; i ++)
                if (app.personas[i].id == idPersona)
                    index = i;
        
                    app.personas.splice(index, 1);
            
            res.json( { "status": "ok" });
        });
    }

    
    //#endregion


    //#region Accessors

    get instanceApp(): express.Application {
        return this._expressApp;
    }

    get personas() 
    {
        return this._personas;
    }

    //#endregion
}