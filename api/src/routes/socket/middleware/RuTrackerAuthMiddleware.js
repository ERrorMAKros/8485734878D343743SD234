import Debug from "../../../helpers/Debug";
import RutrackerApi from '../../../controllers/net/RutrackerApi'
import _ from "lodash"

const middleware = async ( request, next ) => {

    const { req:{ url } } = request ;
    const body = _.reject( decodeURIComponent( url ).split('/'), _.isEmpty ) ;
    const login = _.first( body, 1 ) ;
    const password = _.last( body, 1 ) ;
    const api = RutrackerApi.singleton() ;

    /* debug */ Debug.log( "RuTrackerAuthMiddleware()", `middleware([ login, password ])`,  { login, password } ) ;

    if( await api.login( login, password ) ) return next( request ) ;

    return next( false ) ;
}

export default middleware ;