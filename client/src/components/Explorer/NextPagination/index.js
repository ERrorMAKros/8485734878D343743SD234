import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ParentStyle from "../Item/style.scss";
import Style from "./style.scss";

class NextPagination extends PureComponent {
	static propTypes = {
		numPagesLeft: PropTypes.number.isRequired ,
		enabled: PropTypes.bool.isRequired ,
		onClick: PropTypes.func
	}
	render() {
		const { enabled, numPagesLeft, onClick} = this.props ;
		return (
			<div className={ enabled ? ParentStyle.ExplorerButtonNextEnabled : ParentStyle.ExplorerButtonNextDisabled } onClick={ ()=>onClick ? onClick( this ) : null }>
				<div className={ Style.NextPagination }>{ numPagesLeft }</div>
			</div>
		)
	}
}

export default NextPagination ;