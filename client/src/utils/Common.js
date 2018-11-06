import Underscore from "underscore";

/**
 * Генератор уникального идентификатора (аналог Lodash.uniqueId()) ;
 *
 * @param prefix
 * @returns {string}
 */
export const genUniqueId = function( prefix = null ) {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function( c ) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor( d / 16 );
		return (c == 'x' ? r : (r & 0x7 | 0x8)).toString( 16 );
	});
	
	return [ prefix || "", uuid ].join( '' );
}
/**
 *
 * Аналог console.log(.warn/.info и т.п.) с цветовой схемой ;
 */
export const Debug = {
	console: function( name, text, data, color ) {
		if( ! name ) name = " "; else name += " ";
		if( ! text ) text = " "; else text += " ";
		if( ! data ) data = "";
		
		console.log(
			" " + "%c" + name + text ,
			"color: " + color + ";" ,
			data
		);
	},
	clear: console.clear,
	error: function( name, text, data ) {
		const color = "#ff1f00" ;
		return this.console( name, text, data, color );
	},
	log: function( name, text, data ) {
		const color = "#00d500" ;
		return this.console( name, text, data, color );
	},
	info: function( name, text, data ) {
		const color = "#ff8908" ;
		return this.console( name, text, data, color );
	},
	warn: function( name, text, data ) {
		const color = "#00bcff" ;
		return this.console( name, text, data, color );
	}
}
/**
 * Получение читабельного вида ошибки в axios response`е,
 * который вернул ошибку
 * @param error: Response
 */
export const parseResponseError = ( error ) => {
	const { response } = error ;
	const { status, data } = response ;
	const { error_description } = data ;
	return {
		id: status,
		message: error_description
	}
}
export const setStringVariables = ( string, object ) => {
	const template = Underscore.template( string );
	return template( object );
}
export const percentage = ( num, per ) => ( num / 100 ) * per ;