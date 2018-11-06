import Model from "../models/RemoteEventsModel";
import { REMOTE_EVENT } from "../actions/RemoteEventsActions";
import { Debug } from "../../utils/Common";

const model = { ...Model };
export default function (state = model, action) {
	const { history, last } = state ;
	const { type, data } = action;

	switch ( type ) {
		case REMOTE_EVENT: {
			/* debug */ Debug.info( "RemoteEventsReducer()", REMOTE_EVENT, action ) ;
			return { ...state, last: data, history: [ ...history, data ] };
		}
		default: return { ...state };
	};
}