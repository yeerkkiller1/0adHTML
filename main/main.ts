/// <amd-dependency path="https://104236137119.com:7070/LogViewer/FirebaseRead.js">

//Hmm... time to put this in a nuget package
import CreateFirebasePromise = require("https://104236137119.com:7070/common/firebase/CreateFirebasePromise.ts")

import Directive = require("SharedTS/browser/Directive");

import _ = require("underscore");
import angular = require("angular");
import Firebase = require("firebase");

console.log("test2");

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
		this.ref = new Firebase("https://go-ai.firebaseio.com/");
	}
	run(launchCommand: string, board: Board) {
		var kind = "gtprun";
		var outputRef = this.ref.child(kind).child(launchCommand).child(board.toHash());
		
	}
}

var mod = angular.module("Base", ["FirebaseRead"]);
mod.directive("base", function() {
	return <any>(new Base().createScope());
});