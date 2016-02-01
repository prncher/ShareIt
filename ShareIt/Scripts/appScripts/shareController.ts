"use strict";
import ng = angular;
import serviceModule = require("serviceHandler");
const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export class shareController {
    location: ng.ILocationService;
    serviceFactory: serviceModule.serviceHandler;
    parent: any;
    file: any;
    public contents: any;
    public files: any;
    public buddies: any;
    public buddyContents: any;
    public buddyFiles: any;
    public buddiesClipsCollapsed: boolean;

    constructor($scope: ng.IScope, $location: ng.ILocationService, services: serviceModule.serviceHandler) {
        this.parent = $scope.$parent;
        this.contents = [];
        this.files = [];
        this.buddies = [];
        this.buddyContents = [];
        this.buddyFiles = [];
        this.serviceFactory = services;
        this.location = $location;
        this.parent.ctrl.validate();
        this.file = "";
        this.buddiesClipsCollapsed = true;
        if (this.parent.ctrl.loggedIn) {
            this.getBuddies();
            this.getContents();
            this.getFiles();
        };
    }

    public upload(): void {
        var self = this;
        this.serviceFactory.uploadFile(self.parent.ctrl.loggedInUser.Id, this.file).then(function (response) {
            if (response.status === 201) {
                self.files.push(response.data);
                self.parent.ctrl.message = "File uploaded";
            }
        }).catch(this.showErrorMessage);
    };

    public editload(ngModel: ng.INgModelController): void {
        var self = this;
        var resource = { "StudentId": self.parent.ctrl.loggedInUser.Id, "resource1": self.convertToByteArray(ngModel.$viewValue) };
        ngModel.$viewValue = '';
        ngModel.$render();
        this.serviceFactory.uploadResource(resource).then(function (response) {
            if (response.status === 201) {
                var decoded = self.convertFromByteArray(response.data.resource1.toString());
                self.contents.push(decoded);
            }
        }).catch(this.showErrorMessage);
    }

    private getBuddies(): void {
        var self = this;
        this.serviceFactory.getBuddies(this.parent.ctrl.loggedInUser.Id).then(function (response) {
            if (response.status === 200) {
                var buddies = response.data;
                angular.forEach(buddies, (buddy: any, key: number) => {
                    self.buddies.push(buddy);
                    var buddyContent = {
                        "buddy": buddy,
                        "contents": []
                    };

                    self.getBuddyContent(buddyContent);

                    var buddyFile = {
                        "buddy": buddy,
                        "files": []
                    };

                    self.getBuddyFiles(buddyFile);
                });
            }
        }).catch(this.showErrorMessage);
    };

    private getBuddyContent(buddyContent: any): void {
        var self = this;
        this.serviceFactory.getResources(buddyContent.buddy.Id).then(function (response) {
            if (response.status === 200) {
                var resources = response.data;
                for (var x in resources) {
                    var decoded = self.convertFromByteArray(resources[x].resource1);
                    buddyContent.contents.push(decoded);
                }

                self.buddyContents.push(buddyContent);
            }
        }).catch(this.showErrorMessage);
    };

    private getBuddyFiles(buddyFile: any): void {
        var self = this;
        this.serviceFactory.getFiles(buddyFile.buddy.Id).then(function (response) {
            if (response.status === 200) {
                var files = response.data;
                angular.forEach(files, (fd: any, key: number) => {
                    buddyFile.files.push(fd);
                });

                self.buddyFiles.push(buddyFile);
            }
        }).catch(this.showErrorMessage);
    };

    private getContents(): void {
        var self = this;
        this.serviceFactory.getResources(this.parent.ctrl.loggedInUser.Id).then(function (response) {
            if (response.status === 200) {
                var resources = response.data;
                for (var x in resources) {
                    var decoded = self.convertFromByteArray(resources[x].resource1);
                    self.contents.push(decoded);
                }
            }
        }).catch(this.showErrorMessage);
    }

    private getFiles(): void {
        var self = this;
        this.serviceFactory.getFiles(this.parent.ctrl.loggedInUser.Id).then(function (response) {
            if (response.status === 200) {
                var files = response.data;
                angular.forEach(files, (fd: any, key: number) => {
                    self.files.push(fd)
                });
            }
        }).catch(this.showErrorMessage);
    };

    private convertToByteArray(input: string): Array<number> {
        var result: Array<number> = [];
        for (var i = 0; i < input.length; ++i) {
            result[i] = input.charCodeAt(i);
        }
        return result;
    };

    private convertFromByteArray(input: string): string {
        var output: string = "";
        var index: Array<number> = [];

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (var i = 0; i < input.length; i++) {
            index[0] = allChars.indexOf(input.charAt(i++));
            index[1] = allChars.indexOf(input.charAt(i++));
            index[2] = allChars.indexOf(input.charAt(i++));
            index[3] = allChars.indexOf(input.charAt(i));

            output += String.fromCharCode((index[0] << 2) | (index[1] >> 4));

            if (index[2] != 64) {
                output += String.fromCharCode(((index[1] & 15) << 4) | (index[2] >> 2));
            }
            if (index[3] != 64) {
                output += String.fromCharCode(((index[2] & 3) << 6) | index[3]);
            }
        }

        return output;
    };

    private showErrorMessage(response: any): void {
        var self = this;
        if (response.status !== 404) {
            self.parent.ctrl.message = response.data.Message + ";" + response.data.ExceptionMessage;
        }
    };
}