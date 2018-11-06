import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import React from "react";
import { AppContainer } from "react-hot-loader";
import Application from "./components/Application";
import { LocaleProvider } from "antd";
import enUS from "antd/lib/locale-provider/en_US";
import Moment from "moment";
import store from "./redux/store";
import Underscore from "underscore";
import "../src/styles/antd.less";
import "../src/styles/globals.less";

Moment.locale('ru');
Underscore.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

let $AUTH = {
	user: null,
	password: null
}

ReactDOM.render(
	<LocaleProvider locale={ enUS }>
		<Provider store={store}>
			<AppContainer>
				<Application/>
			</AppContainer>
		</Provider>
	</LocaleProvider>,
	document.getElementById( 'root' )
);

// Hot Module Replacement API
if( module.hot ) module.hot.accept( 'components/Application', () => <Application/> );
