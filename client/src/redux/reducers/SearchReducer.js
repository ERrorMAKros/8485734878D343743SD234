import Model from "../models/SearchModel"
import { Debug } from "../../utils/Common"
import { SEARCH_SET_KEYWORD_EVENT } from "../actions/SearchActions"
import { RPC } from "../../constants"
import _ from "lodash"

const model = { ...Model };

export default function ( state = model, action ) {
	const { type, data } = action;
	switch ( type ) {
		case SEARCH_SET_KEYWORD_EVENT: {
			const { keyword } = data ;
			/* debug */ Debug.info( "SearchReducer()", SEARCH_SET_KEYWORD_EVENT, data ) ;
			return { ...Model, keyword };
		}
		case RPC.SEARCH: {
			/* debug */ Debug.info( "SearchReducer()", RPC.SEARCH, data ) ;
			return { ...state, ...data } ;
		}
		case RPC.PAGINATOR: {
			/* debug */ Debug.info( "SearchReducer()", RPC.PAGINATOR, data ) ;
			const { paginator } = data ;
			const data_ = [ ...state.data, ...data.data ] ;

			return { ...state, paginator, data: data_ } ;
		}
		case RPC.SUB_CONTEXT: {
			const { id, content:{ image }} = data ;
      const _data = _.clone( state.data ) ;
      const index = _.findIndex( _data, { id } ) ;

      if( Boolean( index + 1 ) ) {
      	const item = _data[ index ] ;
        item.image = image ;
      }

			//  /* debug */ Debug.info( `SearchReducer([ ${ id } ]) ${ RPC.SUB_CONTEXT  }`, index, image ) ;

			return { ...state, data: _data } ;
		}
		default: return { ...state };
	};
}