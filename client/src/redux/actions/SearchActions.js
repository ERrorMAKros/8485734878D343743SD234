import { Debug } from "../../utils/Common";

export const SEARCH_SET_KEYWORD_EVENT = 'search.set.keyword' ;
export const PAGE_PAGINATE = 'page.paginate' ;

export const setKeyword = ( keyword ) => dispatch => {
	/* debug */ Debug.info( "SearchAction()", `setKeyword([ keyword ])`, keyword ) ;
	dispatch({ type: SEARCH_SET_KEYWORD_EVENT, data: { keyword } }) ;
} ;