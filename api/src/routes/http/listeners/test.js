import Debug from '../../../helpers/Debug'
import express from 'express'

const { Router } = express;
const router = Router() ;
router.get( '/', ( req, res, next ) => {
	/* debug */ Debug.table( "/test", "get([ req, res, next ])", { req, res, next } ) ;
    res.send({ test: true }) ;
} );

export default router ;
