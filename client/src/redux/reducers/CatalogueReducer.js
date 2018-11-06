import Model from "../models/CatalogueModel";
import { Debug } from "../../utils/Common";
import { CATALOGUE_ROOT, CATALOGUE_VIEWFORUM } from "../actions/CatalogueActions";

const model = { ...Model };

export default function ( state = model, action ) {
  const { type, data } = action;
  switch ( type ) {
    case CATALOGUE_VIEWFORUM:
    case CATALOGUE_ROOT: {
      /* debug */ Debug.info( `CatalgogueReducer([ ${ type } ])`, null, data ) ;
      return { ...state };
    }
    default: return { ...state };
  };
}