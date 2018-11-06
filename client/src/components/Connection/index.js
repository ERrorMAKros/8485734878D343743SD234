import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import { Debug } from '../../utils/Common';
import { w3cwebsocket as W3C } from 'websocket';

let $WebSocket ;

export default class Connection extends PureComponent {
	static singleton() {
		return $WebSocket ;
	}
	static propTypes = {
		host: PropTypes.string.isRequired ,
		user: PropTypes.string.isRequired ,
		password: PropTypes.string.isRequired ,
		adaptor: PropTypes.object
	}
	state = {
		error: null
	}
	constructor( props ) {
		super(...arguments) ;
		/* debug */ Debug.info( "Connection()", null, this )
	}
	render() {
		const { error } = this.state ;
		const { children } = this.props ;
		return ! error ? children : <div>{ error }</div>
	}
	componentDidMount() {
		const { host, user, password } = this.props ;
		const addr = `${ host }/${ user }/${ password }` ;
		$WebSocket = this._createSocket( addr ) ;

		/* debug */ Debug.log( "Connection()", "componentDidMount([ $client ])", $WebSocket )
	}
	_createSocket( host ) {
		const { adaptor } = this.props ;
		return adaptor.attach( new W3C( host ) ) ;
	}
	componentDidCatch( error, info ) {
		return this.setState({ error: `${ error.toString() } :: ${ info || "[ eof ]"  }`} ) ;
	}
}