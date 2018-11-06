import React, { Component } from "react";
import PropTypes from "prop-types";
import { Debug } from "../../utils/Common";
import { MenuItems } from "../../constants/Menu";
import { Menu } from "antd";

export default class extends Component {
	static propTypes={
		onRendererComponent: PropTypes.func.isRequired
	}
	constructor( props ) {
		super(props);
		/* debug */ Debug.info( "Menu()", null, this ) ;
	}
	render() {
		return <Menu onClick={ this.onMenu } mode="horizontal">{ MenuItems }</Menu>
	}
	onMenu = ({ item:{ props:{ renderer } } }) => {
		renderer && this.props.onRendererComponent( renderer ) ;
	}
}