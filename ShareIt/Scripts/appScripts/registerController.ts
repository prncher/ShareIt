"use strict";
import ng = angular;
import serviceModule = require("serviceHandler");
import loginCtrlModule = require("loginController");

export class registerController {
    location: ng.ILocationService;
    user: any;
    serviceFactory: serviceModule.serviceHandler;
    parent: any;

    constructor($scope: ng.IScope, $location: ng.ILocationService, services: serviceModule.serviceHandler) {
        this.serviceFactory = services;
        this.location = $location;
        this.parent = $scope.$parent;

        this.user = {};
    }

    public register(): void {
        var self = this;
        this.serviceFactory.registerUser(this.user).then(function (response) {
            if (response.status === 201) {
                self.parent.ctrl.message = "";
                self.location.path("/");
            }
        }).catch(function (response) {
            self.parent.ctrl.message = response.data.Message + ";" + response.data.ExceptionMessage;
        });
        self.user = {};
    };
}