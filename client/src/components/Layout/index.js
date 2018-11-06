import React, { Component } from "react";
import PropTypes from "prop-types";
import { Debug } from "../../utils/Common";
import { Layout } from "antd" ;

const { Footer, Content } = Layout ;

export default class extends Component {
	static propTypes = {
		menu: PropTypes.element.isRequired,
		content: PropTypes.element.isRequired
	}
	constructor( props ) {
		super(props);
		/* debug */ Debug.info( "Layout()", null, this ) ;
	}
	render() {
		const { menu, content } = this.props ;
		return (
			<Layout>
        <Content>{ content }</Content>
				<Footer>{ menu }</Footer>
			</Layout>
		);
	}
}