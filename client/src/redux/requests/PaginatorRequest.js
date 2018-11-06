import { RPC } from "../../constants";
import SocketRequest from "../../controllers/SocketRequest";
import { Debug } from "../../utils/Common";

export const PaginatorRequest = ( options ) => {
	/* debug */ Debug.info( "PaginatorRequest([ id ])", null, options ) ;
	return SocketRequest( RPC.PAGINATOR, options ) ;
}
