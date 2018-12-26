import React from "react";
import {Image} from "../component/Components";

/**
 * The editor's schema.
 * @type {Object}
 */
export const Schema = {
	blocks: {
		image: {
			isVoid: true,
		},
	},
}

/**
 * Tags to blocks.
 * @type {Object}
 */
const BLOCK_TAGS = {
	p: 'paragraph',
	li: 'list-item',
	ul: 'bulleted-list',
	ol: 'numbered-list',
	blockquote: 'block-quote',
}


/**
 * Tags to marks.
 * @type {Object}
 */
const MARK_TAGS = {
	strong: 'bold',
	em: 'italic',
	u: 'underlined',
	code: 'code',
}


// has the rules for serializing and deserializing the html tags
export const Rules = [
	{
		deserialize(el, next) {
			const block = BLOCK_TAGS[el.tagName.toLowerCase()]

			if (block) {
				return {
					object: 'block',
					type: block,
					nodes: next(el.childNodes),
				}
			}
		},
		serialize(obj, children) {
			if (obj.object === 'block') {
				switch (obj.type) {
					case 'paragraph':
						return <p className={obj.data.get('className')}>{children}</p>
					case 'block-quote':
						return <blockquote>{children}</blockquote>
					case 'image':
						const src = obj.data.get('src')
			return <Image src={src} />
			case 'list-item':
				return <li>{children}</li>
			case 'bulleted-list':
				return <ul>{children}</ul>
			case 'numbered-list':
				return <ol>{children}</ol>
			default:
				return <p>{children}</p>
				}
			} else if(obj.object==="inline"){
				if(obj.type==="link"){
					const { data } = obj
			const href = data.get('href')
			return <a className="textLink" href={href}>{children}</a>
				}
			}
		}
	},
	{
		deserialize(el, next) {
			const mark = MARK_TAGS[el.tagName.toLowerCase()]

			if (mark) {
				return {
					object: 'mark',
					type: mark,
					nodes: next(el.childNodes),
				}
			}
		},
		serialize(obj, children) {
			if (obj.object === 'mark') {
				switch (obj.type) {
					case 'bold':
						return <strong>{children}</strong>
					case 'italic':
						return <em>{children}</em>
					case 'underlined':
						return <u>{children}</u>
					case 'code':
						return <code>{children}</code>
					case 'large-size':
						return <font size='4'>{children}</font>
					case 'small-size':
						return <font size='1'>{children}</font>
					case 'normal-size':
						return <font>{children}</font>
				}
			}
		},
	},
	{
		// Special case for images, to grab their src.
		deserialize(el, next) {
			if (el.tagName.toLowerCase() === 'img') {
				return {
					object: 'block',
					type: 'image',
					nodes: next(el.childNodes),
					data: {
						src: el.getAttribute('src'),
					},
				}
			}
		},
	},
	{
		// Special case for links, to grab their href.
		deserialize(el, next) {
			if (el.tagName.toLowerCase() === 'a') {
				return {
					object: 'inline',
					type: 'link',
					nodes: next(el.childNodes),
					data: {
						href: el.getAttribute('href'),
					},
				}
			}
		},
	},
	{
		// Special case for links, to grab their href.
		deserialize(el, next) {
			if (el.tagName.toLowerCase() === 'font') {
				let type="normal-size";
				if(el.getAttribute('size')==='1'){
					type="small-size"
				}else if(el.getAttribute('size')==='4'){
					type="large-size"
				}
				return {
					object: 'mark',
					type: type,
					nodes: next(el.childNodes),
					data: {
						size: el.getAttribute('size'),
					},
				}
			}
		},
	},
]