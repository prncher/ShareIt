﻿/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/angularjs/angular-route.d.ts" />
requirejs.config({
    baseUrl: "Scripts/appScripts",
    paths: {
        "jquery": "../jquery-2.2.0.min",
        "bootstrap": "../bootstrap",
        "app": "./shareApp",
        "angular": "../angular",
        "ngRoute": "../angular-route",
        "ngSanitize": "../angular-sanitize",
        "mainCtrls": "./mainControllers",
        "loginCtrl": "./loginController",
        "routerCfg": "./configRouter",
        "serviceFactory": "./serviceHandler",
        "ui.bootstrap": "../angular-ui/ui-bootstrap-tpls"
    },
    shim: {
        "ngRoute": ['angular'],
        "ngSanitize": ['angular'],
        "ui.bootstrap": ['angular'],
        "bootstrap": ['jquery']
    }
});

requirejs(["app", "bootstrap", "angular", "ngRoute", "ngSanitize", "ui.bootstrap"], (app) => {
    var shareApp = new app.shareApp();

    angular.element(document).ready(() => {
        angular.bootstrap(document, ['shareApp']);
    });
});