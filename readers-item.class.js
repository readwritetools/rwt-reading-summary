//=============================================================================
//
// File:         /node_modules/rwt-reading-points/readers-item.class.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2020
// License:      MIT
// Initial date: Jan 15, 2019
// Contents:     An object representing a single page
//
//=============================================================================

export default class ReadersItem {

	constructor(arg0, arg1, arg2, arg3, arg4, arg5) {
		if (arg0.constructor.name == 'Object')
			this.copyConstructor(arg0);
		else
			this.normalConstructor(arg0, arg1, arg2, arg3, arg4, arg5);
	}

	copyConstructor(rhs) {
		this.title			= rhs.title;
		this.skillCategory 	= rhs.skillCategory;
		this.skillLevel 	= rhs.skillLevel;
		this.skillPoints 	= rhs.skillPoints;
		this.percentRead 	= rhs.percentRead;
		this.readingTime	= rhs.readingTime;
		Object.seal(this);
	}
	
	normalConstructor(title, skillCategory, skillLevel, skillPoints, percentRead, readingTime) {
		this.title 			= title;
		this.skillCategory 	= skillCategory;
		this.skillLevel 	= skillLevel;
		this.skillPoints 	= skillPoints;
		this.percentRead 	= percentRead;		// 0.0 to 1.0
		this.readingTime	= readingTime;		// integer time in seconds
		Object.seal(this);
	}
}
