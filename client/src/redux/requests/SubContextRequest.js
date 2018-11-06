import { RPC } from "../../constants";
import SocketRequest from "../../controllers/SocketRequest";
import { Debug } from "../../utils/Common";

export const SubContextRequest = ( id ) => {
	/* debug */ Debug.info( "SubContextRequest([ id ])", null, id ) ;
	return SocketRequest( RPC.SUB_CONTEXT, id ) ;
}
