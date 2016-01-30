"use strict";
import ng = angular;
import serviceModule = require("serviceHandler");

export class loginController {
    location: ng.ILocationService;
    loggedIn: boolean;
    message: string;
    user: any;
    serviceFactory: serviceModule.serviceHandler;
    loggedInUser: any;

    constructor($location: ng.ILocationService, services: any, serviceClass: serviceModule.serviceHandler) {
        this.serviceFactory = serviceClass;
        this.serviceFactory.assign(services);
        this.location = $location;
        this.loggedIn = false;
        this.message = "";

        this.user = {};
    }

    public login(): void {
        var self = this;
        this.serviceFactory.validateUser(this.user.userName).then(function (response) {
            if (response.status === 200) {
                self.loggedIn = true;
                self.message = "";
                self.loggedInUser = response.data;
            }
        }).catch(function (response) {
            self.loggedIn = false;
            self.message = response.data.Message + ";" + response.data.ExceptionMessage;
        });
        self.user = {};
    };

    public validate(): void {
        if (!this.loggedIn) {
            this.message = "Login before adding buddies or share."
            this.location.path("/");
        }
    };
}