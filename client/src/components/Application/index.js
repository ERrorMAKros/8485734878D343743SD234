import React, { Component } from "react";
import Main from "../Main";
import Styles from "./style.scss";
import { BrowserRouter as Router } from "react-router-dom";
import SignIn from "../SignIn";
import Connection from "../Connection";
import { API, CLIENT } from "../../constants";
import SocketMessagesAdaptor from "../../controllers/SocketMessagesAdaptor";
import Errors from "../Errors/index";
import { connect } from "react-redux";

@connect( ({ SignIn })=>SignIn )
export default class Application extends Component {
	state = {
		hasReadyForConnect: false ,
		hasConnected: false
	}
	render() {
		const { username, password } = this.props ;
		const { hasReadyForConnect } = this.state ;
		return 	(
			<Errors>
				{ hasReadyForConnect ? (
					<Connection host={ `ws://${ API.HOST }` } user={ username } password={ password } adaptor={ SocketMessagesAdaptor.singleton() }>
						<Router>
							<main className={ Styles.Application }>
								<div className={ Styles.Content }>
									<Main/>
								</div>
							</main>
						</Router>
					</Connection>
				): <SignIn onReady={ this.onSignInReady }/> }
			</Errors>
		)
	}
	componentDidMount() {
		SocketMessagesAdaptor.singleton().on( SocketMessagesAdaptor.EVENTS.CONNECTED, ()=>this.setState({ hasConnected: true }) ) ;
		SocketMessagesAdaptor.singleton().on( SocketMessagesAdaptor.EVENTS.CLOSE, ()=>this.setState({ hasConnected: false, hasReadyForConnect: false }) ) ;
	}
	onSignInReady = ( hasReadyForConnect ) => this.setState({ hasReadyForConnect });
}