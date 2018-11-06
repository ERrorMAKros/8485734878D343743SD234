import http from 'http'
import Debug from '../../helpers/Debug'
import _ from 'lodash'

let $HttpServer, $Singleton ;

export default class HttpServer {
	static singleton() {
		if( ! $Singleton ) $Singleton = new HttpServer() ;
		return $Singleton ;
	}

    constructor() {
        /* debug */ Debug.log( "HttpServer()" ) ;
        this.onError = _.bind( this.onError, this ) ;
        this.onListening = _.bind( this.onListening, this ) ;
    }

    create( express, callback ) {

		this._callback = callback ;

        $HttpServer = http.createServer( express );
        $HttpServer.on( 'error', this.onError );
        $HttpServer.on( 'listening', this.onListening );
        $HttpServer.listen( express.get('port') ) ;

        return $HttpServer ;
    }
    onError( error ) {
        /* error */ Debug.error("HttpServer()", "onError([ error ])", error ) ;
		this._callback( error );
    }
    onListening() {
        const addr = $HttpServer.address();
        /* debug */ Debug.info( "HttpServer()", "onListening([ addr ])", addr ) ;
        this._callback( null, $HttpServer );
    }
}