import Debug from '../../../helpers/Debug'
import { failed, success } from '../../../helpers/SocketUtils'
import { SocketRoute } from '../../../interfaces/SocketRoute'
import RutrackerApi from '../../../controllers/net/RutrackerApi'
import RouteListener from '../../../decorators/router/RouteListener'
import { RoutesNamespace, RoutesTypes } from '../../socket/routes'
import Extractor, { subcontextExtractor as SubContextExtractor } from '../../../controllers/extractors/SearchResultsExtractor'

const API = RutrackerApi.singleton() ;

@RouteListener(
    RoutesNamespace.Paginator,
    RoutesTypes.public,
)
export default class Paginator extends SocketRoute {
    constructor() {
        super( ...arguments ) ;
        /* debug  */ Debug.info( "Paginator()" );
    }
    /**
     *
     * @param type: String ;
     * @param data: Object = {
	 * 	id: String,
	 * 	client: String
	 * }
     * @param client: WebSocket ;
     *
     * @returns void ;
     */
    async router( event /* SocketEvent */ ) {

        /* debug  */ Debug.warn( "Paginator()", "router([ event ])", event );

        let results, error;

        const { type, client, data } = event ;
        const { keyword, token, index, total, max } = data ;
        const offset = index * max ;

        if( index == total ) failed( client, new Error( "This is the end" ) ) ;

        try{ results = await API.pagenate( offset, token, keyword, Extractor ) }
        catch({ message }) { error = message }

        if( error ) return failed( client, new Error( error ) ) ;
        else success( client, type, results ) ;

        //---------------------
        /* debug */ Debug.clear() ;
        //---------------------

        for( let page of results.data  ) {
            const thred = ( id ) => API.subcontext( id, SubContextExtractor ).then( ( image )=>success( client, RoutesNamespace.SubContext, { id, content: { image } } ) ) ;
            thred( page.id ) ;
        }
    }
}