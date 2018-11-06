import Debug from "../../../helpers/Debug";
import Environment from "../../../constansts/Environment";

const P500 = ( err, req, res, next ) => {
	res.locals.message = err.message;
	const env = req.app.get( 'env' );

	/* debug */ Debug.log( "[1]", null, { env, req, err, res, next } );

	res.locals.error = env === Environment.NodeEnv.DEVELOPMENT ? err : {} ;
	res.status( err.status || 500 );
	res.render( 'error' );
}

export default P500 ;