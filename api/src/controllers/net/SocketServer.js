import WebSocket from 'ws'
import { jsonToObject } from '../../helpers/Common'
import { SocketEvent } from '../../interfaces/SocketEvent_I'
import Debug from '../../helpers/Debug'
import EventDispatcher from "events"

let $SocketServer, $Singleton ;
export const SocketServerEvents = {
	_MESSAGE: "message" ,
	_CONNECT: "connection" ,
	RPC: '*rpc' ,
	SOCKET: '*socket' ,
}

export default class SocketServer extends EventDispatcher {

	static singleton() {
		if( ! $Singleton ) $Singleton = new SocketServer() ;
		return $Singleton ;
	}
	static server() {
		return $SocketServer ;
	}
	static middleware( request, next ) {
        /* debug */ Debug.log( `SocketServer()`, `middleware([ request ])`, request ) ;
        return next( request )
    }

    get server() {
        return $SocketServer ;
    }

    constructor() {
        super( ...arguments ) ;
        /* debug */ Debug.info( "SocketServer()" ) ;
    }

	_readCredentials( value ) {
		const buff = value.split("/") ;
		const hasBuffer = Boolean( buff.length ) ;
		return {
			id: hasBuffer ? buff[1] : null ,
            client: hasBuffer ? buff[2] : null
		}
	}
	create( server /* HttpServer */, middleware = SocketServer.middleware ) {
        $SocketServer = new WebSocket.Server({
            verifyClient: middleware.bind( this ),
            server
        });
        $SocketServer.on( SocketServerEvents._CONNECT, this.onWebSocketClientConnected.bind( this ) );

        return $SocketServer ;
    }
    onWebSocketClientConnected( client, request ) {
		/* debug */ Debug.log( "SocketServer()", "onWebSocketClientConnected([ client, request ])", { client, request } ) ;

		this.emit( SocketServerEvents.SOCKET, client ) ;

		client.onopen = ( event ) => Debug.info( "*", "open", event ) ;
		client.onmessage = this.onWebSocketMessageData.bind( this ) ;
		client.onerror = ( event ) => Debug.info( "*", "error", event ) ;
		client.onclose = ( event ) => Debug.info( "*", "close", event ) ;
		client.onping = ( event ) => Debug.info( "*", "ping", event ) ;
		client.onpong = ( event ) => Debug.info( "*", "pong", event ) ;
    }
    onWebSocketMessageData( request ) {

		/* debug */ console.log( `SocketServer()`, `onWebSocketMessageData([ request ])`, request) ;

		const { target } = request ;
		const { id } = target._socket ;
		const parse = jsonToObject( request.data );
		const { type, token, data } = parse ;
		const innerSocketEvent = new SocketEvent( type, data, token, target ) ;

		/* debug */ console.log( `SocketServer()`, `onWebSocketMessageData([ ${ id || "?" } ])`, { type, data }) ;

		return this.emit( SocketServerEvents.RPC, innerSocketEvent ) ;
    }
}