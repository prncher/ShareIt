"use strict";
import ng = angular;
interface IServiceHandler {
    assign(service: exportService): void;
    validateUser<T>(userName: string): ng.IHttpPromise<T>;
    registerUser<T>(user: T): ng.IHttpPromise<T>;
    addBuddy<T>(buddy: T): ng.IHttpPromise<T>;
    getBuddies<T>(studentId: number): ng.IHttpPromise<T>;
    getResources<T>(studentId: number): ng.IHttpPromise<T>;
    getFiles<T>(studentId: number): ng.IHttpPromise<T>;
    uploadResource<T>(resource: T): ng.IHttpPromise<T>;
    uploadFile<T>(id: string, file: any): ng.IHttpPromise<T>;
}

export class exportService {
    $http: any;
    constructor($http: ng.IHttpService) {
        this.$http = $http;
        return this;
    }
}

export class serviceHandler implements IServiceHandler {
    service: exportService;
    constructor() {
    }

    public assign(service: exportService): void {
        this.service = service;
    }

    public validateUser<T>(userName: string): ng.IHttpPromise<T> {
        return this.service.$http({
            method: 'GET',
            url: '/api/Students?userName=' + userName
        });
    };

    public registerUser<T>(user: T): ng.IHttpPromise<T> {
        return this.service.$http({
            method: 'POST',
            url: '/api/Students',
            data: user
        });
    };

    public addBuddy<T>(buddy: T): ng.IHttpPromise<T> {
        return this.service.$http({
            method: 'POST',
            url: '/api/Buddies',
            data: buddy
        });
    };

    public getBuddies<T>(studentId: number): ng.IHttpPromise<T> {
        return this.service.$http({
            method: 'GET',
            url: '/api/Buddies/' + studentId
        });
    };

    public getResources<T>(studentId: number): ng.IHttpPromise<T> {
        return this.service.$http({
            method: 'GET',
            url: '/api/Resource/' + studentId
        });
    };

    public getFiles<T>(studentId: number): ng.IHttpPromise<T> {
        return this.service.$http({
            method: 'GET',
            url: '/api/Files/' + studentId
        });
    };

    public uploadResource<T>(resource: T): ng.IHttpPromise<T> {
        return this.service.$http({
            method: 'POST',
            url: '/api/Resource',
            data: resource
        });
    };

    public uploadFile<T>(id: string, file: any): ng.IHttpPromise<T> {
        var fd = new FormData();
        fd.append(id + '<' + file.name, file);
        return this.service.$http({
            method: 'POST',
            url: '/api/Files',
            data: fd,
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };
}