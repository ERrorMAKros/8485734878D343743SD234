import { Debug } from "../../utils/Common";

export const REMOTE_EVENT = 'REMOTE.EVENT' ;

export const dispatchRemoteEvent = ({ type, data }) => dispatch => {
	/* debug */ Debug.info( "RemoteEventsActions()", `dispatchRemoteEvent([ ${ type } ])`, data ) ;
	dispatch({ type: REMOTE_EVENT , data: { type, data } }) ;
	dispatch({ type, data }) ;
} ;
