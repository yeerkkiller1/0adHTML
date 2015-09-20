import angular = require("angular");
import loadCss = require("./loadCss");

class Directive implements angular.IScope {
    [index: string]: any;
    //IScope implemention
    $apply(): any;
    $apply(exp: string): any
    $apply(exp: (scope: angular.IScope) => any): any;
    $apply(x?: any): any { throw new Error(); }

    $applyAsync(): any;
    $applyAsync(exp: string): any;
    $applyAsync(exp: (scope: angular.IScope) => any): any;
    $applyAsync(x?: any): any { }

    $broadcast(name: string, ...args: any[]): angular.IAngularEvent { return null; }
    $destroy(): void { }
    $digest(): void { }
    $emit(name: string, ...args: any[]): angular.IAngularEvent { return null; }
    $eval(): any;
    $eval(expression: string, locals?: Object): any;
    $eval(expression: (scope: angular.IScope) => any, locals?: Object): any;
    $eval(x?: any): any { }
    $evalAsync(): void;
    $evalAsync(expression: string): void;
    $evalAsync(expression: (scope: angular.IScope) => any): void;
    $evalAsync(x?: any): void { }
    $new(isolate?: boolean, parent?: angular.IScope): angular.IScope { return null; }
    $on(name: string, listener: (event: angular.IAngularEvent, ...args: any[]) => any): Function { return null; }
    $watch(watchExpression: string, listener?: string, objectEquality?: boolean): Function;
    $watch(watchExpression: string, listener?: (newValue: any, oldValue: any, scope: angular.IScope) => any, objectEquality?: boolean): Function;
    $watch(watchExpression: (scope: angular.IScope) => any, listener?: string, objectEquality?: boolean): Function;
    $watch(watchExpression: (scope: angular.IScope) => any, listener?: (newValue: any, oldValue: any, scope: angular.IScope) => any, objectEquality?: boolean): Function;
    $watch(x?: any, y?: any, z?: any): any { }
    $watchCollection(watchExpression: string, listener: (newValue: any, oldValue: any, scope: angular.IScope) => any): Function;
    $watchCollection(watchExpression: (scope: angular.IScope) => any, listener: (newValue: any, oldValue: any, scope: angular.IScope) => any): Function;
    $watchCollection(x?: any, y?: any, z?: any): any { }
    $watchGroup(watchExpressions: any[], listener: (newValue: any, oldValue: any, scope: angular.IScope) => any): Function;
    $watchGroup(watchExpressions: { (scope: angular.IScope): any }[], listener: (newValue: any, oldValue: any, scope: angular.IScope) => any): Function;
    $watchGroup(x?: any, y?: any, z?: any): any { }
    $parent: angular.IScope;
    $root: angular.IRootScopeService;
    $id: number;
    $$isolateBindings: any;
    $$phase: any;

    public element: angular.IAugmentedJQuery;

    private scope: angular.IScope;
    constructor() {
        for (var key in Directive.prototype) {
            if (key === "link" || key === "createScope" || key === "construct" || key === "safeApply") continue;
            if (typeof this[key] === "function") {
                ((key) => {
                    var self = this;
                    this[key] = function () {
                        self.scope[key].apply(self.scope, arguments);
                    };
                })(key);
            }
        }
    }

    public createScope() {
        var scope = {};
        for (var key in this) {
            if (key[0] === "$") continue;
            var val = this[key];
            if (val === "=" || val === "=?"
                || val === "&" || val === "&?"
                || val === "@" || val === "@?") {
                scope[key] = val;
            } else if (typeof val !== "function") {
                scope[key] = "=?";
            }
        }
        (<any>this).scope = scope;
        this.link = this.link.bind(this);
        return this;
    }

    public link(scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) {
        if ("cssUrl" in this) {
            var cssUrl = this["cssUrl"];
            if (typeof cssUrl === "function") {
                cssUrl = cssUrl(element, attrs);
            }
            if (cssUrl) {
                loadCss(cssUrl);
            }
        }

        this.scope = scope;
        for (var key in this) {
            if (key[0] === "$") continue;
            var val = this[key];
            if (typeof val === "function") {
                scope[key] = val.bind(scope);
            } else if (val !== "=" && val !== "=?") {
                if (!(key in scope)) {
                    //Must be an optional param, or else it would have been set
                    scope[key] = val;
                }
            }
        }
        (<any>scope).element = element;
        (<any>scope).construct(element, attrs);
    }

    public safeApply() {
        if (!this.$root.$$phase) this.$apply();
    }

    public construct(element?: angular.IAugmentedJQuery, attrs?: angular.IAttributes) { }
}

export = Directive;