import { Debug } from "../../utils/Common";

export const CHANGE_LAYOUT = 'CHANGE.LAYOUT' ;

export const changeLayout = ( component, attrs = {} ) => dispatch => {
    /* debug */ Debug.info( "LayoutActions()", `changeLayout()`, { component, attrs } ) ;
    dispatch({ type: CHANGE_LAYOUT, data: { component, attrs } }) ;
} ;
