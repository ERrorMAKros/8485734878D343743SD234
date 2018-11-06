import { Debug } from "../../utils/Common"
import { CatalogueRequest } from "../../redux/requests/CatalogueRequest"

export const CATALOGUE_ROOT = 'GET.CATALOGUE.ROOT' ;
export const CATALOGUE_VIEWFORUM = 'GET.CATALOGUE.VIEWFORUM' ;

const getRootCatalogue = () => ({ type: CATALOGUE_ROOT }) ;
const getViewForum = ( id ) => ({ type: CATALOGUE_VIEWFORUM, data:{ id } }) ;

export const getRootCatalogueAction = () => dispatch => {
  /* debug */ Debug.info( "CatalgogueActions()", `getRootCatalogueAction()` ) ;
  CatalogueRequest() ;
  dispatch( getRootCatalogue() ) ;
} ;
export const getViewForumAction = ( id ) => dispatch => {
  /* debug */ Debug.info( "CatalgogueActions()", `getViewForumAction()` ) ;
  CatalogueRequest( id ) ;
  dispatch( getViewForum( id ) ) ;
} ;
