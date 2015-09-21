/// <amd-dependency path="SharedTS/content/SharedTS/browser/FirebaseRead.js">
/// <amd-dependency path="SharedTS/content/SharedTS/browser/FirebaseReadShallow.js">
/// <amd-dependency path="SharedTS/content/SharedTS/browser/syncUrl.js">
/// <amd-dependency path="SharedTS/content/SharedTS/browser/SyncVariable.js">

/// <amd-dependency path="SharedTS/content/SharedTS/browser/objIntegrate.js">

import Directive = require("SharedTS/content/SharedTS/browser/Directive");

import _ = require("underscore");
import angular = require("angular");
import Firebase = require("firebase");

function hashCode(text: string) {
  var hash = 0, i, chr, len;
  if (text.length == 0) return hash;
  for (i = 0, len = text.length; i < len; i++) {
    chr   = text.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function hsl(h, s, l) {
	return "hsl("+h+", " + s + "%, " + l + "%)";
}

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
	
	public mostRecent(obj, key, count) {
		var arr = _.map(obj, _.identity);
		arr.sort((a, b) => {
			if(a[key] < b[key]) {
				return -1;
			} else if(a[key] < b[key]) {
				return +1;
			}
			return 0;
		});
	}
	
	public flatten(obj) {
		var arr = [];
		_.forEach(obj, x => _.forEach(<any>x, k => arr.push(k)));
		return arr;
	}
	
	public select(obj, key) {
		return _.map(obj, x => x[key]);
	}
	
	public maxCount(unitsObj) {
		var max = 0;
		_.forEach(unitsObj, unitObj => {
			max = Math.max(max, unitObj["countTotal"] && unitObj["countTotal"]["count"]);
		});
		return max;
	}
	
	public getColor(text) {
		return hsl(hashCode(text) % 360, 75, 75);
	}
	
	public playerNames(playerIDs, playerNames) {
		if(!playerNames) return [];
		var arr = [];
		_.forEach(_.keys(playerIDs), playerID => {
			arr.push(playerNames[playerID] || playerID);
		});
		return arr;
	}
	
	public keys(obj) {
		return _.keys(obj);
	}
}

var mod = angular.module("Base", ["FirebaseRead", "syncUrl", "SyncVariable", "objIntegrate", "FirebaseReadShallow"]);
mod.directive("base", function() {
	return <any>(new Base().createScope());
});

mod.filter('reverse', function () {
	return function (items) {
		return items.slice().reverse();
	};
});

mod.filter('sort', function () {
	return function (items) {
		items = items.slice();
		items.sort();
		return items;
	};
});
