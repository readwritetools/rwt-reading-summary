//=============================================================================
//
//  File:         /node_modules/rwt-reading-summary/rwt-reading-summary.js
//  Language:     ECMAScript 2015
//  Copyright:    Read Write Tools © 2020
//  License:      MIT
//  Initial date: Jan 15, 2020
//  Contents:     Display reader's experience points and reading history
//
//=============================================================================

import ReadersData from './readers-data.class.js';
import ReadersItem from './readers-item.class.js';

export default class RwtReadingSummary extends HTMLElement {

	static elementInstance = 1;
	static htmlURL  = '/node_modules/rwt-reading-summary/rwt-reading-summary.blue';
	static cssURL   = '/node_modules/rwt-reading-summary/rwt-reading-summary.css';
	static htmlText = null;
	static cssText  = null;
	
	constructor() {
		super();
				
		// child elements
		this.dialog = null;
		this.closeButton = null;
		this.itemRows = null;
		this.itemTotals = null;
		this.messageText = null;

		// properties
		this.shortcutKey = null;
		this.instance = RwtReadingSummary.elementInstance++;
		this.collapseSender = `RwtReadingSummary ${this.instance}`;
		this.urlPrefix = `${document.location.protocol}//${document.location.hostname}`;
		
		Object.seal(this);
	}

	//-------------------------------------------------------------------------
	// customElement life cycle callback
	//-------------------------------------------------------------------------
	async connectedCallback() {		
		if (!this.isConnected)
			return;

		try {
			var htmlFragment = await this.getHtmlFragment();
			var styleElement = await this.getCssStyleElement();

			this.attachShadow({mode: 'open'});
			this.shadowRoot.appendChild(htmlFragment); 
			this.shadowRoot.appendChild(styleElement); 
			
			this.identifyChildren();
			this.registerEventListeners();
			this.initializeShortcutKey();
			this.loadReadersData();
		}
		catch (err) {
			console.log(err.message);
		}
	}
	
	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	// Only the first instance of this component fetches the HTML text from the server.
	// All other instances wait for it to issue an 'html-template-ready' event.
	// If this function is called when the first instance is still pending,
	// it must wait upon receipt of the 'html-template-ready' event.
	// If this function is called after the first instance has already fetched the HTML text,
	// it will immediately issue its own 'html-template-ready' event.
	// When the event is received, create an HTMLTemplateElement from the fetched HTML text,
	// and resolve the promise with a DocumentFragment.
	getHtmlFragment() {
		return new Promise(async (resolve, reject) => {
			
			document.addEventListener('html-template-ready', () => {
				var template = document.createElement('template');
				template.innerHTML = RwtReadingSummary.htmlText;
				resolve(template.content);
			});
			
			if (this.instance == 1) {
				var response = await fetch(RwtReadingSummary.htmlURL, {cache: "no-cache", referrerPolicy: 'no-referrer'});
				if (response.status != 200 && response.status != 304) {
					reject(new Error(`Request for ${RwtReadingSummary.htmlURL} returned with ${response.status}`));
					return;
				}
				RwtReadingSummary.htmlText = await response.text();
				document.dispatchEvent(new Event('html-template-ready'));
			}
			else if (RwtReadingSummary.htmlText != null) {
				document.dispatchEvent(new Event('html-template-ready'));
			}
		});
	}
	
	// Use the same pattern to fetch the CSS text from the server
	// When the 'css-text-ready' event is received, create an HTMLStyleElement from the fetched CSS text,
	// and resolve the promise with that element.
	getCssStyleElement() {
		return new Promise(async (resolve, reject) => {

			document.addEventListener('css-text-ready', () => {
				var styleElement = document.createElement('style');
				styleElement.innerHTML = RwtReadingSummary.cssText;
				resolve(styleElement);
			});
			
			if (this.instance == 1) {
				var response = await fetch(RwtReadingSummary.cssURL, {cache: "no-cache", referrerPolicy: 'no-referrer'});
				if (response.status != 200 && response.status != 304) {
					reject(new Error(`Request for ${RwtReadingSummary.cssURL} returned with ${response.status}`));
					return;
				}
				RwtReadingSummary.cssText = await response.text();
				document.dispatchEvent(new Event('css-text-ready'));
			}
			else if (RwtReadingSummary.cssText != null) {
				document.dispatchEvent(new Event('css-text-ready'));
			}
		});
	}
		
	//^ Identify this component's children
	identifyChildren() {
		this.dialog = this.shadowRoot.getElementById('dialog');
		this.closeButton = this.shadowRoot.getElementById('close-button');
		this.itemRows = this.shadowRoot.getElementById('item-rows');
		this.itemTotals = this.shadowRoot.getElementById('item-totals');
		this.messageText = this.shadowRoot.getElementById('message-text');
	}
	
	registerEventListeners() {
		// document events
		document.addEventListener('click', this.onClickDocument.bind(this));
		document.addEventListener('keydown', this.onKeydownDocument.bind(this));
		document.addEventListener('collapse-popup', this.onCollapsePopup.bind(this));
		document.addEventListener('toggle-reading-summary', this.onToggleEvent.bind(this));
		
		// component events
		this.dialog.addEventListener('click', this.onClickDialog.bind(this));
		this.closeButton.addEventListener('click', this.onClickClose.bind(this));
	}
	
	//^ Get the user-specified shortcut key. This will be used to open the dialog.
	//  Valid values are "F1", "F2", etc., specified with the *shortcut attribute on the custom element
	initializeShortcutKey() {
		if (this.hasAttribute('shortcut'))
			this.shortcutKey = this.getAttribute('shortcut');
	}

	// Get the reader's data from browser localStorage
	// show most recent items first
	loadReadersData() {
		var readersData = new ReadersData();			
		var rc = readersData.readFromStorage();

		var html = [];
		for (let [filePath, readersItem] of readersData.itemsMap.entries()) {
			html.push(this.formatTableRow(filePath, readersItem));
		}
		html.reverse();
		this.itemRows.innerHTML = html.join('');
		this.itemTotals.innerHTML = this.formatTableFooter(readersData);
		
		// broadcast data to the outside
		var detail = {
			readingTime: this.formatTime(readersData.readingTime),
			pointsObtained: readersData.pointsObtained,
			pagesRead: readersData.pagesRead,
			shortcutKey: this.shortcutKey
		};
		var customEvent = new CustomEvent('rwt-reading-summary-data', {detail: detail});
		document.dispatchEvent(customEvent);
	}

	//-------------------------------------------------------------------------
	// document events
	//-------------------------------------------------------------------------
	
	// close the dialog when user clicks on the document
	onClickDocument(event) {
		this.hideDialog();
		event.stopPropagation();
	}
	
	// close the dialog when user presses the ESC key
	// toggle the dialog when user presses the assigned shortcutKey
	onKeydownDocument(event) {		
		if (event.key == "Escape") {
			this.hideDialog();
			event.stopPropagation();
		}
		// like 'F1', 'F2', etc
		if (event.key == this.shortcutKey) {
			this.toggleDialog();
			event.stopPropagation();
			event.preventDefault();
		}
	}

	//^ Send an event to close/hide all other registered popups
	collapseOtherPopups() {
		var collapseSender = this.collapseSender;
		var collapseEvent = new CustomEvent('collapse-popup', {detail: { collapseSender }});
		document.dispatchEvent(collapseEvent);
	}
	
	//^ Listen for an event on the document instructing this dialog to close/hide
	//  But don't collapse this dialog, if it was the one that generated it
	onCollapsePopup(event) {
		if (event.detail.sender == this.collapseSender)
			return;
		else
			this.hideDialog();
	}
	
	//^ Anybody can use: document.dispatchEvent(new Event('toggle-reading-summary'));
	// to open/close this component.
	onToggleEvent(event) {
		event.stopPropagation();
		this.toggleDialog();
	}
	
	//-------------------------------------------------------------------------
	// component events
	//-------------------------------------------------------------------------

	// Necessary because clicking anywhere on the dialog will bubble up
	// to onClickDocument which will close the dialog
	onClickDialog(event) {
		event.stopPropagation();
	}
	
	// User has clicked on the dialog box's Close button
	onClickClose(event) {
		this.hideDialog();
		event.stopPropagation();
	}
	
	//-------------------------------------------------------------------------
	// component methods
	//-------------------------------------------------------------------------

	toggleDialog() {
		if (this.dialog.style.display == 'none')
			this.showDialog();
		else
			this.hideDialog();
	}
	
	// retrieve and show
	showDialog() {
		this.collapseOtherPopups();
		this.dialog.style.display = 'block';		
	}

	// hide
	hideDialog() {
		this.dialog.style.display = 'none';
	}

	//^ Format one reader's item as a row in the table 
	formatTableRow(filePath, readersItem) {
		var item = readersItem;
		var percent = (item.percentRead * 100).toFixed(0);
		var page = `<a href='${filePath}'>${item.title}</a>`;
		var time = this.formatTime(item.readingTime);
		
		var pointsPossible = item.skillPoints;
		var pointsObtained = Math.round(item.skillPoints * item.percentRead);
		
		return `<tr><td>${page}</td><td>${time}</td><td class='center'>${percent}%</td><td class='center'>${pointsObtained} of ${pointsPossible}</td><td>${item.skillLevel}</td><td>${item.skillCategory}</td></tr>`;
	}

	formatTableFooter(readersData) {
		var pagesRead = readersData.pagesRead;
		var pagesVisited = readersData.pagesVisited;
		var pointsPossible = readersData.pointsPossible;
		var pointsObtained = readersData.pointsObtained;
		var readingTime = this.formatTime(readersData.readingTime);

		return `<tr><th>${pagesRead} read / ${pagesVisited} visited</th><th>${readingTime}</th><th></th><th>${pointsObtained} of ${pointsPossible}</th><th></th><th></th></tr>`;
	}

	formatTime(seconds) {
		if (seconds == 0)
			return '';
		
		// < 1.5 minutes
		if (seconds <= 90) {
			var round5 = Math.round(seconds/5) * 5;
			return `${round5} seconds`;
		}
		
		// < 5 minutes
		if (seconds <= 5*60) {
			var minutes = Math.floor(seconds / 60);
			var remainder = (seconds % 60);
			var round15 = Math.round(remainder/15) * 15;
			return `${minutes} min ${round15} sec`;
		}

		// < 60 minutes
		if (seconds <= 60*60) {
			var minutes = Math.floor(seconds / 60);
			return `${minutes} minutes`;
		}

		// > 1 hour
		var hours = Math.floor(seconds / 3600);
		var remainder = (seconds % 3600);
		var minutes = remainder/60;
		var round5 = Math.round(minutes/5) * 5;
		
		if (seconds <= 2*60*60)
			return `${hours} hour ${round5} min`;
		else
			return `${hours} hours ${round5} min`;
	}
}

window.customElements.define('rwt-reading-summary', RwtReadingSummary);
