import Model from "../models/LayoutModel";
import { CHANGE_LAYOUT } from "../actions/LayoutActions";
import { Debug } from "../../utils/Common";

const model = { ...Model };
export default function ( state = model, action ) {
    const { type, data } = action;
    switch ( type ) {
        case CHANGE_LAYOUT: {
            /* debug */ Debug.info( "LayoutReducer()", CHANGE_LAYOUT, data ) ;
            return { ...data };
        }
        default: return { ...state };
    };
}