import { RPC } from "../../constants";
import SocketRequest from "../../controllers/SocketRequest";
import { Debug } from "../../utils/Common";

export const SearchRequest = ( keyword ) => {
	/* debug */ Debug.info( "SearchRequest([ keyword ])", keyword ) ;
	return SocketRequest( RPC.SEARCH, { keyword } ) ;
}
