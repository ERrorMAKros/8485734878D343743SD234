import Debug from '../../helpers/Debug'
import {SocketServerEvents} from "../../controllers/net/SocketServer";
import EventDispatcher from "events"

class Adaptor extends EventDispatcher {
    static singleton() {
        if( ! Adaptor.$Singleton ) Adaptor.$Singleton = new Adaptor() ;
        return Adaptor.$Singleton ;
    }

    constructor() {
        super( ...arguments ) ;
        /* debug */ Debug.info( "Adaptor()" ) ;
    }

    create( server /* SocketServer */ ) {
        this._server = server ;
        this.addEventListeners() ;
    }
    addEventListeners() {
        this._server.on( SocketServerEvents.SOCKET, this.onEvent( SocketServerEvents.SOCKET ) ) ;
        this._server.on( SocketServerEvents.RPC, this.onEvent( SocketServerEvents.RPC )  ) ;
    }
    _onEvent( name ) {
        return ( event /* SocketEvent */ ) => {
            /* debug */ Debug.log( "Adaptor()", "onEvent([ name ])", name ) ;
            switch( name ) {
                case SocketServerEvents.SOCKET: {
                    const socket /* WebSocket */ = event ;
                    return /* debug */ Debug.log( "Adaptor()", `onEvent([ ${ name } ])`, { socket: Boolean( socket ) } );
                }
            }
        }
    }
    onEvent( name ) {
        return ( event ) => this.emit( name, event )
    }
}

Adaptor.$Singleton= null ;

export default Adaptor ;