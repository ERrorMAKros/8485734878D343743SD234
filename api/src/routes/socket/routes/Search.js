import Debug from '../../../helpers/Debug'
import { failed, success } from '../../../helpers/SocketUtils'
import { SocketRoute } from '../../../interfaces/SocketRoute'
import RutrackerApi from '../../../controllers/net/RutrackerApi'
import Extractor from '../../../controllers/extractors/SearchResultsExtractor'
import { subcontextExtractor as SubContextExtractor } from '../../../controllers/extractors/SearchResultsExtractor'

import RouteListener from '../../../decorators/router/RouteListener'
import { RoutesNamespace, RoutesTypes } from '../../socket/routes'

const API = RutrackerApi.singleton() ;

@RouteListener(
    RoutesNamespace.Search,
    RoutesTypes.public,
)
export default class Search extends SocketRoute {
    constructor() {
        super( ...arguments ) ;
        /* debug  */ Debug.info( "Search()" );
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
        /* debug  */ Debug.warn( "Search()", "router([ event ])", event );

        let results, error ;

        const { type, client, data } = event ;
        const { keyword } = data ;

        try{ results = await API.search( keyword, Extractor ) }
        catch({ message }) { error = message }

        /* debug  */ Debug.warn( "Search()", "router([ keyword, error, results ])", { keyword, error, results } );

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