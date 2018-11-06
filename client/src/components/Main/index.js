import React, { PureComponent } from "react";
import Session from "../Session/index";
import Layout from "../Layout";
import Menu from "../Menu";
import DefaultScreen from "../Search";
import { connect } from "react-redux";
import { changeLayout } from "../../redux/actions/LayoutActions";
import { bindActionCreators } from "redux";

@connect( ( store ) => ( store ), dispatch => ( bindActionCreators({ changeLayout }, dispatch ) ) )
export default class Main extends PureComponent {
	state = { hasConnected: false };
	render() {
		const { hasConnected } = this.state ;
		return (
			<section>
				<Session onConnect={ ()=>this.onSession( true ) } onClose={ ()=>this.onSession( false ) }>
					{ hasConnected && <Layout
            menu={ <Menu onRendererComponent={ this.onMenuRendererComponent }/> }
            content={ this.renderContent() }
          />
					}
				</Session>
			</section>
		);
	}
  renderContent = () => {
    const { Layout } = this.props ;
    if( Layout.component ) {
      const ComponentClass = Layout.component ;
      return <ComponentClass/>

    } else return <div>choose menu item</div>
  }
  componentDidMount() {
    this.props.changeLayout( DefaultScreen ) ;
  }
	onSession = ( hasConnected ) => this.setState({ hasConnected }) ;
  onMenuRendererComponent = ( renderer ) => {
    this.props.changeLayout( renderer ) ;
  }
}