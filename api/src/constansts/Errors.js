const Errors = {
	Common: {
        NotEnoughParams_: ( message ) => new Error( `Not enough actual params in ${ message || "instance" }`)
	},
	Token: {
		Expired: new Error( "Token has expired" ),
		NoAccess: new Error( "Access denied (level #1)" ),
        UnknownClient: new Error( "Unknown client (level #1)" ),
	},
	Route: {
		NotFound: new Error( "404: Route not found!" ),
		RPCNotDeclared: new Error( "RPC has no declared!" ),
	}
}
export default Errors ;