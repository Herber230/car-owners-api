//Core framework
import express = require('express');
import bodyParser = require('body-parser');
import jwt = require('jsonwebtoken');
import cors = require('cors');

const SECRET_KEY = "secretKey";
// const EXPIRATION_TOKEN = 60; //1 MINUTE
// const EXPIRATION_REFRESH_TOKEN = 1800; // 30 MINUTES
const EXPIRATION_TOKEN = 5; //1 MINUTE
const EXPIRATION_REFRESH_TOKEN = 10; // 30 MINUTES

interface Persona 
{
    id : number,
    nombre: string,
    apellido: string,
    edad: number,
    pass: string,
    user: string
}

interface Automovil
{
    id : number,
    marca : string,
    linea : string,
    color : string,
    modelo : number,
    puertas : number,
    idPersonaPropietaria: number
}

export class App {

    //#region Properties
    
    private _expressApp : express.Application;


    private _personas : Array<Persona> =
    [
        { id: 1, nombre: "Juan", apellido: "Rodriguez", edad: 20 , pass: 'angular' , user: 'jrodriguez' },
        { id: 2, nombre: "Mario", apellido: "Martinez", edad: 18 , pass: 'angular' , user: 'mmartinez' },
        { id: 3, nombre: "Rodrigo", apellido: "Alvarado", edad: 22 , pass: 'angular' , user: 'ralvarado' }
    ];

    private _automoviles : Array<Automovil> =
    [
        { id: 1, marca: 'Toyota', linea: 'Corolla', modelo: 2015, color: 'Blanco', puertas: 4 , idPersonaPropietaria: 1   },
        { id: 2, marca: 'Mazda', linea: 'CX-9', modelo: 2017, color: 'Cafe', puertas: 5 , idPersonaPropietaria: 1  },
        { id: 3, marca: 'Honda', linea: 'Civic', modelo: 2014, color: 'Negro', puertas: 4 , idPersonaPropietaria: 2  },
        { id: 4, marca: 'Kia', linea: 'Sorento', modelo: 2012, color: 'Rojo', puertas: 5 , idPersonaPropietaria: 3  },
        { id: 5, marca: 'Mitsubishi', linea: 'Lancer', modelo: 2015, color: 'Azul', puertas: 4 , idPersonaPropietaria: 3 }
    ]

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

        //Enable CORS Requests
        let options:cors.CorsOptions = 
        {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            //origin: API_URL,
            preflightContinue: false
        };   

        this._expressApp.use(cors(options));
   


        this.protectRoutes(this);
    }

    private createMethods (app : App) 
    {    
        //CRUD PERSONAS
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

        //CRUD ATUMOVILES
        app.instanceApp.get('/api/automovil', function (req, res) {
            res.json(app.automoviles);
        });
        
        app.instanceApp.get('/api/automovil/:id', function (req, res) {
        
            var idAutomovil = req.params.id;
        
            var index = 0;
            for (var i = 0; i < app.automoviles.length; i ++)
                if (app.automoviles[i].id == idAutomovil)
                    index = i;
            
            res.json(app.automoviles[index]);
        });
        
        app.instanceApp.post('/api/automovil', function (req, res) {
        
            var nuevoAutomovil = req.body;
        
            app.automoviles.sort((a, b) => {
                if (a.id < b.id)
                    return -1;
                if (a.id > b.id)
                    return 1;
                return 0;
            })
        
            var nuevoId = app.automoviles[app.automoviles.length-1].id + 1;
            nuevoAutomovil.id = nuevoId;
            app.automoviles.push(nuevoAutomovil);    
        
            res.json(nuevoAutomovil);
        });
        
        app.instanceApp.put('/api/automovil', function (req, res) {
        
            var automovil = req.body;
        
            var index = 0;
        
            for (var i = 0; i < app.automoviles.length; i ++)
                if (app.automoviles[i].id == automovil.id)
                    index = i;
            
            app.automoviles[index] = automovil;
        
            res.json(automovil);
        });
        
        app.instanceApp.delete('/api/automovil/:id', function (req, res) {
        
            var idAutomovil = req.params.id;
        
            var index = 0;
            for (var i = 0; i < app.automoviles.length; i ++)
                if (app.automoviles[i].id == idAutomovil)
                    index = i;
        
            app.automoviles.splice(index, 1);
            
            res.json( { "status": "ok" });
        });

        //Authentication Routes
        
        app.instanceApp.post('/authenticate', (request, response) => 
        {
            let credentials : { user: string, pass: string } = request.body;
            let pFilter = app.personas.filter(p => p.user == credentials.user && p.pass == credentials.pass);
            
            if (pFilter.length > 0)
            {
                let p = pFilter[0];
                let tokens = this.createTokens( { nombre: p.nombre, apellido: p.apellido } );

                response.json({ message: 'Login success', success: true, token: tokens.token, refreshToken: tokens.refreshToken });
            }                
            else
            {
                response.json({ message: 'Login denied', success: false});
            }
        });

        app.instanceApp.post('/refresh-token', (request, response) => 
        {
            let requestPayLoad = <{ refreshToken: string }>request.body;

            jwt.verify( requestPayLoad.refreshToken , SECRET_KEY, ( err, decoded) => {
                
                if (!err)
                {
                    let tokens = this.createTokens( { nombre: 'Token', apellido: 'Refreshed' } );
                    response.json({ message: 'Tokens refreshed', success: true, token: tokens.token, refreshToken: tokens.refreshToken });
                }
                else
                    response.json({ message: 'Cannot refresh tokens', success: false});
            });

        });
    }

    private createTokens( data : any ) : { token : string, refreshToken : string }
    {
        let token = jwt.sign( 
            data,
            SECRET_KEY,
            { expiresIn: EXPIRATION_TOKEN }
        );

        let refreshToken = jwt.sign( 
            data,
            SECRET_KEY,
            { expiresIn: EXPIRATION_REFRESH_TOKEN }
        );

        return { token, refreshToken };
    }

    private protectRoutes(app : App) : void
    {
        app.instanceApp.use('/api', (request, response, next) => {

            let deniedAccess = (message?) => response.status(401).send( message ? { message: message } : null );
                
            var header = request.get('Authorization');
            if (!header)
            {
                deniedAccess();
                return;
            }
                
                
            var schema = header.split(' ')[0];    
            if (!schema || schema != 'Bearer')
            {
                deniedAccess('The Authorization schema must be Bearer');
                return;
            }

            var token = header.split(' ')[1]
            if (!token)
            {
                deniedAccess('Incomplete/bad token');
                return;
            }

            jwt.verify( token , SECRET_KEY, ( err, decoded) => {
                if (!err)
                    next();
                else
                    deniedAccess( err.message );
            });
            
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

    get automoviles()
    {
        return this._automoviles;
    }

    //#endregion
}