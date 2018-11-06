import Interface from "./Interface"

export class SocketRoute_I extends Interface {
	router( event ) {}
}
export class SocketRoute extends SocketRoute_I  {
	constructor() {
		super( ...arguments );
	}
	router( event ) {}
}