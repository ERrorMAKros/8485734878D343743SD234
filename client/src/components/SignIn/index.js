import React, { PureComponent } from "react";
import Styles from "./style.scss";
import PropTypes from "prop-types";
import { Button, Input } from "antd";
import { bindActionCreators } from "redux";
import { signIn } from "../../redux/actions/SignInAction";
import { Debug } from "../../utils/Common";
import { connect } from "react-redux";
import { showErrorNotification } from "../Errors";


@connect( ({ SignIn })=>SignIn , dispatch => bindActionCreators({ signIn }, dispatch ) )
export default class extends PureComponent {
	static propTypes = {
		onReady: PropTypes.func.isRequired
	}
	constructor(props) {
		super(...arguments) ;

		/* debug */ Debug.info( "SignIn()", null, this ) ;

		this.state = { hasBusy: false }
	}
  render() {
		const { hasBusy } = this.state ;
		const { username, password } = this.props ;
		return (
			<div className={ Styles.Login }>
				<ul className={ Styles.Form }>
					<li className={ Styles.Username }>
						<Input placeholder="login" onChange={ this.onUsernameChange } value={ username } />
					</li>
					<li className={ Styles.Password }>
						<Input placeholder="password" type="password" onChange={ this.onPasswordChange } value={ password } />
					</li>
					<li className={ Styles.Footer }>
						<Button className={ Styles.ButtonSignIn } loading={ hasBusy } onClick={ this.onSignIn( true ) }>SIGN IN</Button>
						{ hasBusy && <Button className={ Styles.ButtonReTry } onClick={ this.onSignIn( false ) }>CANCEL</Button> }
					</li>
				</ul>
			</div>
		)
	}
	onUsernameChange = ({ target:{ value }}) => this.props.signIn({ username: value }) ;
	onPasswordChange = ({ target:{ value }}) => this.props.signIn({ password: value }) ;
  onSignIn = ( status ) => ()=> {
		const { onReady } = this.props ;
		this.setState({ hasBusy: status }, ()=>onReady( status ) ) ;
	}
}
