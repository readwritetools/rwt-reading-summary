//=============================================================================
//
// File:         /node_modules/rwt-reading-points/readers-data.class.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2020
// License:      MIT
// Initial date: Jan 14, 2020
// Contents:     An object containing a list of this visitor's pages
//               suitable for storing in browser localStorage
//
//=============================================================================

import ReadersItem from './readers-item.class.js';

export default class ReadersData {

	static localStorageKey() {
		return 'readers-data';
	}
	
	constructor() {
		this.readingTime = 0;
		this.pointsPossible = 0;
		this.pointsObtained = 0;
		this.pagesVisited = 0;
		this.pagesRead = 0;
		this.itemsMap = new Map();			// filePath => ReadersItem
    	Object.seal(this);
	}
	
	static exists() {
		return localStorage.getItem(ReadersData.localStorageKey()) != null;
	}
	
	// Read details and accumulate totals
	//< true if localStorage exists
	//< false if localStorage does not exist
	readFromStorage() {
		var json = localStorage.getItem(ReadersData.localStorageKey());
		if (json) {
			var anonymousMap = new Map(JSON.parse(json));
			// cast the items of the map to be ReadersItems
			for (let [itemKey, anonymousObj] of anonymousMap) {
				this.itemsMap.set(itemKey, new ReadersItem(anonymousObj));
				this.pointsPossible += anonymousObj.skillPoints;
				this.pointsObtained += (anonymousObj.skillPoints * anonymousObj.percentRead);
				this.readingTime += anonymousObj.readingTime;

				this.pagesVisited++
				if (anonymousObj.percentRead > 0)
					this.pagesRead++
			}
			this.pointsObtained = Math.round(this.pointsObtained);
			return true;
		}
		else
			return false;
	}

	// Convert data to JSON and save to localStorage
	writeToStorage() {
		var json = JSON.stringify(Array.from(this.itemsMap.entries()));
		localStorage.setItem(ReadersData.localStorageKey(), json);
	}
	
	//^ Add a page to the list of readersItems, if it doesn't already exist
	//  or update it when the user revisits it
	addPage(filePath, title, skillCategory, skillLevel, skillPoints, suggestedReadingTime, percentRead, readingTime) {		
		var readersItem = this.itemsMap.get(filePath);
		
		// first time visting this page
		if (readersItem == undefined) {
			readersItem = new ReadersItem(title, skillCategory, skillLevel, skillPoints, suggestedReadingTime, percentRead, readingTime);
			this.itemsMap.set(filePath, readersItem);
		}
		
		// return visit
		else {
			// update the percent read only if it's greater than the previous time
			if (percentRead > readersItem.percentRead)
				readersItem.percentRead = percentRead;
			
			// accumulate the reading time
			readersItem.readingTime += readingTime;			
			this.itemsMap.set(filePath, readersItem);
		}
	}	

}	