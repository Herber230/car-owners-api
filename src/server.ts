import http = require('http');
import { App } from './app';

var port: number = 3000;

var expressApp = new App(port);

var server = http.createServer( expressApp.instanceApp );
server.listen(port, ()=>{
    console.log('Server listening on port:' + port);
});
