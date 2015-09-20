/// <amd-dependency path="SharedTS/content/SharedTS/browser/FirebaseRead.js">
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "SharedTS/content/SharedTS/browser/Directive", "angular", "firebase", "SharedTS/content/SharedTS/browser/FirebaseRead.js"], function (require, exports, Directive, angular, Firebase) {
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
            this.ref = new Firebase("https://0ad.firebaseio.com/");
        };
        return Base;
    })(Directive);
    var mod = angular.module("Base", ["FirebaseRead"]);
    mod.directive("base", function () {
        return (new Base().createScope());
    });
});
