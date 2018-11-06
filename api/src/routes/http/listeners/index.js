import express from 'express'

const { Router } = express;
const router = Router() ;

router.get( '/', (req, res, next) => {
    return res.render( 'index', { title: 'Shogun API' });
} );

export default router ;
