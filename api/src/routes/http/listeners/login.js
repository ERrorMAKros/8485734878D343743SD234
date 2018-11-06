import express from 'express'
import { genSecretHash } from '../../../controllers/AuthController'

class Login {
	static async auth( req, res, next ) {
        return res.send( { status: true } );
	}
}

const { Router } = express;
const _router = Router();
_router.post( '/', Login.auth );

export default _router;