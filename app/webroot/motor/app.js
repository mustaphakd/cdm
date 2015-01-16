var appMd = angular.module('medApp', ['ui.bootstrap', 'appControllers','ngRoute','appServices', 'appDirectives', 'ngAnimate', 'jaydata', 'oz.d3Map', 'oz.d3ChartSizer']);

appMd.config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        //.when("/spots", { templateUrl: "views/hotspots.html"})
        .when("/information", { templateUrl: "views/information.html", controller:"infoController", reloadOnSearch: false })
        .when("/cases/add", { templateUrl: "views/add_case.html", controller: "addCaseController", reloadOnSearch: false })
        .when("/reportcase", { templateUrl: "views/reportcase.html", controller:"reportcaseController", reloadOnSearch: false })//
        .when("/medcenters/add", { templateUrl: "views/add_medcenters.html",controller: "addMedcenterController", reloadOnSearch: false })
        .when("/medcenters", { templateUrl: "views/medcenters.html", controller:"medcentersController", reloadOnSearch: false })
        .when("/regions/:country?/:province?", { templateUrl: "views/countriesProvinces.html", controller: "regionController", reloadOnSearch: false }) //, reloadOnSearch: false
        .when("/spots/:countryId?/:provinceId?", { templateUrl: "views/hotspots.html",controller: "hotspotsController", reloadOnSearch: false })
        .otherwise({ redirectTo: "spots" });

    //$locationProvider.html5Mode(true); , 'jaydata'
}]);

/*




, controller:"hotspotsController"


 , controller: "addCaseController"
 , controller:"reportcaseController"
 , controlller:"addMedcenterController"
 , controller:"medcentersController"
 , controller:"hotspotsController"
 */

function InsertBaseTag(){
    var bseTag = document.createElement('base');
    bseTag.href = document.baseURI;

    document.head.appendChild(bseTag);
}

$(function() {

    //InsertBaseTag();
    angular.bootstrap(document.body, ['medApp',  'appControllers','appServices', 'appDirectives', 'appFilters', 'ui.bootstrap']);

});