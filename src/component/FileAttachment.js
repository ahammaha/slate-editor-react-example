import React from 'react';

const FileAttachment = (props) =>{
	return(
		<div className="file-attachment-div">
			<a readOnly className="file-attachment" href={props.src}>
				{props.filename}
				<span className="grey-text">({props.fileSize})</span>
				<span className="remove-attachment" onClick={()=>props.removeAttachment(props.src)}></span>
			</a>
		</div>
	)
}

export default FileAttachment;