import Debug from "../../helpers/Debug"
import Errors from "../../constansts/Errors";
import Adaptor from "../../routes/socket/Adaptor";
import { SocketServerEvents } from "../../controllers/net/SocketServer";
import { failed } from '../../helpers/SocketUtils'
import { RoutesTypes } from "../../routes/socket/routes/index"

const RouteListener = ( name, type, args = {} ) => ( Component ) => class {
    constructor() {
        /* debug */ Debug.warn( `RouteListener([ ${ Component.name } ])`, null, { name } ) ;
        Adaptor.singleton().on( SocketServerEvents.RPC, this.onEvent.bind( this ) ) ;
    }
    create( event /* SocketEvent */ ) {
        /* debug */ Debug.log( `RouteListener()`, `create([ event ])`, event ) ;
        ( new Component( args ) ).router( event ) ;
    }
    validateName({ type } /* SocketEvent */ ) {
        return Boolean( type && name && name == type )
    }
    async validateType( { token, client } /* SocketEvent */ ) {
        switch( type ) {
            case RoutesTypes.public: return true ;
            case RoutesTypes.protected: {
                if( ! token ) return failed( client, Errors.Token.NoAccess )
                else return true ;

                return false ;
            }
            default: { return failed( client, new Error( "unknown route" ) ) }
        }
    }
    async onEvent( event /* SocketEvent */ ) {
        if( this.validateName( event )) {
            const hasType = await this.validateType( event )
            if( hasType ) this.create( event ) ;
        }
    }
}

export default RouteListener ;