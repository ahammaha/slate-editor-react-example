import React, {Fragment} from "react";
import {Editor} from "slate-react";
import {Block, Value} from "slate";
import { isKeyHotkey } from 'is-hotkey';
import { Button, Icon, Toolbar } from './Components';
import initialValue from './value.json';
import isUrl from 'is-url';
import imageExtensions from 'image-extensions';
import styled from '@emotion/styled';

/**
 * A styled image block component.
 *
 * @type {Component}
 */
const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`

/*
 * A function to determine whether a URL has an image extension.
 *
 * @param {String} url
 * @return {Boolean}
 */
function isImage(url) {
	return !!imageExtensions.find(url.endsWith)
}

/**
 * A change function to standardize inserting images.
 *
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
 * The editor's schema.
 *
 * @type {Object}
 */
const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node, child }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph')
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph)
        }
      }
    },
  },
  blocks: {
    image: {
      isVoid: true,
    },
  },
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
		value:Value.fromJSON(initialValue)
	}

	/* Check if the current selection has a mark with `type` in it.
	@param {String} type
	@return {Boolean} */
	hasMark = type => {
		const { value } = this.state
		return value.activeMarks.some(mark => mark.type == type)
	}

	/*Check if the any of the currently selected blocks are of `type`.
	@param {String} type
	@return {Boolean}
	*/
	hasBlock = type => {
		const { value } = this.state
		return value.blocks.some(node => node.type == type)
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
					onChange={this.onChange}
					onKeyDown={this.onKeyDown}
					renderNode={this.renderNode}
					renderMark={this.renderMark}
					schema={schema}
				/>
				<Toolbar>
					{this.renderMarkButton('bold', 'format_bold')}
					{this.renderMarkButton('italic', 'format_italic')}
					{this.renderMarkButton('underlined', 'format_underlined')}
					{this.renderMarkButton('code', 'code')}
					{this.renderBlockButton('heading-one', 'looks_one')}
					{this.renderBlockButton('heading-two', 'looks_two')}
					{this.renderBlockButton('block-quote', 'format_quote')}
					{this.renderBlockButton('numbered-list', 'format_list_numbered')}
					{this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
					{this.renderBlockButton('image', 'insert_photo')}
				</Toolbar>
			</div>
		)
	}

	/**
	 * Render a mark-toggling toolbar button.
	 *
	 * @param {String} type
	 * @param {String} icon
	 * @return {Element}
	 */
	renderMarkButton = (type, icon) => {
		const isActive = this.hasMark(type)
		return(
			<Button active={isActive}
					onMouseDown={event=>this.onClickMark(event, type)}>
				<Icon>{icon}</Icon> 
			</Button>
		)
	}

	/**
	 * Render a block-toggling toolbar button.
	 *
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
				<Icon>{icon}</Icon></Button>
		)
	}

	/**
	 * Render a Slate node.
	 *
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
			case 'heading-one':
				return <h1 { ...attributes}>{children}</h1>
			case 'heading-two':
				return <h2 { ...attributes}>{children}</h2>
			case 'list-item':
				return <li { ...attributes}>{children}</li>
			case 'numbered-list':
				return <ol { ...attributes}>{children}</ol>
			case 'image': 
				const src = node.data.get('src')
				return <Image src={src} selected={isFocused} {...attributes} />
			default:
				return next()
		}
	}

	/**
	 * Render a Slate mark.
	 *
	 * @param {Object} props
	 * @return {Element}
	 */
	renderMark = (props, editor, next) => {
		const {
			children,
			mark,
			attributes
		} = props

		switch (mark.type) {
			case 'bold':
				return <strong { ...attributes}>{children}</strong>
			case 'code':
				return <code { ...attributes}>{children}</code>
			case 'italic':
				return <em { ...attributes}>{children}</em>
			case 'underlined':
				return <u { ...attributes}>{children}</u>
			default:
				return next()
		}
	}

	/**
	 * On change, save the new `value`.
	 *
	 * @param {Editor} editor
	 */
	onChange = ({value}) => {
		if (value.document != this.state.value.document) {
			const content = JSON.stringify(value.toJSON())
			localStorage.setItem('content', content)
		}
		this.setState({value})
	}

	/**
	 * On key down, if it's a formatting command toggle a mark.
	 *
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
			return next()
		}
		event.preventDefault()
		editor.toggleMark(mark)
	}

	/**
	 * When a mark button is clicked, toggle the current mark.
	 *
	 * @param {Event} event
	 * @param {String} type
	 */
	onClickMark = (event, type) => {
		event.preventDefault()
		this.editor.toggleMark(type)
	}

	/**
	 * When a block button is clicked, toggle the block type.
	 *
	 * @param {Event} event
	 * @param {String} type
	 */
	onClickBlock = (event, type) => {
		event.preventDefault();
		const {editor}=this
		const {value} = editor
		const {document} = value

		// Handle everything but list buttons.
		if(type==="image"){
			const src = window.prompt('Enter the URL of the image:')
			if (!src) return
			editor.command(insertImage, src)
		} else if (type != 'bulleted-list' && type != 'numbered-list') {
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
				return !!document.getClosest(block.key, parent => parent.type == type)
			})

			if (isList && isType) {
				editor
					.setBlocks(DEFAULT_NODE)
					.unwrapBlock('bulleted-list')
					.unwrapBlock('numbered-list')
			} else if (isList) {
				editor
					.unwrapBlock(
						type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
					)
					.wrapBlock(type)
			} else {
				editor.setBlocks('list-item').wrapBlock(type)
			}
		}
	}
}


export default MailEditor;