import Model from "../models/SignInModel";
import { Debug } from "../../utils/Common";
import { SIGNIN_EVENT } from "../actions/SignInAction";

const model = { ...Model };
export default function ( state = model, action ) {
	const { type, data } = action;

	switch ( type ) {
		case SIGNIN_EVENT: {
			/* debug */ Debug.info( "SignInReducer()", SIGNIN_EVENT, data ) ;
			return { ...state, ...data };
		}
		default: return { ...state };
	};
}