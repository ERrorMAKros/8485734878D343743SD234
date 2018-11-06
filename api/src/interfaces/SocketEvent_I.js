import Interface from "./Interface"
import _ from "lodash"

const $SocketData = {
    type: null,
    data: null,
    client: null,
    token: null
}

export class SocketEvent_I extends Interface {
    get type() {}
    get data() {}
	  get token() {}
    get client() {}

    constructor() {
      super( ...arguments )
    }

    toObject() {}
}
export class SocketEvent extends SocketEvent_I {
    get type() { return $SocketData.type }
    get data() { return $SocketData.data || {} }
	  get token() { return $SocketData.token }
    get client() { return $SocketData.client }

    constructor( type, data, token, client ) {
        super( ...arguments );
        _.assignIn( $SocketData, { type, data, client, token } ) ;
    }

    toObject() {
        return {
            type: this.type,
            data: this.data,
            token: this.token,
            client: this.client
        }
    }
}