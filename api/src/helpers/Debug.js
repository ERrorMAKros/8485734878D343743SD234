const Debug = {

	colors: {
		table: "#ffffff",
		error: "#ff093a",
		warn: "#ffc011",
		info: "#00b8ff",
		log: "#8fff00"
	},
	console: function ( marker, name, text, data, color ) {
		console.log(
			`%c ${ marker } ${ name || "" } ${ text || "" }`,
			`color: ${ color };` ,
			data || ""
		);
		// console.log( `${ marker || "" } ${ name || "" } ${ text || "" }`, data || "" );
	},
	clear: console.clear,
	log: function( name, text, data ) { return this.console( "⬖", name, text, data, this.colors.log ) } ,
	info: function( name, text, data ) { return this.console( "✪", name, text, data, this.colors.info ) } ,
	warn: function( name, text, data ) { return this.console( "☯", name, text, data, this.colors.warn ) } ,
	error: function( name, text, data ) { return this.console( "✚", name, text, data, this.colors.error ) } ,
	table: function( name, text, data ) { return this.console( "★", name, text, data, this.colors.remark ) }
}

export default Debug ;