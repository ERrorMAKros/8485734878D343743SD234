import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import HttpRoutes from "./routes/http/index";
import P500 from "./routes/http/middlewares/P500";
import P404 from "./routes/http/middlewares/P404";
import SocketRoutesAdaptor from './routes/socket/Adaptor';
import SocketServer from './controllers/net/SocketServer';
import RuTrackerAuthMiddleware from './routes/socket/middleware/RuTrackerAuthMiddleware';
import SocketRouter from './routes/socket/Router';
import Debug from './helpers/Debug';
import HttpServer from './controllers/net/HttpServer';
import {NodeEnv} from './constansts/Environment';
import Moment from 'moment';
import _ from "lodash";

const app = express();

Moment.locale( 'ru' );

/* debug */ Debug.clear() ;

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'pug' );
app.set( 'port', 3001 );

app.use( cors() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );

_.forEach( HttpRoutes, ( listener, path ) => app.use( path, listener ) );

app.use( P404 );
app.use( P500 );

HttpServer.singleton().create( app, ( error, server ) => {

	if( error ) return ;

	SocketServer.singleton().create( server, RuTrackerAuthMiddleware ) ;
	SocketRoutesAdaptor.singleton().create( SocketServer.singleton() ) ;
	SocketRouter() ;
} ) ;
