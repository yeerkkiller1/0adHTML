/// <amd-dependency path="SharedTS/content/SharedTS/browser/FirebaseRead.js">

import Directive = require("SharedTS/content/SharedTS/browser/Directive");

import _ = require("underscore");
import angular = require("angular");
import Firebase = require("firebase");


enum PieceKind {
	Black,
	White
}

class Board {
	public grid: PieceKind[][];
	public toHash() {
		var hash = "";
		this.grid.forEach(x => {
			x.forEach(y => hash += y);
		});
		return hash;
	}
}

class Base extends Directive {
	public templateUrl = "main/main.html";
	
	public ref: Firebase;
	
	construct() {
		this.ref = new Firebase("https://0ad.firebaseio.com/");
	}
}

var mod = angular.module("Base", ["FirebaseRead"]);
mod.directive("base", function() {
	return <any>(new Base().createScope());
});