import React from "react";
import {Modal, Button} from "react-bootstrap";
import "./LinkModal.css";

const LinkModal = (props) =>{
	return(
		<Modal dialogClassName="linkModalDialog"
			show={props.isLinkModalOpen}
			onHide={props.toggleLinkModal}
			backdrop="static">
			<Modal.Header closeButton>
				<Modal.Title className="linkModalTitle">Edit Link</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="inputHolder">
					<label htmlFor="linkText" className="grey-text">Text to display:</label>
					<input type="text" name="linkText" value={props.linkDetails.text} onChange={(e)=>props.linkContentChange(e,"text")} />
				</div>
				<div className="inputHolder">
					<label htmlFor="linkUrl" className="grey-text">URL to link the text to:</label>
					<input type="text" name="linkUrl" value={props.linkDetails.url} onChange={(e)=>props.linkContentChange(e,"url")} />
				</div>
				<div className="modalBtnDiv">
					<Button bsStyle="primary" onClick={(e)=>props.addLink(e)}>OK</Button>
					<Button onClick={props.toggleLinkModal}>Cancel</Button>
				</div>
			</Modal.Body>
		</Modal>
	)
}  
export default LinkModal;