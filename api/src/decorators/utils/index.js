import MD5 from "md5";

let $cache = {} ;
export function cachedAsync( func ) {
	return async function() {

		const key = MD5( JSON.stringify( arguments ) ) ;

		if( $cache.hasOwnProperty( key )) return $cache[ key ] ;

		const result = await func( ...arguments );
		$cache[ key ] = result ;

		return result;
	};
}

