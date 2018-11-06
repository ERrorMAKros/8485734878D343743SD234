import { RPC } from "../../constants";
import SocketRequest from "../../controllers/SocketRequest";
import { Debug } from "../../utils/Common";

export const CatalogueRequest = ( id=null ) => {
  /* debug */ Debug.info( "CatalogueRequest([ id ])", null, id ) ;
  return SocketRequest( RPC.CATALOGUE, id ) ;
}
