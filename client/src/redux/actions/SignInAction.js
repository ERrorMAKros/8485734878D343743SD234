import { Debug } from "../../utils/Common";

export const SIGNIN_EVENT = 'SIGN.IN' ;

export const signIn = ( data ) => dispatch => {
	/* debug */ Debug.info( "SignInAction()", `signIn([ data ])`, data ) ;
	dispatch({ type: SIGNIN_EVENT , data }) ;
} ;
