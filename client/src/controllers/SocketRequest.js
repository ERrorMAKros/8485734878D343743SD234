import Connection from "../components/Connection"
import {Debug} from "../utils/Common"

const SocketRequest = ( type, data, token=null ) => {
    /* debug */ Debug.warn("SocketRequest()", "SocketRequest([ type, data, token ])", {type, data, token});
    return Connection.singleton().send(JSON.stringify({ type, data, token}));
}

export default SocketRequest;