export const jsonToObject = ( json ) => {
	let obj ;
	try { obj = JSON.parse( json ) }
	catch( error ) { return null }

	return obj ;
}
export const genUniqueId = ( noise = null ) => {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function( c ) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor( d / 16 );
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString( 16 );
    });

    return [ noise || "", uuid ].join( '' );
}
export const keyMirror = ( keys ) => {
    keys = Array.isArray(keys) ? keys : Object.keys(keys);
    let mirror = {};
    keys.forEach(v => mirror[v] = v);

    return mirror;
}
export const formatSize = (size_in_bytes) => {
    var size_in_megabytes = size_in_bytes / (1000 * 1000 * 1000);
    return size_in_megabytes.slice(0, 4) + ' GB';
}