/// <amd-dependency path="SharedTS/content/SharedTS/browser/FirebaseRead.js">
/// <amd-dependency path="SharedTS/content/SharedTS/browser/syncUrl.js">
/// <amd-dependency path="SharedTS/content/SharedTS/browser/SyncVariable.js">

/// <amd-dependency path="SharedTS/content/SharedTS/browser/objIntegrate.js">

import Directive = require("SharedTS/content/SharedTS/browser/Directive");

import _ = require("underscore");
import angular = require("angular");
import Firebase = require("firebase");

class Base extends Directive {
	public templateUrl = "main/main.html";
	public cssUrl = "main/main.css";
	
	public ref: Firebase;
	
	construct() {
		this.ref = new Firebase("https://0ad.firebaseio.com/");
	}
	
	public countKeys(obj) {
		var count = 0;
		for(var key in obj) count++;
		return count;
	}
	public max(obj, key) {
		var fnc = key && (k => k[key]);
		return _.max(obj, fnc);
	}
	public min(obj, key) {
		var fnc = key && (k => k[key]);
		return _.min(obj, fnc);
	}
	
	public flatten(obj) {
		var arr = [];
		_.forEach(obj, x => _.forEach(x, k => arr.push(k)));
		return arr;
	}
	
	public select(obj, key) {
		return _.map(obj, x => x[key]);
	}
}

var mod = angular.module("Base", ["FirebaseRead", "syncUrl", "SyncVariable", "objIntegrate"]);
mod.directive("base", function() {
	return <any>(new Base().createScope());
});