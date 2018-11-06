import EventDispatcher from "event-emitter"
import { Debug } from "../utils/Common"

let  $SocketMessagesAdaptor ;

export default class SocketMessagesAdaptor {
	static singleton() {
		if( ! $SocketMessagesAdaptor ) $SocketMessagesAdaptor = EventDispatcher( new SocketMessagesAdaptor() ) ;
		return $SocketMessagesAdaptor ;
	}
	static EVENTS = {
		CONNECTED: "SMA.Connected",
		ERROR: "SMA.Error",
		CLOSE: "SMA.Close",
		MESSAGE: "SMA.Message"
	}
	constructor() {
		this._socket = null ;
	}
	attach = ( socket ) => {
		/* debug */ Debug.log( "SocketMessagesAdaptor", "attach([ socket ])", socket ) ;

		if( ! socket ) throw new Error( "Socket not ready" ) ;
		this._socket = socket ;

		this._socket.onopen = this.onConnected ;
		this._socket.onerror = this.onError ;
		this._socket.onclose = this.onClose ;
		this._socket.onmessage = this.onMessage ;

		return this._socket ;
	}
	_hasClientReady = () => {
		return Boolean( this._socket && this._socket.readyState === this._socket.OPEN ) ;
	}
	_response = ( data ) =>{
		/* debug */ Debug.info( "SocketMessagesAdaptor", "_response([ data ])", data ) ;
		this._hasClientReady() && this._socket.send( JSON.stringify( data ) ) ;
	}
	onConnected = ( connection ) => {
		/* debug */ Debug.log( "SocketMessagesAdaptor", "onConnected([ connection ])", connection ) ;

		if( this._hasClientReady()  ) this.emit( SocketMessagesAdaptor.EVENTS.CONNECTED, this._response ) ;
		else this.emit( SocketMessagesAdaptor.EVENTS.ERROR, new Error( "WebSocket not ready" ) ) ;
	}
	onError = ( event ) => {
		/* debug */ Debug.error( "SocketMessagesAdaptor", "onError([ event ])", event ) ;
		this.emit( SocketMessagesAdaptor.EVENTS.ERROR, new Error( "Unable to connect to host" ) ) ;
	}
	onClose = ( event ) => {
		/* debug */ Debug.log( "SocketMessagesAdaptor", "onClose([ event ])", event )
		this.emit( SocketMessagesAdaptor.EVENTS.CLOSE, event ) ;
	}
	onMessage = ({ data }) => {
		/* debug */ Debug.log( "SocketMessagesAdaptor", "onMessage([ data ])", data ) ;

		let value ;
		try { value = JSON.parse( data || {} ) }
		catch( error ) {
			/* debug */ Debug.error( "SocketMessagesAdaptor", "onMessage([ error ])", error )
			return this.emit( SocketMessagesAdaptor.EVENTS.ERROR, error ) ;
		}

		/* debug */ Debug.log( "SocketMessagesAdaptor", "onMessage([ value ])", value ) ;

		this.emit( SocketMessagesAdaptor.EVENTS.MESSAGE, value, this._response ) ;
	}
}