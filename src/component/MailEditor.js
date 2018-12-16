import React from "react";
import {Editor,getEventTransfer} from "slate-react";
import {Value} from "slate";
import { isKeyHotkey } from 'is-hotkey';
import { Button, Icon, Toolbar } from './Components';
import initialValue from './value.json';
import ReactDOM from 'react-dom';
import isUrl from 'is-url'
import FileAttachment from "./FileAttachment";
import FontSize from "./FontSize";
import LinkModal from "./LinkModal";
import styled from '@emotion/styled';

const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`

/**
 * The editor's schema.
 * @type {Object}
 */
const schema = {
	blocks: {
		image: {
			isVoid: true,
		},
	},
}

/**
 * A change function to standardize inserting images.
 * @param {Editor} editor
 * @param {String} src
 * @param {Range} target
 */
function insertImage(editor, src, target) {
	if (target) {
		editor.select(target)
	}
	editor.insertBlock({
		type: 'image',
		data: { src },
	})
}

/**
 * A change helper to standardize wrapping links.
 * @param {Editor} editor
 * @param {String} href
 */
function wrapLink(editor, href) {
	editor.wrapInline({
		type: 'link',
		data: { href },
	})
	editor.moveToEnd()
}

/**
 * A change helper to standardize unwrapping links.
 * @param {Editor} editor
 */
function unwrapLink(editor) {
	editor.unwrapInline('link')
}

/**
 * Define the default node type.
 *
 * @type {String}
 */
const DEFAULT_NODE = 'paragraph'

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */
const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

class MailEditor extends React.Component{
	state={
		value:Value.fromJSON(initialValue),
		fileDetails:[],
		isLinkModalOpen:false,
		linkDetails:{text:"",url:"",isSelectedText:false}
	}

	/**
	* Check whether the current selection has a link in it.
	* @return {Boolean} hasLinks
	*/

	hasLinks = () => {
		const { value } = this.state
		return value.inlines.some(inline => inline.type === 'link')
	}

	/* Check if the current selection has a mark with `type` in it.
	@param {String} type
	@return {Boolean} */
	hasMark = type => {
		const { value } = this.state
		return value.activeMarks.some(mark => mark.type === type)
	}

	/*Check if the any of the currently selected blocks are of `type`.
	@param {String} type
	@return {Boolean}
	*/
	hasBlock = type => {
		const { value } = this.state
		return value.blocks.some(node => node.type === type)
	}


	/*Store a reference to the `editor`.
	@param {Editor} editor
	*/
	ref = editor => {this.editor = editor}

	render(){
		return(
			<div>
				<div className="emailAddr">
					<span className="toAddr">To</span>
					<input type="text"/>
				</div>
				
				<div className="subjectDiv">
					<input type="text" placeholder="Subject" />
				</div>
				
				<Editor
					spellCheck
					autoFocus
					ref={this.ref}
					value={this.state.value}
					onPaste={this.onPaste}
					onChange={this.onChange}
					onKeyDown={this.onKeyDown}
					renderNode={this.renderNode}
					renderMark={this.renderMark}
					addLink={this.addLink}
					schema={schema}
				/>
				<div>
					{this.state.fileDetails.map(
						(fileDetail,index)=> <FileAttachment key={fileDetail.name+"_"+index}
										removeAttachment={this.removeAttachment} 
										src={fileDetail.src} 
										filename={fileDetail.name} 
										fileSize={fileDetail.size} />					
					)}
				</div>
				<Toolbar>
					{this.renderMarkButton('font-size', 'format_size')}
					{this.renderMarkButton('bold', 'format_bold')}
					{this.renderMarkButton('italic', 'format_italic')}
					{this.renderMarkButton('underlined', 'format_underlined')}
					{this.renderMarkButton('code', 'code')}
					{this.renderBlockButton('block-quote', 'format_quote')}
					{this.renderBlockButton('numbered-list', 'format_list_numbered')}
					{this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
					{this.renderBlockButton('link', 'link')}
					{this.renderBlockButton('image', 'insert_photo')}
				</Toolbar>
				<div className="footerDiv">
					<button className="sendButton" type="button">Send</button>
					<div className="fileAttachmentDiv">
						{this.renderBlockButton('file', 'attach_file')}
					</div>
				</div>
				<LinkModal 
					linkDetails={this.state.linkDetails}
					linkContentChange={this.linkContentChange}
					toggleLinkModal={this.toggleLinkModal} 
					addLink={this.addLink}
					isLinkModalOpen={this.state.isLinkModalOpen}/>
			</div>
		)
	}

	addLink = (e) =>{
		this.toggleLinkModal()
		const {editor}=this
		const href = this.state.linkDetails.url.trim()
		if (href === null || href.length===0) {
			this.setState({linkDetails:{url:"",text:"",isSelectedText:false}})
			return
		}
		if(this.state.linkDetails.isSelectedText){
			this.setState({linkDetails:{url:"",text:"",isSelectedText:false}},
				()=>{editor.command(wrapLink, href)})
		}else{
			const text = this.state.linkDetails.text.trim()
			if (text === null || text.length===0) {
				this.setState({linkDetails:{url:"",text:"",isSelectedText:false}})
				return
			}
			this.setState({linkDetails:{url:"",text:"",isSelectedText:false}},()=>{editor
				.insertText(text)
				.moveFocusBackward(text.length)
				.command(wrapLink, href)})
		}
	}

	linkContentChange=(e,field)=>{
		this.setState({linkDetails:{...this.state.linkDetails,[field]:e.target.value}})
	}

	/**
	 * Render a mark-toggling toolbar button.
	 * @param {String} type
	 * @param {String} icon
	 * @return {Element}
	 */
	renderMarkButton = (type, icon) => {
		const isActive = this.hasMark(type)
		return(
			<Button active={isActive}
					onMouseDown={event=>this.onClickMark(event, type)}>
				{type==="font-size" && <FontSize hasMark={this.hasMark} onClickMark={this.onClickMark} icon={icon} />}
				{type!=="font-size" && <Icon>{icon}</Icon>} 
			</Button>
		)
	}

	/**
	 * Render a block-toggling toolbar button.
	 * @param {String} type
	 * @param {String} icon
	 * @return {Element}
	 */
	renderBlockButton = (type, icon) => {
		let isActive = this.hasBlock(type)
		if (['numbered-list', 'bulleted-list'].includes(type)) {
			const {value: {document,blocks}} = this.state
			if (blocks.size > 0) {
				const parent = document.getParent(blocks.first().key)
				isActive = this.hasBlock('list-item') && parent && parent.type === type
			}
		}
		return( 
			<Button active={isActive}
				onMouseDown={event => this.onClickBlock(event, type)}>
				{type==='file' && <input id="fileInput" ref="fileInput" onChange={(e)=>this.addFile(e)} type="file" style={{display:"none"}} />}
				<Icon>{icon}</Icon>
			</Button>
		)
	}

	addFile = (e) => {
		let file = e.target.files[0];
		let fileSrc=e.target.value;
		this.setState(
			{fileDetails: [...this.state.fileDetails,{src:fileSrc,size:file.size,name:file.name}]}
		);
	}

	/**
	 * Render a Slate node.
	 * @param {Object} props
	 * @return {Element}
	 */
	renderNode = (props, editor, next) => {
		const {attributes,children,node,isFocused}=props
		switch (node.type) {
			case 'block-quote':
				return <blockquote { ...attributes} >{children}</blockquote>
			case 'bulleted-list':
				return <ul { ...attributes}>{children}</ul>
			case 'list-item':
				return <li { ...attributes}>{children}</li>
			case 'numbered-list':
				return <ol { ...attributes}>{children}</ol>
			case 'link': {
				const { data } = node
				const href = data.get('href')
				return <a className="textLink" {...attributes} href={href}>{children}</a>
			}
			case 'image': 
				const src = node.data.get('src')
				return <Image src={src} selected={isFocused} {...attributes} />
			default:
				return next()
		}
	}

	removeAttachment = (src) =>{
		this.setState(prevState => ({
			fileDetails: prevState.fileDetails.filter(fileDetail => fileDetail.src !== src )
		}));
	}

	/**
	 * Render a Slate mark.
	 * @param {Object} props
	 * @return {Element}
	 */
	renderMark = (props, editor, next) => {
		const {children,mark,attributes}=props
		switch (mark.type) {
			case 'bold':
				return <strong { ...attributes}>{children}</strong>
			case 'code':
				return <code { ...attributes}>{children}</code>
			case 'italic':
				return <em { ...attributes}>{children}</em>
			case 'underlined':
				return <u { ...attributes}>{children}</u>
			case 'small-size':
				return <font size="1" {...attributes}>{children}</font>
			case 'large-size':
				return <font size="4" {...attributes}>{children}</font>
			default:
				return next()
		}
	}

	/**
	 * On change, save the new `value`.
	 * @param {Editor} editor
	 */
	onChange = ({value}) => {
		if (value.document !== this.state.value.document) {
			const content = JSON.stringify(value.toJSON())
			localStorage.setItem('content', content)
		}
		this.setState({value})
	}

	/**
	 * On key down, if it's a formatting command toggle a mark.
	 * @param {Event} event
	 * @param {Editor} editor
	 * @return {Change}
	 */
	onKeyDown = (event, editor, next) => {
		let mark;
		if (isBoldHotkey(event)) {
			mark = 'bold'
		} else if (isItalicHotkey(event)) {
			mark = 'italic'
		} else if (isUnderlinedHotkey(event)) {
			mark = 'underlined'
		} else if (isCodeHotkey(event)) {
			mark = 'code'
		} else {
			try{
				return next()
			}catch(err){
				return editor
			}
		}
		event.preventDefault()
		editor.toggleMark(mark)
	}

	toggleLinkModal = () =>{
		this.setState(prevState => ({isLinkModalOpen: !prevState.isLinkModalOpen}));
	}

	/**
	 * When a mark button is clicked, toggle the current mark.
	 * @param {Event} event
	 * @param {String} type
	 */
	onClickMark = (event, type) => {
		event.preventDefault()
		if(type==="small-size"){
			if(this.hasMark("normal-size")){
				this.editor.toggleMark("normal-size")		
			} else if(this.hasMark("large-size")){
				this.editor.toggleMark("large-size")		
			}
		} else if(type==="normal-size"){
			if(this.hasMark("small-size")){
				this.editor.toggleMark("small-size")		
			} else if(this.hasMark("large-size")){
				this.editor.toggleMark("large-size")		
			}
		} else if(type==="large-size"){
			if(this.hasMark("small-size")){
				this.editor.toggleMark("small-size")		
			} else if(this.hasMark("normal-size")){
				this.editor.toggleMark("normal-size")		
			}
		}
		this.editor.toggleMark(type)
	}

	/**
	 * When a block button is clicked, toggle the block type.
	 * @param {Event} event
	 * @param {String} type
	 */
	onClickBlock = (event, type) => {
		event.preventDefault();
		const {editor}=this
		const {value} = editor
		const {document} = value

		if(type==="file"){
			ReactDOM.findDOMNode(this.refs.fileInput).click()
		} else if(type==="image"){
			const src = window.prompt('Enter the URL of the image:')
			if (!src) return
			editor.command(insertImage, src)
		} else if(type==='link'){
			const hasLinks = this.hasLinks()
			if (hasLinks) {
				editor.command(unwrapLink)
			} else if (value.selection.isExpanded) {
				this.setState({linkDetails:{...this.state.linkDetails,isSelectedText:true}})
				this.toggleLinkModal()
			} else {
				this.toggleLinkModal()
			}
		} else if (type !== 'bulleted-list' && type !== 'numbered-list') {
			const isActive = this.hasBlock(type)
			const isList = this.hasBlock('list-item')
			if (isList) {
				editor
					.setBlocks(isActive ? DEFAULT_NODE : type)
					.unwrapBlock('bulleted-list')
					.unwrapBlock('numbered-list')
			} else {
				editor.setBlocks(isActive ? DEFAULT_NODE : type)
			}
		} else {
			// Handle the extra wrapping required for list buttons.
			const isList = this.hasBlock('list-item')
			const isType = value.blocks.some(block => {
				return !!document.getClosest(block.key, parent => parent.type === type)
			})

			if (isList && isType) {
				editor
					.setBlocks(DEFAULT_NODE)
					.unwrapBlock('bulleted-list')
					.unwrapBlock('numbered-list')
			} else if (isList) {
				editor
					.unwrapBlock(
						type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
					)
					.wrapBlock(type)
			} else {
				editor.setBlocks('list-item').wrapBlock(type)
			}
		}
	}

	/**
	* On paste, if the text is a link, wrap the selection in a link.
	* @param {Event} event
	* @param {Editor} editor
	* @param {Function} next
	*/
	onPaste = (event, editor, next) => {
		if (editor.value.selection.isCollapsed) return next()
		const transfer = getEventTransfer(event)
		const { type, text } = transfer
		if (type !== 'text' && type !== 'html') return next()
		if (!isUrl(text)) return next()
		if (this.hasLinks()) {
			editor.command(unwrapLink)
		}
		editor.command(wrapLink, text)
	}
}


export default MailEditor;