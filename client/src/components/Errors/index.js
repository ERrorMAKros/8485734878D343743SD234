import React, { Component } from "react";
import { connect } from 'react-redux';
import { notification } from 'antd';

export const showErrorNotification = ( message, duration=7 ) => {
	notification.error({
		message: "Error" ,
		description: message ,
		duration: 7
	})
}

@connect(({ RemoteEvents }) => ({ RemoteEvents }))
export default class extends Component {
	render() {
		const { children } = this.props ;
		return children ;
	}
	shouldComponentUpdate({ RemoteEvents: { last: { type, data } } }) {
		const hasReloadRender = Boolean( type && type =="error" ) ;
		hasReloadRender && showErrorNotification( data.error.message ) ;

		return true ;
	}
}