import _ from "lodash";

export default class LocalStorageAdaptor {
	static get( id ) {
		const json = localStorage.getItem( id ) ;
		return ! _.isNull(json) && Boolean(json.length) ? JSON.parse( json ) : null ;
	}
	static set( id, data = null ) {
		localStorage.setItem( id, JSON.stringify( data ) );
		return data ;
	}
}