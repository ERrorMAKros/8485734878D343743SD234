import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import SocketMessagesAdaptor from "../../controllers/SocketMessagesAdaptor";
import { Spin } from "antd";
import Styles from "./style.scss";
import { dispatchRemoteEvent } from "../../redux/actions/RemoteEventsActions";
import ClassNames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { showErrorNotification } from "../Errors";

@connect( null, dispatch => ( bindActionCreators({ dispatchRemoteEvent }, dispatch ) ) )
export default class extends PureComponent {
	static propTypes = {
		onConnect: PropTypes.func,
		onClose: PropTypes.func
	}
	state = {
		hasConnected: false ,
		messages: []
	}
	render() {
		const { hasConnected, messages } = this.state ;
		const { children } = this.props ;
		const className = ClassNames( Styles.Session, { [ Styles.Connecting ]: ! hasConnected } ) ;

		return <div className={ className }>{ ! hasConnected ? this.showPreloader() : children }</div>
	}
	showPreloader = () => {
		return <Spin className={ Styles.Spinner } tip="connecting..." />
	}
	componentDidMount() {
		const adaptor = SocketMessagesAdaptor.singleton() ;
		adaptor.on( SocketMessagesAdaptor.EVENTS.CONNECTED, this.onConnected ) ;
		adaptor.on( SocketMessagesAdaptor.EVENTS.MESSAGE, this.onMessage ) ;
		adaptor.on( SocketMessagesAdaptor.EVENTS.CLOSE, this.onClose ) ;
		adaptor.on( SocketMessagesAdaptor.EVENTS.ERROR, this.onError ) ;
	}
	onConnected = ( response ) => {
		const { onConnect } = this.props ;
		onConnect && onConnect( response ) ;

		return this.setState({ hasConnected: true }) ;
	}
	onMessage = ( data, response )=> {
		const doAfterState = () => {
			const { dispatchRemoteEvent } = this.props ;
			dispatchRemoteEvent( data ) ;
		}
		const { messages } = this.state ;

		return this.setState({ messages: [ ...messages, data] }, doAfterState ) ;
	}
	onClose = ( event ) => {
		showErrorNotification( "Connection terminated" ) ;

		const { onClose } = this.props ;
		onClose && onClose() ;

		return this.setState({ hasConnected: false }) ;
	}
	onError = ({ message }) => {
		showErrorNotification( message ) ;
		return this.setState({ hasConnected: false }) ;
	}
}