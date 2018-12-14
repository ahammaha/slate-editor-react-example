import React from "react";
import {MenuItem, DropdownButton} from "react-bootstrap";
import  {Icon} from "./Components";

class FontSize extends React.Component{
	render(){
		return(
			<DropdownButton className="font-size-dropdown" dropup id="font-size-dropdown" title={<Icon>{this.props.icon}</Icon>}>
				<MenuItem className={this.props.hasBlock("small-size")?"active":""}
					eventKey='1' 
					onMouseDown={event => (this.props.onClickBlock(event, "small-size"))}>
					Small
				</MenuItem>
				<MenuItem className={this.props.hasBlock("normal-size")?"active":""}
					eventKey='1' 
					onMouseDown={event => (this.props.onClickBlock(event, "normal-size"))}>
					Normal
				</MenuItem>
				<MenuItem className={this.props.hasBlock("large-size")?"active":""}
					eventKey='1' 
					onMouseDown={event => (this.props.onClickBlock(event, "large-size"))}>
					Large
				</MenuItem>
			</DropdownButton>
		)
	}
}

export default FontSize;