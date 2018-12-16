import React from "react";
import {Modal, Button} from "react-bootstrap";
import "./ImageModal.css";

const ImageModal = (props) =>{
	return(
		<Modal dialogClassName="imageModalDialog"
			show={props.isImageModalOpen}
			onHide={props.toggleImageModal}
			backdrop="static">
			<Modal.Header closeButton>
				<Modal.Title className="imageModalTitle">Upload Photos</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="inputHolder">
					<label htmlFor="imageUrl" className="grey-text">Paste an Image URL here:</label>
					<input type="text" name="imageUrl" value={props.imageUrl} onChange={(e)=>props.imageUrlChange(e)} />
				</div>
				<div className="modalBtnDiv">
					<Button bsStyle="primary" onClick={(e)=>props.addImage(e)}>OK</Button>
					<Button onClick={props.toggleImageModal}>Cancel</Button>
				</div>
			</Modal.Body>
		</Modal>
	)
}  
export default ImageModal;