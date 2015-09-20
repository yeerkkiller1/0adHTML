/// <amd-dependency path="https://104236137119.com:7070/LogViewer/FirebaseRead.js">
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "SharedTS/browser/Directive", "angular", "firebase", "https://104236137119.com:7070/LogViewer/FirebaseRead.js"], function (require, exports, Directive, angular, Firebase) {
    console.log("test2");
    var PieceKind;
    (function (PieceKind) {
        PieceKind[PieceKind["Black"] = 0] = "Black";
        PieceKind[PieceKind["White"] = 1] = "White";
    })(PieceKind || (PieceKind = {}));
    var Board = (function () {
        function Board() {
        }
        Board.prototype.toHash = function () {
            var hash = "";
            this.grid.forEach(function (x) {
                x.forEach(function (y) { return hash += y; });
            });
            return hash;
        };
        return Board;
    })();
    var Base = (function (_super) {
        __extends(Base, _super);
        function Base() {
            _super.apply(this, arguments);
            this.templateUrl = "main/main.html";
        }
        Base.prototype.construct = function () {
            this.ref = new Firebase("https://go-ai.firebaseio.com/");
        };
        Base.prototype.run = function (launchCommand, board) {
            var kind = "gtprun";
            var outputRef = this.ref.child(kind).child(launchCommand).child(board.toHash());
        };
        return Base;
    })(Directive);
    var mod = angular.module("Base", ["FirebaseRead"]);
    mod.directive("base", function () {
        return (new Base().createScope());
    });
});
