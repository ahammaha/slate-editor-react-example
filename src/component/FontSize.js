import React from "react";
import {MenuItem, DropdownButton} from "react-bootstrap";
import  {Icon} from "./Components";

class FontSize extends React.Component{
	render(){
		return(
			<DropdownButton className="font-size-dropdown" dropup id="font-size-dropdown" title={<Icon>{this.props.icon}</Icon>}>
				<MenuItem className={this.props.hasMark("small-size")?"active":""}
					eventKey='1' 
					onMouseDown={event => (this.props.onClickMark(event, "small-size"))}>
					Small
				</MenuItem>
				<MenuItem className={this.props.hasMark("normal-size")?"active":""}
					eventKey='1' 
					onMouseDown={event => (this.props.onClickMark(event, "normal-size"))}>
					Normal
				</MenuItem>
				<MenuItem className={this.props.hasMark("large-size")?"active":""}
					eventKey='1' 
					onMouseDown={event => (this.props.onClickMark(event, "large-size"))}>
					Large
				</MenuItem>
			</DropdownButton>
		)
	}
}

export default FontSize;