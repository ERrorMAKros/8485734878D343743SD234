import React, { PureComponent } from "react"
import Style from "./style.scss"
import { Debug } from "../../../utils/Common"
import PropTypes from "prop-types"
import { Spin, Tooltip } from 'antd'
import ClassNames from 'classnames'
import { API } from "../../../constants";

export default class extends PureComponent {
	static propTypes = {
		id: PropTypes.string ,
		category: PropTypes.string ,
		leechs: PropTypes.string ,
		seeds: PropTypes.string ,
		size: PropTypes.string ,
		state: PropTypes.string ,
		title: PropTypes.string ,
		url: PropTypes.string ,
        image: PropTypes.string
	}
	constructor( props ) {
		super( ...arguments ) ;
		/* debug */ Debug.info( "ExplorerItem()", null, props ) ;
	}
	render() {
		const { image, title, url } = this.props;
        const isLoaded = ! _.isEmpty( image || null ) ;

		return (
			<a href={ `${ API.TRACKER }${ url }` } className={ Style.ExplorerItem } target="_blank">
                <Tooltip placement="top" title={ title } arrowPointAtCenter>
					{ isLoaded ? this._renderImage({ image }) : this._renderPreloader({ isLoaded, title }) }
                </Tooltip>
			</a>
		)
	}
	_renderImage = ({ image }) => {
        return <img src={ image } width={ "100%" } height={ "100%" } onError={ this.onImgError }/> ;
	}
	_renderPreloader = ({ isLoaded, title }) => {
        return (
            <Spin spinning={ ! isLoaded } tip="LOADING" size="large" className={ Style.ExplorerItemSpinner }>
	            <p className={ ClassNames( Style.ExplorerItemContext, { Disabled: isLoaded } )} />
            </Spin>
        )

	}
	onImgError = ( event ) => {
		event.target.src=`http://${ API.HOST }/images/no-image.png` ;
	}
}