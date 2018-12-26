import React from "react";
import {MenuItem, DropdownButton} from "react-bootstrap";
import  {Icon} from "./Components";

const FontSize = (props) => {
		return(
			<DropdownButton className="font-size-dropdown" dropup id="font-size-dropdown" title={<Icon>{props.icon}</Icon>}>
				<MenuItem className={props.hasMark("small-size")?"active":""}
					eventKey='1' 
					onMouseDown={event => (props.onClickMark(event, "small-size"))}>
					Small
				</MenuItem>
				<MenuItem className={props.hasMark("normal-size")?"active":""}
					eventKey='1' 
					onMouseDown={event => (props.onClickMark(event, "normal-size"))}>
					Normal
				</MenuItem>
				<MenuItem className={props.hasMark("large-size")?"active":""}
					eventKey='1' 
					onMouseDown={event => (props.onClickMark(event, "large-size"))}>
					Large
				</MenuItem>
			</DropdownButton>
		)
}

export default FontSize;