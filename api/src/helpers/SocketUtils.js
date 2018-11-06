import Debug from '../helpers/Debug'
import _ from 'lodash'

/**
 *
 * @param client: WebSocket ;
 * @param type: String ;
 * @param data: Object = {} ;
 *
 * @returns void ;
 */
export const success = ( client /* WebSocket */, type /* String */, data /* Object */ = {} ) => {
	const body = { type, data } ;
	const json = JSON.stringify( body ) ;

	/* debug */ Debug.info( "success([ body ])", null, body ) ;

	return client.send( json );
}
/**
 * @param client: WebSocket ;
 * @param error: Error ;
 * @param hasBreakConnection: Boolean = false ;
 *
 * @returns Boolean = false ;
 */
export const failed = ( client /* WebSocket */, error /* Error */, hasBreakConnection /*  Boolean */ = false  ) => {
	const type = "error" ;
	const data = {
		error: {
			message: error.toString()
		}
	}
	const body = { type, data } ;

	/* debug */ Debug.warn( "failed([ body ])", null, body ) ;

	const json = JSON.stringify( body ) ;

	client.send( json );
	/**
	 * @ToDo:
	 * Не понятно почему close корректно работает только с кодом 1000, во всех остальных случаях
	 * получаю сообщение:
	 * Error: first argument must be a valid error code number
	 */
	hasBreakConnection && client.close( 1000, error.message ) ;

	return false ;
}
/**
 * @param client: WebSocket ;
 * @param key: String // id in collection ;
 * @param data: Object // user dataset ;
 */
export const setToClientStore = ( client, key, data={} ) => {
	if( client && key ) {

		if( ! client.hasOwnProperty( key ) ) client[ key ] = {} ;
        const state = client[ key ] ;
        client[ key ] = { ...state, ...data } ;

	} else throw new Error( "Not enough actual params" ) ;
}
/**
 * @param client: WebSocket ;
 * @param key: String // id in collection ;
 *
 * @returns Object ;
 */
export const getFromClientStore = ( client, key ) => {
    if( client && key ) {

    	if( _.has( client, `_socket.${ key}` )) return client._socket[ key ] ;
    	else return client[ key ] ;

	} else throw new Error( "Not enough actual params" ) ;
}