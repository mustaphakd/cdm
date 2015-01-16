var appControllers = angular.module('appControllers', []);
/*
appControllers.controller('VideoListController', ['$scope', '$routeParams', '$location', 'medService', function ($scope, $routeParams, $location, videoService) {
    // debugger;
    $scope.medService = medService;
    $scope.$routeParams = $routeParams;

    $scope.NavigateTo = function (videoId) {
        //debugger;
        var pageId = $routeParams["pageId"];
        var vidId = videoId;
        var path = '/detail/' + vidId + '/page/' + pageId;
        $location.path(path);
    };

}]);*/

appControllers.controller('mainAppController',['$scope','$route', '$location','securityService', '$rootScope', '$modal', '$templateCache',
    function($scope, $route, $location, securityService, $rootScope, $modal, $templateCache){

        $scope.$route = $route;
        $scope.$root = $rootScope;
        $scope.$country = null;
        $scope.$province = null;

        /***** Notication structs****/
        $scope.NotificationMessage = "zbonjopr";
        $scope.NotificationClass = "";  /*********to be used on status-bar ng-class to auto hide on click event*********/

        $scope.hideNotification = function(){
            $scope.NotificationClass = "hideNotice";
        }
        $scope.AnimHideNotification = function(){
            $scope.notify = false;
        }

        $scope.showNotification = function(msg){
            $scope.NotificationClass = "";
            $scope.NotificationMessage = msg;
            $scope.notify = true;
            //$scope.AnimHideNotification();
        }
        $scope.notify = true;

        /***** intro modal structs****/
        $scope.modalTitle = "";
        $scope.hasModalTitle = true;
        $scope.modalContent = "";
        $scope.modalshowCloseButton = true;

        $scope.showModal = function(title, content, hasTitle, showCloseButton){
            //debugger;

            hasTitle = (typeof hasTitle === "undefined") ? true : hasTitle;
            if(hasTitle)
            {
                $scope.modalTitle = title;
                $scope.modalContent = content;
            }
            else{
                $scope.modalContent = content;
            }

            showCloseButton = (typeof showCloseButton === "undefined") ? true : showCloseButton;

            var $modalInstance = $modal.open({
                templateUrl: 'views/modalTpl.html',
                //controller: 'ModalInstanceCtrl',
                scope: $scope
               /* resolve: {
                    modalTitle: function () {
                        return $scope.modalTitle;
                    },
                    modalContent: function () {
                        return $scope.modalContent;
                    },
                    hasModalTitle: function () {
                        return $scope.hasModalTitle;
                    }
                }*/
            });

            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }

        $scope.showSaveModal = function(title, content, hasTitle, showCloseButton){
            //debugger;

            var scope = $scope.$new();
            scope.hasModalTitle = true;
            scope.modalTitle = "musmus";


            hasTitle = (typeof hasTitle === "undefined") ? true : hasTitle;
            if(hasTitle)
            {
                scope.modalTitle = title;
                scope.modalContent = content;
            }
            else{
                scope.modalContent = content;
            }

            showCloseButton = (typeof showCloseButton === "undefined") ? true : showCloseButton;

            var $modalInstance = $modal.open({
                templateUrl: 'views/modalSavedTpl.html',
                //controller: 'ModalInstanceCtrl',
                scope: scope
            });

            scope.ok = function () {
                $modalInstance.close();
            };

            scope.cancel = function () {
                $modalInstance.dismiss('cancel');
                scope.$destroy();
            };
        }

        /***** alert modal structs****/
        $scope.alert = function(msg){
           // debugger;
            $scope.showModal("", msg, false, false);
        }

        //debugger;
        $scope.$root.$on('$routeChangeStart', function(scope, next, current){
            //console.log('Changing from '+angular.toJson(current)+' to '+angular.toJson(next));
            if (typeof(current) !== 'undefined'){
                $templateCache.remove(current.templateUrl);
                $templateCache.remove(current.loadedTemplateUrl);
            }
            if(next && next.$$route)
                $scope.showNotification('loading ' + next.$$route.originalPath) ;
        });

        $scope.$root.$on('$routeChangeSuccess', function(scope, next, current){
            //console.log('Changing from '+angular.toJson(current)+' to '+angular.toJson(next));

            if(next && next.$$route)
            {
                $scope.showNotification( 'done loading ' + next.$$route.originalPath);
                $scope.AnimHideNotification();
            }

        });

        $scope.$root.$on('$routeChangeError', function(scope, next, current){
            $scope.showNotification( 'Changing from '+angular.toJson(current)+' to '+angular.toJson(next));
        });

        $scope.$root.$on('$routeUpdate', function(scope, next, current){
           // debugger;
            $scope.showNotification( 'Changing from '+angular.toJson(current)+' to '+angular.toJson(next));
        });
/*
        $scope.showModal("West Africa/Africa Center for Disease Monitoring", "This is a very simple demo app for " +
        "what is possible for a disease monitoring app for our region.  the actual app would be delivered as a web App " +
        "open to the public to see whats happening along with highly secured access control for allowed personnel.  we hope to also develop desktop app and mobile app" +
        " for real-time performance reasons and onsite auditing!", true, true);
*/

        $scope.showPopWindow = function(title, message, scrollbar){

            scrollbar = scrollbar || false;

            var ScreenWidth=window.screen.width;
            var ScreenHeight=window.screen.height;
            var movefromedge=0;
            placementx=(ScreenWidth/2)-((400)/2);
            placementy=(ScreenHeight/2)-((300+50)/2);
            WinPop=window.open("About:Blank","","width=400,height=300,toolbar=0,location=false,directories=false,status=0,scrollbars=" + scrollbar + ",menubar=0,resizable=0,left="+placementx+",top="+placementy+",scre enX="+placementx+",screenY="+placementy+",");
            var msg = "<strong>" + message + "</strong>";
            WinPop.document.write('<html>\n<head>\n<title>' + title + '</title>></head>\n<body>'+ msg +'</body></html>');

        }
} ]);

appControllers.controller('hotspotsController', ['$scope', '$routeParams', '$location', 'reportCaseService', '$q', function ($scope, $routeParams, $location, reportCaseService, $q ) {
     //debugger;
    $scope.caseService = reportCaseService
    $scope.$routeParams = $routeParams;
    $scope.heatLoader = null;

    $scope.heatLoaderUpdater = function(){
        if($scope.heatLoader == null)
            $scope.heatLoader = $q.defer();

        return $scope.heatLoader.promise;
    };

// map : ..., markers: ....
    $scope.loadHeaters = function(){

        $scope.caseService.loadCases().then(function (casesData) {

            var casesDataLength = casesData.length;
            var latLng = [];

            for (var i = 0; i < casesDataLength; i++) {
                /*$scope.cases.push(
                    {
                        id: casesData[i].id,
                        name: "testdf" + casesData[i].id,
                        date: casesData[i].initiallyReported,
                        caseType: casesData[i].diseaseTypeId,
                        caseStatus: casesData[i].caseStatusId,
                        synop: casesData[i].description,
                        clClass: null,
                        statusEdited: false,
                        originalCaseStatus: casesData[i].caseStatusId
                    }
                );
                latLng.push(
                    {
                        lat: casesData[i].locationLat,
                        long: casesData[i].locationLong
                    }
                );*/

                latLng.push(
                    L.latLng( casesData[i].locationLat, casesData[i].locationLong )
                );
            }
            casesData = null;

            if($scope.heatLoader != null)
            {
                var temp = [];
               // temp.push(latLng);
                $scope.heatLoader.resolve(latLng);
                //temp = null;
            }



        }, function (msg) {
            $scope.showNotification("Error loading cases ....");
        });
    };
}]);

appControllers.controller('medcentersController', ['$scope', '$routeParams', '$location', 'medService', '$q', function ($scope, $routeParams, $location, medService, $q) {
    debugger;
    $scope.medCentersService = medService;
    $scope.$routeParams = $routeParams;
    $scope.markersLoaderPromese = null;

    $scope.medIcon = L.Icon.extend({
        options: {
            iconSize:     [20, 32.8],
            iconAnchor:   [22, 24],
            popupAnchor:  [-3, -76]
        }
    });

    $scope.icons = [
        new $scope.medIcon({
            iconUrl: 'motor/images/tent.png'
        }),
        new $scope.medIcon({
            iconUrl: 'motor/images/csu-icon.png'
        }),
        new $scope.medIcon({
            iconUrl: 'motor/images/chr-icon.png'
        }),
        new $scope.medIcon({
            iconUrl: 'motor/images/chu-icon.png'
        })
    ];

    $scope.getCustomIcon = function(flg){

        switch(flg)
        {
            case 'csu':
                return $scope.icons[1];
                break;
            case 'chr':
                return $scope.icons[2];
                break;
            case 'chu':
                return $scope.icons[3];
                break;
            default:
                return  $scope.icons[0];
                break;
        }
    };


    $scope.markersLoaderNotifier = function(){
        if($scope.markersLoaderPromese == null)
            $scope.markersLoaderPromese = $q.defer();

        return $scope.markersLoaderPromese.promise;
    };

// map : ..., markers: ....
    $scope.loadMarkers = function(){

        $scope.medCentersService.getMedSites().then(function(data)
        {

            if(data != null)
            {
                var dataLenth = data.length;

                var temp = [];

                for(var i = 0; i < dataLenth; i++)
                {
                    var icon = $scope.getCustomIcon(data[i].centerType);
                    var marker = L.marker([data[i].locationLat, data[i].locationLong], {title: data[i].name, icon: icon })
                        //.addTo(mapWrapper.map)
                        .bindPopup("<h4>" + data[i].name + "</h4><h6>" + data[i].provinceName + "</h6>" +
                        "<h6>" + data[i].countryName + "</h6>"  +"" + data[i].detail );
                    temp.push(marker);
                }
                if($scope.markersLoaderPromese != null)
                    $scope.markersLoaderPromese.resolve(temp);
                temp = null;
            }

        }, function(msg){});
    };
}]);

appControllers.controller('addMedcenterController', ['$scope', '$routeParams', '$location', 'medService','regionService', '$q',  '$timeout',
    function ($scope, $routeParams, $location, medService, regionService, $q, $timeout) {
    debugger;
    $scope.addMedCenterService = medService;
    $scope.regionService = regionService;
    $scope.$routeParams = $routeParams;

        $scope.getMap = function (parentEntity) {

            var countriesPromese = $q.defer();

            var localCache = [];

            $scope.regionService.getCountries().then(
                function (data) {

                    data[0].getID = $scope.mapGetID;
                    localCache = data;

                    $scope.regionService.getAllProvinces().then(
                        function (data) {

                            data[0].getID = $scope.mapGetID;

                            var arrLength = data[0].objects.length;

                            for (var i = 0; i < arrLength; i++) {
                                localCache[0].objects.push(data[0].objects[i])
                            }
                            countriesPromese.resolve(localCache);

                            localCache = null;
                        }
                    );
                }
            );


            return countriesPromese.promise;
        }
        $scope.countriesClass = "countriesClass";
        $scope.caseTypes = [];

        $scope.latLongPromise = null;

        $scope.getMapUpdate = function () {
            if ($scope.countriesPromese == null)
                $scope.countriesPromese = $q.defer();

            return $scope.countriesPromese.promise;
        }

        $scope.mapGetID = function (node) {
            if ((node != null && node != undefined) && (node.properties != undefined)
                && (node.properties.id != undefined) && (node.properties.mapLevel != undefined)) {
                node.id = node.properties.id;
                return node.id;
            }
        }

// load them as markers with custom markers for each type of med center
    $scope.loadExistingMedCenters = function(){

        if($scope.markersLoader != null)
            $scope.markersLoader.notify(null);

    };

    $scope.processLatLong = function(latLong, node, ObjRecordMarkerLocation){
        if(!$scope.newMedCenterModel.formOpenned)
            return false;

        if($scope.newMedCenterModel.centerType == null)
        {
            $scope.quickIcon = $scope.icons[0];
        }
        else
        {
            $scope.quickIcon = $scope.getCustomIcon($scope.newMedCenterModel.centerType);
        }

        ObjRecordMarkerLocation.recordMarkerLocation = false;

        if ((node != null && node != undefined) && (node.properties != undefined)
            && (node.properties.mapLevel != undefined) && (node.properties.mapLevel != "country"))
        {
            ObjRecordMarkerLocation.recordMarkerLocation = true;

            $scope.newMedCenterModel.country = node.properties.country
            $scope.newMedCenterModel.province = node.properties.label;

            $scope.newMedCenterModel.countryId = node.properties.countryId
            $scope.newMedCenterModel.provinceId = node.properties.id;
        }

        return false;

    };

    $scope.getLeafletLatLongCoord = function(lat, long){

        $scope.newMedCenterModel.latitude = lat;
        $scope.newMedCenterModel.longitude = long;
    };

    $scope.setLeafletLatLongCoord = function(){

            if($scope.latLongPromise == null)
                $scope.latLongPromise = $q.defer();
            return $scope.latLongPromise.promise;
        };


        /*******************************************Icons*****************************************/
    $scope.markerIconUpdaterPromesse = null;
    $scope.getMarkerIconUpdater = function(){

        if($scope.markerIconUpdaterPromesse == null)
            $scope.markerIconUpdaterPromesse = $q.defer();


        return $scope.markerIconUpdaterPromesse.promise;
    };

    $scope.medIcon = L.Icon.extend({
        options: {
            iconSize:     [20, 32.8],
            iconAnchor:   [22, 24],
            popupAnchor:  [-3, -76]
        }
    });

    $scope.icons = [
            new $scope.medIcon({
                iconUrl: 'motor/images/tent.png'
            }),
            new $scope.medIcon({
                iconUrl: 'motor/images/csu-icon.png'
            }),
            new $scope.medIcon({
                iconUrl: 'motor/images/chr-icon.png'
            }),
            new $scope.medIcon({
                iconUrl: 'motor/images/chu-icon.png'
            })
        ];

    $scope.quickIcon = $scope.icons[0];

        /*********************************************************************/
        $scope.markersLoader = null;

    $scope.getMarkerIcon = function(){

        return $scope.quickIcon;
    };

    $scope.getCustomIcon = function(flg){

        switch(flg)
        {
            case 'csu':
                return $scope.icons[1];
                break;
            case 'chr':
                return $scope.icons[2];
                break;
            case 'chu':
                return $scope.icons[3];
                break;
            default:
                return  $scope.icons[0];
                break;
        }
    };

    $scope.medCenterTypeChanged = function(){
        $scope.quickIcon = $scope.getCustomIcon($scope.newMedCenterModel.centerType);

        if($scope.markerIconUpdaterPromesse != null)
        {
            $scope.markerIconUpdaterPromesse.notify($scope.quickIcon);
        }
    };

    $scope.markersLoaderUpdater = function(){
        if($scope.markersLoader == null)
            $scope.markersLoader = $q.defer();

        $scope.timeoutToken = $timeout(function(){
            $timeout.cancel($scope.timeoutToken);
            $scope.timeoutToken = null;

            $scope.markersLoader.notify(null);
        },3);

        return $scope.markersLoader.promise;
    };

// map : ..., markers: ....
    $scope.loadMarkers = function(mapWrapper){

        if(mapWrapper == null || mapWrapper == undefined)
            return;

        var markersLength = mapWrapper.markers.length;

        for(i=0;i<markersLength;i++) {
            var mrker = mapWrapper.markers.shift();
            mapWrapper.map.removeLayer(mrker);
            mrker = null;
        }

        $scope.addMedCenterService.getMedSites().then(function(data)
        {

            if(data != null)
            {
                var dataLenth = data.length;

                for(var i = 0; i < dataLenth; i++)
                {
                    var icon = $scope.getCustomIcon(data[i].centerType);
                    var marker = L.marker([data[i].locationLat, data[i].locationLong], {title: data[i].name, icon: icon })
                        .addTo(mapWrapper.map)
                        .bindPopup("<h4>" + data[i].name + "</h4><h6>" + data[i].provinceName + "</h6>" +
                        "<h6>" + data[i].countryName + "</h6>"  +"" + data[i].detail );
                    mapWrapper.markers.push(marker);
                }
            }

        }, function(msg){});
    };


/********************* New Med center Model*****************************/

        $scope.newMedCenterModel =  {
            name: null,
            capacity: null,
            centerType: null,
            country: null,
            province: null,
            countryId: null,
            provinceId: null,
            latitude: null,
            longitude: null,
            detail: null
        }

        $scope.newMedCenterModel.formOpenned = false;

        $scope.newMedCenterModel.processing = false;
        $scope.newMedCenterModel.buttonsDivClass = "divBtn";
        $scope.medCenterOptions = [
            {name: "Centre d'acceuillle",
             id: 'cne'},
            {name: "Centre de Sante Urbaine",
                id: 'csu'},
            {name: "Centre Hospitalier Regional",
                id: 'chr'},
            {name: "Centre de Hospitalier Universitaire",
                id: 'chu'},

        ];


        $scope.validation = {
            errClass : "has-error has-feedback",
            name : { errorClass : "", showError : false}, // from selection dropdown
            centerType : { errorClass : "", showError : false},
            country : { errorClass : "", showError : false},
            province : { errorClass : "", showError : false},
            detail : { errorClass : "", showError : false},
            capacity : { errorClass : "", showError : false},
            longitude : { errorClass : "", showError : false},
            latitude : { errorClass : "", showError : false},
            isValid : false
        };

        $scope.saveNewMedCenter = function(){

            $scope.newMedCenterModel.processing = true;

            $scope.clearValidationErrors();
            $scope.validateModel();
            if($scope.validation.isValid)
            {
                var object = {

                    name:$scope.newMedCenterModel.name ,
                    locationLat: $scope.newMedCenterModel.latitude,
                    locationLong: $scope.newMedCenterModel.longitude,
                    detail: $scope.newMedCenterModel.detail,
                    countryId: $scope.newMedCenterModel.countryId,
                    provinceId: $scope.newMedCenterModel.provinceId,
                    capacity: $scope.newMedCenterModel.capacity,
                    centerType: $scope.newMedCenterModel.centerType
                };
                $scope.addMedCenterService.addNewCenter(object).then(function(){

                    $scope.newMedCenterModel.processing = false;

                    $scope.newMedCenterModel.resetModel();

                    if($scope.markersLoader != null)
                        $scope.markersLoader.notify(null);

                }, function(erroMsg){ alert(errMsg);$scope.newMedCenterModel.processing = false;} );
            }
            else
            {
                $scope.newMedCenterModel.processing = false;
            }
        };

        $scope.cancelNewMedCenter = function(){
            $scope.newMedCenterModel.resetModel();
            $scope.clearValidationErrors();
            $scope.newMedCenterModel.formOpenned = false;
        };

        $scope.newMedCenterModel.resetModel = function(){

            $scope.newMedCenterModel.name = null;
            $scope.newMedCenterModel.capacity = null;
            $scope.newMedCenterModel.centerType = null;
            $scope.newMedCenterModel.country = null;
            $scope.newMedCenterModel.latitude = null;
            $scope.newMedCenterModel.longitude = null;
            $scope.newMedCenterModel.province = null;
            $scope.newMedCenterModel.detail = null;
        };

        $scope.validateModel = function(){
            $scope.validation.isValid = true;

            if($scope.newMedCenterModel.name == null)
            {
                $scope.invalidateElement($scope.validation.name)
                $scope.validation.isValid = false;
            }
            if($scope.newMedCenterModel.capacity  == null || ($scope.newMedCenterModel.capacity < 1))
            {
                $scope.invalidateElement($scope.validation.capacity)
                $scope.validation.isValid = false;
            }
            if($scope.newMedCenterModel.centerType == null)
            {
                $scope.invalidateElement($scope.validation.centerType)
                $scope.validation.isValid = false;
            }
            if($scope.newMedCenterModel.country == null)
            {
                $scope.invalidateElement($scope.validation.country)
                $scope.validation.isValid = false;
            }
            if($scope.newMedCenterModel.latitude == null)
            {
                $scope.invalidateElement($scope.validation.latitude)
                $scope.validation.isValid = false;
            }
            if($scope.newMedCenterModel.longitude == null)
            {
                $scope.invalidateElement($scope.validation.longitude)
                $scope.validation.isValid = false;
            }
            if($scope.newMedCenterModel.province == null)
            {
                $scope.invalidateElement($scope.validation.province)
                $scope.validation.isValid = false;
            }
            if($scope.newMedCenterModel.detail == null)
            {
                $scope.invalidateElement($scope.validation.detail)
                $scope.validation.isValid = false;
            }
        };

        $scope.invalidateElement = function(valEleRef)
        {
            valEleRef.errorClass = $scope.validation.errClass;
            valEleRef.showError = true;
        }

        $scope.clearValidationErrors = function(){
            $scope.validation.name.errorClass = "";
            $scope.validation.name.showError = false;

            $scope.validation.capacity.errorClass = "";
            $scope.validation.capacity.showError = false;

            $scope.validation.centerType.errorClass = "";
            $scope.validation.centerType.showError = false;

            $scope.validation.longitude.errorClass =  "";
            $scope.validation.longitude.showError = false;

            $scope.validation.latitude.errorClass = "";
            $scope.validation.latitude.showError = false;

            $scope.validation.province.errorClass =  "";
            $scope.validation.province.showError = false;

            $scope.validation.country.errorClass =  "";
            $scope.validation.country.showError = false;

            $scope.validation.detail.errorClass = "";
            $scope.validation.detail.showError = false;
        };

        $scope.loadExistingMedCenters();


    }]);

appControllers.controller('addCaseController', ['$scope', '$routeParams', '$location', 'reportCaseService','regionService', '$q', '$timeout', '$window', '$interval',
    function ($scope, $routeParams, $location, reportCaseService, regionService, $q, $timeout, $window, $interval) {

        $scope.caseService = reportCaseService;
        $scope.regionService = regionService;
        $scope.$routeParams = $routeParams;
        $scope.filterModel = null;
        $scope.processing = false;
        $scope.currentMasterSelection = null;
        $scope.caseViewUrl = "views/cases/pending.html";

        $scope.caseTypes = [];
        $scope.selectedItemCaseTypes = [];
        $scope.cases = [];
        $scope.markers = [];
        $scope.notes = [];

        $scope.selectedItemCaseStatusConfigured = true;
        $scope.selectedItemCaseStatusLabel = "";
        //$scope.selectedItemCaseStatusId = null;
        /***************** Master List********************************/
        $scope.showSaveCancelAppendNoteBtn = false;
        $scope.modInitialized = false;
        $scope.noteEditing = false;
        $scope.selectedItemId = null;

        $scope.filterSelected = function(val){
            $scope.filterModel = val;
        };

        $scope.masterItemSelected = function(item){
            $scope.processing = true;

            $scope.selectedItemId = item.id;

            var arrLength = $scope.cases.length;

            //iterate cases and configure matching item and its markers as well as its caseStatus
            for(var i = 0; i < arrLength; i++)
            {
                $scope.cases[i].clClass = null;

                if($scope.cases[i] == item)
                {
                    $scope.cases[i].clClass = "masterListAnchor";
                    $scope.currentMasterSelection = $scope.cases[i];

                    var markersLength = $scope.markers.length;

                    //iterate markers and set flag for selected item flag
                    for(var u = 0; u < markersLength; u++)
                    {
                        $scope.markers[u].isSelected = false;

                        if($scope.markers[u].id == item.id)
                        {
                            $scope.markers[u].isSelected = true;
                        }
                    }

                    $scope.configureCaseStatus(item);


                }
            }
            if($scope.markersLoader != null)
                $scope.markersLoader.notify(null);

            $scope.notes = [];
            $scope.loadNotes(item.id);
            $scope.processing = false;
        };

        $scope.loadNotes = function(caseId){

            $scope.processing = true;
            // pass in the dcaseId
            $scope.caseService.loadNotes(caseId).then(function(arrNotesData){
                var arrNotesDataLength = arrNotesData.length;

                for(var i = 0; i < arrNotesDataLength; i++)
                {
                    $scope.notes.push({id: arrNotesData[i].id, date: arrNotesData[i].quand, note: arrNotesData[i].detail , status: "unchanged"});
                }
                $scope.processing = false;
            }, function(msg){
                $scope.showNotification("Error loading notes for " + item.id + " " + msg);
                $scope.processing = false;
            });
        };

        $scope.appendNote = function(){

            if($scope.noteEditing)
            return;

            $scope.noteEditing = true;

            if($scope.currentMasterSelection != null)
            {
                $scope.notes.push(
                    {
                        id: "##",
                        date: new Date(),
                        note: " ",
                        status: "added"
                    }
                );
                $scope.showSaveCancelAppendNoteBtn = true;
            }
        };

        $scope.cancelAppendNote = function(){
            $scope.notes.pop();
            $scope.showSaveCancelAppendNoteBtn = false
            $scope.noteEditing = false;
        };

        $scope.saveAppendNote = function(){
            $scope.processing = true;
            var item = $scope.notes.pop();

            $scope.caseService.saveNote({quand: new Date(), detail: item.note, dcaseId: $scope.selectedItemId }).then(function(data){
                $scope.notes = [];

                var timeoutToken = $timeout(function(){
                    $timeout.cancel(timeoutToken);
                    timeoutToken = null;
                    $scope.loadNotes($scope.selectedItemId);
                    $scope.processing = false;
                }, 106);
            }, function(msg){
                $scope.showNotification("Error saving note for " + $scope.selectedItemId + " " + msg);
                $scope.processing = false;
            });


            item.status = "unchanged";
            $scope.notes.push(item);
            // send to DB and reload
            $scope.showSaveCancelAppendNoteBtn = false
            $scope.noteEditing = false;

            $scope.processing = false;
        };

        $scope.initMod = function(){
            //if(!$scope.modInitialized) {

            $scope.caseTypes = [];
            $scope.selectedItemCaseTypes = [];
            $scope.cases = [];
            $scope.markers = [];
            //$scope.notes = [];

                $scope.processing = true;
                $scope.caseService.loadCaseStatus().then(function (caseTypesData) {

                    var caseTypesDataLength = caseTypesData.length;

                    $scope.caseTypes.push({id: null, name: "All"});
                    $scope.selectedItemCaseTypes.push({id: null, name: "Not Defined!"});

                    for (var i = 0; i < caseTypesDataLength; i++) {
                        $scope.caseTypes.push({id: caseTypesData[i].id, name: caseTypesData[i].label});
                        $scope.selectedItemCaseTypes.push({id: caseTypesData[i].id, name: caseTypesData[i].label});
                    }
                    caseTypesData = null;

                    $scope.caseService.loadCases().then(function (casesData) {
                        /*
                         initiallyDetected:{type: Date},
                         dateConfirmed:{type: Date},

                         */

                        var casesDataLength = casesData.length;

                        for (var i = 0; i < casesDataLength; i++) {
                            $scope.cases.push(
                                {
                                    id: casesData[i].id,
                                    name: "testdf" + casesData[i].id,
                                    date: casesData[i].initiallyReported,
                                    caseType: casesData[i].diseaseTypeId,
                                    caseStatus: casesData[i].caseStatusId,
                                    synop: casesData[i].description,
                                    clClass: null,
                                    statusEdited: false,
                                    originalCaseStatus: casesData[i].caseStatusId
                                }
                            );
                            $scope.markers.push(
                                {
                                    id: casesData[i].id,
                                    lat: casesData[i].locationLat,
                                    long: casesData[i].locationLong,
                                    isSelected: false
                                }
                            );
                        }
                        casesData = null;
                        $scope.markersLoader.notify(null);
                        $scope.processing = false;

                    }, function (msg) {
                        $scope.showNotification("Error loading cases ....");
                    });

                }, function (msg) {
                    $scope.showNotification("Error loading case status ....");
                })

                $scope.modInitialized = true;
            /* }
            else
            {

                $scope.timeoutToken = $timeout(function(){
                    $timeout.cancel($scope.timeoutToken);
                    $scope.timeoutToken = null;
                    $scope.markersLoader.notify(null);
                },3);

            }*/
        };

        $scope.configureCaseStatus = function(item){
            $scope.selectedItemCaseStatusConfigured = null;
            if(item.caseStatus == undefined || item.caseStatus == null)
            {
                item.caseStatus = null;
                $scope.selectedItemCaseStatusConfigured = false;
            }

            // determine item casestatusid label
            var caseStatusLength = $scope.selectedItemCaseTypes.length;
            for(var i = 0; i < caseStatusLength; i++)
            {
                var statusVal = $scope.selectedItemCaseTypes[i];

                if(statusVal.id == item.caseStatus)
                {
                    $scope.selectedItemCaseStatusLabel = statusVal.name;
                }
            }
            // item.statusEdited set from $scope.setSelectedItemCaseStatus  //set from above on entry   // checking status label
            if( (item.statusEdited == false) && ($scope.selectedItemCaseStatusConfigured == null) && (angular.lowercase($scope.selectedItemCaseStatusLabel) !== angular.lowercase("Pending")))
            {
                $scope.selectedItemCaseStatusConfigured = true;
            }
            else
            {
                $scope.selectedItemCaseStatusConfigured = false;
            }
        };

        $scope.setSelectedItemCaseStatus = function(caseTypeId){
            var caseItem = $scope.findCase($scope.selectedItemId);
            if(caseItem != null)
            {
                caseItem.caseStatus = caseTypeId;
                caseItem.statusEdited = true;
                $scope.configureCaseStatus(caseItem);
            }
        };

        $scope.findCase = function(caseId){
            var casesLength = $scope.cases.length;
            var foundCase = null;
            for(var i = 0; i < casesLength; i++)
            {
                if($scope.cases[i].id == caseId)
                {
                    foundCase = $scope.cases[i];
                    break;
                }
            }
            return foundCase;
        };

        $scope.cancelSelectedItemCaseStatus = function(){
            var caseItem = $scope.findCase($scope.selectedItemId);
            if(caseItem != null)
            {
                caseItem.caseStatus = caseItem.originalCaseStatus;
                caseItem.statusEdited = false;
                $scope.configureCaseStatus(caseItem);
            }
        };

        $scope.saveSelectedItemCaseStatus = function(){

            var caseItem = $scope.findCase($scope.selectedItemId);

            if(caseItem == null || (caseItem.statusEdited == false))
                return

            $scope.modInitialized = false;
            $scope.processing = true;



            $scope.caseService.updateCaseStatus({caseId: $scope.selectedItemId  , caseStatusId: caseItem.caseStatus  }).then(function(){
                    $scope.caseTypes = [];
                    $scope.selectedItemCaseTypes = [];
                    $scope.cases = [];
                    $scope.markers = [];
                    $scope.notes = [];
                    $scope.initMod();
                },
                function(msg){ $scope.showNotification("Error updating cases status ...."); });
        };

        /********************* map leaflet  **/

        $scope.latLongPromise = null;
        $scope.markersLoader = null;
        $scope.selectedCaseIconEx = L.Icon.extend({
            options: {
                iconSize:     [25, 41],
                iconAnchor: [12, 41],
                popupAnchor:  [-3, -76]
            }
        });

        $scope.selectedCaseIcon = new $scope.selectedCaseIconEx({ iconUrl: 'motor/images/marker-icon-greenish.png' });

        $scope.getMap = function(parentEntity){
            var deferred = $q.defer();

            var timeoutToken = $timeout(function(){
                $timeout.cancel(timeoutToken);
                timeoutToken = null;

                deferred.resolve({type:'path', objects:[]});

            },5);


            return deferred.promise;
        };

        $scope.markersLoaderUpdater = function(){
            if($scope.markersLoader == null)
                $scope.markersLoader = $q.defer();

            $scope.timeoutToken = $timeout(function(){
                $timeout.cancel($scope.timeoutToken);
                $scope.timeoutToken = null;

                //$scope.markersLoader.notify(null);
            },3);

            return $scope.markersLoader.promise;
        };

// map : ..., markers: ....
        $scope.loadMarkers = function(mapWrapper){

            if(mapWrapper == null || mapWrapper == undefined)
                return;

            var markersLength = mapWrapper.markers.length;

            for( var i = 0; i < markersLength ; i++) {
                var mrker = mapWrapper.markers.shift();
                mapWrapper.map.removeLayer(mrker);
                mrker = null;
            }


            if($scope.markers != null)
            {
                var dataLength = $scope.markers.length;
                var lastMarker = null;

                for(var i = 0; i < dataLength; i++)
                {
                    var marker = null;

                    if($scope.markers[i].isSelected)
                    {
                        var name = "";
                        var casesLength = $scope.cases.length

                        for(var ii = 0; ii < casesLength; ii++)
                        {
                            if( $scope.cases[ii].id == $scope.markers[i].id )
                            {
                                name = $scope.cases[ii].name;
                                break;
                            }
                        }

                        marker = lastMarker = L.marker([$scope.markers[i].lat, $scope.markers[i].long], {title: name, icon: $scope.selectedCaseIcon });

                    }
                    else {
                        marker = L.marker([$scope.markers[i].lat, $scope.markers[i].long])
                            .addTo(mapWrapper.map);
                    }
                    mapWrapper.markers.push(marker);
                }

                if(lastMarker != null)
                    lastMarker.addTo(mapWrapper.map);
            }

        };

        /*****************************Add mod **/

        $scope.getLeafletLatLongCoord = function(lat, long){

            //$scope.reportViewModel.model.latitude = lat;
            //$scope.reportViewModel.model.longitude = long;
        };

        $scope.setLeafletLatLongCoord = function(){

            if($scope.latLongPromise == null)
                $scope.latLongPromise = $q.defer();
            return $scope.latLongPromise.promise;
        };

        $scope.getGeneratedDefaultCaseStatus = function(){
            //return pending case status id
            var caseStatusLength = $scope.selectedItemCaseTypes.length;
            for(var i = 0; i < caseStatusLength; i++)
            {
                var statusVal = $scope.selectedItemCaseTypes[i];

                if(angular.lowercase(statusVal.name) == angular.lowercase('validated'))
                {
                    return statusVal.id;
                }
            }
            return null;
        };

        $scope.getNextViewUrl = function(){
            $scope.viewModel = 'pending';
            //$scope.caseViewUrl = 'views/cases/pending.html' ;
            return 'views/cases/pending.html';
        };

        /**************************Charts*********************************/

        $scope.casesXfilter = null;
        $scope.allGroup = null;
        $scope.chartsInit = false;
        $scope.diseaseTypes = null;

        $scope.diseaseBarDimension = $scope.caseStatusBarDimension = null;
        $scope.diseaseBarGroup = null;

        $scope.dateMonthFormat = d3.time.format("%b");
        $scope.dateYearFormat = d3.time.format("%Y");
        /*
         $scope.cases.push(
         {
         id: casesData[i].id,
         name: "testdf" + casesData[i].id,
         date: casesData[i].initiallyReported,
         caseType: casesData[i].diseaseTypeId,
         caseStatus: casesData[i].caseStatusId,
         synop: casesData[i].description,
         clClass: null,
         statusEdited: false,
         originalCaseStatus: casesData[i].caseStatusId
         }
         );
        */
        $scope.getDiseaseName = function(diseaseTypeId){
            var length = $scope.diseaseTypes.length;

            for(var i = 0; i < length; i++){
                if($scope.diseaseTypes[i].id == diseaseTypeId)
                {
                    return $scope.diseaseTypes[i].name;
                }
            }
            return "unknown";
        };
        $scope.getCaseStatusName = function(statusId){
            var length = $scope.caseTypes.length;

            if(statusId == null || !angular.isDefined(statusId))
            return 'Pending'

            for(var i = 0; i < length; i++){

                if($scope.caseTypes[i].id == statusId)
                {
                    return $scope.caseTypes[i].name;
                }
            }
            return "Pending";
        };

        $scope.configureChartDimenstion = function(){

            var casesLength = $scope.cases.length;

            for(var i = 0; i < casesLength; i++){
                $scope.cases[i].diseaseName = $scope.getDiseaseName($scope.cases[i].caseType);
                $scope.cases[i].caseStatusName = $scope.getCaseStatusName($scope.cases[i].caseStatus);
                //$scope.cases[i].dDate =  ...;
                $scope.cases[i].year =  $scope.dateYearFormat($scope.cases[i].date);
                $scope.cases[i].month = $scope.dateMonthFormat($scope.cases[i].date);
            }

            $scope.clearXDimensions();
            $scope.casesXfilter = crossfilter($scope.cases);
            $scope.allGroup = $scope.casesXfilter.groupAll();

            $scope.diseaseBarDimension =  $scope.casesXfilter.dimension(function (d) {
                return d.diseaseName;
            });
            $scope.diseaseBarGroup = $scope.diseaseBarDimension.group().reduceCount();

            $scope.caseStatusBarDimension = $scope.casesXfilter.dimension(function (d) {
                return d.caseStatusName;
            });
            $scope.caseStatusBarGroup = $scope.caseStatusBarDimension.group().reduceCount();



            if($scope.diseaseGraphNotifierPromise != null)
                $scope.diseaseGraphNotifierPromise.resolve({dim: $scope.diseaseBarDimension  , grp: $scope.diseaseBarGroup, all: $scope.allGroup  });

            if($scope.caseStatusGraphNotifierPromise != null)
                $scope.caseStatusGraphNotifierPromise.resolve({dim: $scope.caseStatusBarDimension  , grp: $scope.caseStatusBarGroup, all: $scope.allGroup  });



            $scope.infectionCountLineDimension = $scope.casesXfilter.dimension(function (d) {
                return d.date;
            });
/*
            var infectionLineGroups = [];
            var counter = 0;

            var tempLength = $scope.diseaseTypes.length;

            for(var i = 0; i < tempLength; i++){
                if((angular.isDefined($scope.diseaseTypes[i].id)) && ($scope.diseaseTypes[i].id != null) )
                {
                    var _name = $scope.diseaseTypes[i].name;
                    var grup = $scope.infectionCountLineDimension.group().reduceSum(function(d){ if(d.diseaseName == _name){return 1;} return 0;});
                    infectionLineGroups.push(grup);
                }
            }*/

            $scope.infGroup = $scope.infectionCountLineDimension.group().reduceCount();

            if($scope.infectionCountGraphNotifierPromise != null)
                $scope.infectionCountGraphNotifierPromise.resolve({dim: $scope.infectionCountLineDimension  , grp: $scope.infGroup , all: $scope.allGroup, year: 2014 });


        };


        $scope.loadChartDimensions = function(){
            //debugger;

            if(($scope.cases != null) && (angular.isArray($scope.cases)) && ($scope.cases.length > 0))
            {
                if(!$scope.chartInit)
                {

                    $scope.caseService.getCaseTypes().then(function(data){
                        $scope.diseaseTypes = data;

                        $scope.chartInit = true;
                        $scope.configureChartDimenstion();
                    });

                }
                else
                {
                    $scope.configureChartDimenstion();
                }
            }
        };

        $scope.clearXDimensions = function(){
            $scope.casesXfilter = null;
            $scope.allGroup = null;
            $scope.diseaseBarDimension = null;
        };

        $scope.diseaseGraphNotifierPromise = null;
        $scope.diseaseGraphNotifier = function(){
            if($scope.diseaseGraphNotifierPromise == null)
                $scope.diseaseGraphNotifierPromise = $q.defer();

            return $scope.diseaseGraphNotifierPromise.promise;

        };

        $scope.caseStatusGraphNotifierPromise = null;
        $scope.caseStatusGraphNotifier = function(){
            if($scope.caseStatusGraphNotifierPromise == null)
                $scope.caseStatusGraphNotifierPromise = $q.defer();

            return $scope.caseStatusGraphNotifierPromise.promise;

        };


        $scope.infectionCountGraphNotifierPromise = null;
        $scope.infectionCountGraphNotifier = function(){
            if($scope.infectionCountGraphNotifierPromise == null)
                $scope.infectionCountGraphNotifierPromise = $q.defer();

            return $scope.infectionCountGraphNotifierPromise.promise;

        };


        /**************************End Charts*********************************/


}]);

appControllers.controller('reportcaseController', ['$scope', '$routeParams', '$location', 'reportCaseService','regionService', '$q', '$timeout', '$window', '$interval',
    function ($scope, $routeParams, $location, reportCaseService, regionService, $q, $timeout, $window, $interval) {
        debugger;
        $scope.reportCaseService = reportCaseService;
        $scope.regionService = regionService;
        $scope.$routeParams = $routeParams;

        $scope.viewUrl = "views/caseReport/default.html";
        $scope.thankUmessage = $scope.saveMessage = "Mercie for entering such critical information!  Our teams of scientist and technicians will cater to the case as soon as possible";
        $scope.cancelMessage = "Still want to provide us this essential information? please, click the button below.";

        //$scope.countries = null;
        $scope.countriesTimeoutCancelToken = null;
        $scope.countriesUpdateTimeoutCancelToken = null;
        $scope.countriesPromese = null;
        $scope.getMap = function (parentEntity) {

            var countriesPromese = $q.defer();

            var localCache = [];

            $scope.regionService.getCountries().then(
                function (data) {

                    data[0].getID = $scope.mapGetID;
                    localCache = data;

                    $scope.regionService.getAllProvinces().then(
                        function (data) {

                            data[0].getID = $scope.mapGetID;

                            var arrLength = data[0].objects.length;

                            for (var i = 0; i < arrLength; i++) {
                                localCache[0].objects.push(data[0].objects[i])
                            }
                            countriesPromese.resolve(localCache);

                            localCache = null;
                        }
                    );
                }
            );


            return countriesPromese.promise;
        }
        $scope.countriesClass = "countriesClass";
        $scope.caseTypes = [];

        $scope.latLongPromise = null;

        $scope.getMapUpdate = function () {
            if ($scope.countriesPromese == null)
                $scope.countriesPromese = $q.defer();

            return $scope.countriesPromese.promise;
        }

        $scope.mapGetID = function (node) {
            if ((node != null && node != undefined) && (node.properties != undefined)
                && (node.properties.id != undefined) && (node.properties.mapLevel != undefined)) {
                node.id = node.properties.id;
                return node.id;
            }
        }

        $scope.processLatLong = function(latLong, node, ObjRecordMarkerLocation){

            ObjRecordMarkerLocation.recordMarkerLocation = false;

            if ((node != null && node != undefined) && (node.properties != undefined)
                && (node.properties.mapLevel != undefined) && (node.properties.mapLevel != "country"))
            {
                $scope.reportViewModel.model.country = node.properties.countryId;
                $scope.reportViewModel.model.province = node.properties.id;
                ObjRecordMarkerLocation.recordMarkerLocation = true;
            }

            return false;

        };

        $scope.getLeafletLatLongCoord = function(lat, long){

            $scope.reportViewModel.model.latitude = lat;
            $scope.reportViewModel.model.longitude = long;
        };

        $scope.setLeafletLatLongCoord = function(){

            if($scope.latLongPromise == null)
                $scope.latLongPromise = $q.defer();
            return $scope.latLongPromise.promise;
        };

        $scope.btnGetCurrentGeoLocation = function()
        {
            if($scope.latLongPromise != null)
            {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position){
                        var latlong = [] ;
                        latlong[0] = $scope.reportViewModel.model.latitude = position.coords.latitude;
                        latlong[1] = $scope.reportViewModel.model.longitude = position.coords.longitude;

                        $scope.latLongPromise.notify(latlong);

                        latlong = null;
                    });
                }
            }
        }


        $scope.loadCaseTypes = function () {
            $scope.reportCaseService.getCaseTypes().then(function(data){
                $scope.caseTypes = data;
            });

        };

        $scope.gotoFormEntryView = function(){
            $scope.reportViewModel.resetModel();
            $scope.viewUrl = "views/caseReport/default.html";
        }

        /****************************** model*/

        $scope.reportViewModel = {};

        $scope.reportViewModel.thankYouViewMessage = "";
        $scope.reportViewModel.model = {
            infection: null,
            initiallyReported: null,
            initiallyDetected: null,
            country: null,
            province: null,
            latitude: null,
            longitude: null,
            synop: null
        }
        $scope.reportViewModel.buttonsDivClass = "divBtn";


        $scope.validation = {
            errClass : "has-error has-feedback",
            suspectedCase : { errorClass : "", showError : false}, // from selection dropdown
            dateDetected : { errorClass : "", showError : false},
            synop : { errorClass : "", showError : false},
            longitude : { errorClass : "", showError : false},
            latitude : { errorClass : "", showError : false},
            isValid : false
        };

/*************** todo: validate page change with viewUrl. keep testing later */
        $scope.reportViewModel.saveReport = function(){

            $scope.clearValidationErrors();
            $scope.validateModel();
            if($scope.validation.isValid)
            {
                var today = new Date();
                var object = {
                    diseaseTypeId: $scope.reportViewModel.model.infection,
                    locationLat: $scope.reportViewModel.model.latitude,
                    locationLong:$scope.reportViewModel.model.longitude,
                    initiallyReported : today ,//get that from today date time
                    initiallyDetected : $scope.reportViewModel.model.initiallyDetected, //get that from control
                    countryId: $scope.reportViewModel.model.country,
                    provinceId:$scope.reportViewModel.model.province, //get both countryId and provinceid from the process lonlat coordinate above
                    description: $scope.reportViewModel.model.synop
                };

                if(angular.isDefined($scope.getGeneratedDefaultCaseStatus))
                {
                    object.caseStatusId = $scope.getGeneratedDefaultCaseStatus();
                }

                $scope.reportCaseService.reportSuspiciousCase(object).then(function(rsp){
                    $scope.thankUmessage = $scope.saveMessage;

                    if(angular.isDefined($scope.getNextViewUrl))
                    {
                        $scope.viewUrl = $scope.getNextViewUrl();
                    }
                    else
                        $scope.viewUrl = "views/caseReport/thankyou.html";
                } );
            }
        };

        $scope.reportViewModel.cancelReport = function(){

            $scope.thankUmessage = $scope.cancelMessage;

            $scope.reportViewModel.resetModel();
            $scope.viewUrl = "views/caseReport/thankyou.html";


        };

        $scope.reportViewModel.resetModel = function(){
            $scope.reportViewModel.model.infection = null;
            $scope.reportViewModel.model.initiallyDetected = null;
            $scope.reportViewModel.model.country = null;
            $scope.reportViewModel.model.province = null;
            $scope.reportViewModel.model.latitude = null;
            $scope.reportViewModel.model.longitude = null;
            $scope.reportViewModel.model.synop = null;
        };

        $scope.reportViewModel.resetValidation = function(){
            $scope.validation.suspectedCase.errorClass = "";

        };

        $scope.validateModel = function(){
            $scope.validation.isValid = true;

            if($scope.reportViewModel.model.latitude == null)
            {
                $scope.invalidateElement($scope.validation.latitude)
                $scope.validation.isValid = false;
            }
            if($scope.reportViewModel.model.longitude == null)
            {
                $scope.invalidateElement($scope.validation.longitude)
                $scope.validation.isValid = false;
            }
            if($scope.reportViewModel.model.infection == null)
            {
                $scope.invalidateElement($scope.validation.suspectedCase)
                $scope.validation.isValid = false;
            }
            if($scope.reportViewModel.model.synop == null)
            {
                $scope.invalidateElement($scope.validation.synop)
                $scope.validation.isValid = false;
            }
            if($scope.reportViewModel.model.initiallyDetected == null)
            {
                $scope.invalidateElement($scope.validation.dateDetected)
                $scope.validation.isValid = false;
            }
        };

        $scope.invalidateElement = function(valEleRef)
        {
            valEleRef.errorClass = $scope.validation.errClass;
            valEleRef.showError = true;
        }

        $scope.clearValidationErrors = function(){
            $scope.validation.suspectedCase.errorClass = "";
            $scope.validation.suspectedCase.showError = false;

            $scope.validation.dateDetected.errorClass = "";
            $scope.validation.dateDetected.showError = false;

            $scope.validation.synop.errorClass = "";
            $scope.validation.synop.showError = false;

            $scope.validation.longitude.errorClass =  "";
            $scope.validation.longitude.showError = false;

            $scope.validation.latitude.errorClass = "";
            $scope.validation.latitude.showError = false;
        };

        /************** date control*/

        $scope.minDate = new Date();
        $scope.maxDate = new Date();
        $scope.dateControlOpened = false;

        /*$scope.openDateControl = function($event) {

            $scope.dateControlOpened = true;
            $scope.opened = true;

            $event.preventDefault();
            $event.stopPropagation();


        };*/

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.dateFormats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.dateFormat = $scope.dateFormats[0];

        $scope.configureMinMaxDate = function(){

            $scope.maxDate.setDate($scope.maxDate.getDate() + 2);

            $scope.minDate.setDate($scope.minDate.getDate() - 30);

        };

        $scope.configureMinMaxDate();

        $scope.loadCaseTypes();

    }]);

appControllers.controller('regionController', ['$scope', '$routeParams', '$location', 'regionService', '$q', '$timeout', '$window', '$interval',
    function ($scope, $routeParams, $location, regionService , $q, $timeout, $window, $interval) {
    // debugger;
    $scope.regionService = regionService;
    $scope.$routeParams = $routeParams;

    $scope.viewModel = "list";
    $scope.viewUrl = "views/region/list.html";

    $scope.addViewModel ={};
    $scope.addViewModel.isDisabled = false;
    $scope.addViewModel.openned = false;
    $scope.addViewModel.addTitle = " ";
    $scope.addViewModel.titlePlacement = "left";
    $scope.addViewModel.buttonsDivClass = "divBtn";



    $scope.addViewModel.mapLevel = "country"; // can be country, province, department or city
    $scope.addViewModel.panelTitle = "New Country";
    $scope.addViewModel.placeholder = "Enter Country Name";
    $scope.addViewModel.popoverString ='Add new country';

    /************************New Coontry********/
    $scope.addViewModel.newModel = {
        coordinates: "",
        name: "",
        isValid: false,
        processing: false
    };
    $scope.validation= {};
    $scope.validation.countryName = {
        errorClass: "",
        showError: false
    };

    /************************************************/

    $scope.addViewModel.addNewCountry = function(){
        $scope.addViewModel.newModel = {
            coordinates: "",
            name: "",
            isValid: false,
            processing: false
        };
        $scope.addViewModel.openned = true;
        $scope.addViewModel.isDisabled = true;

    }
    $scope.addViewModel.collapseAddNewCountry = function(){
        //alert();
        $scope.addViewModel.openned = false;
        $scope.addViewModel.isDisabled = false;

    }

    /********************** zto be deleted */
    $scope.addViewModel.showAddNewContry = function(){
        if($scope.addViewModel.openned == false)
        {
            $scope.addViewModel.addTitle = "Add New Country";
        }
        else
        {
            $scope.addViewModel.addTitle = " ";
        }
    }

    $scope.addViewModel.hideAddNewContry = function(){
            $scope.addViewModel.addTitle = " ";
    }

    $scope.addViewModel.updateFormControls = function(){

        switch($scope.addViewModel.mapLevel)
        {
            case 'province':
                $scope.addViewModel.panelTitle = "New Province";
                $scope.addViewModel.placeholder = "Enter Province Name";
                $scope.addViewModel.popoverString ='Add new province';
                break;

            default :
                $scope.addViewModel.panelTitle = "New Country";
                $scope.addViewModel.placeholder = "Enter Country Name";
                $scope.addViewModel.popoverString ='Add new country';
                break;
        }
    }

    /*///////////////////////////////////////////***********************************/

        $scope.addViewModel.newCountryTempArr = [];

    $scope.addViewModel.setProcessing = function(enabled)
    {
        if(enabled)
        {
            $scope.addViewModel.newModel.processing = true;
            $scope.addViewModel.buttonsDivClass = "divBtnDisabled";
        }
        else{
            $scope.addViewModel.newModel.processing = false;
            $scope.addViewModel.buttonsDivClass = "divBtn";
        }
    }

    $scope.addViewModel.cancelcountry = function(){
        if($scope.addViewModel.newModel.processing)
            return;

        $scope.addViewModel.newModel.coordinates = "";
        $scope.addViewModel.newModel.name = "";

        $scope.clearNewCountryValidationErrors();
        $scope.addViewModel.collapseAddNewCountry();
        $scope.addViewModel.setProcessing(false);
    }

    $scope.addViewModel.savecountry = function(){
        if($scope.addViewModel.newModel.processing)
            return;
        $scope.clearNewCountryValidationErrors();
        $scope.validateNewCountryModel();

        if($scope.addViewModel.newModel.isValid == true)
        {
            $scope.addViewModel.setProcessing(true)
            //submit form lol!
            //disable all buttons

            var coordinates = null;
            if( $scope.addViewModel.newModel.coordinates.length > 0){
                //debugger;
                var parsed = JSON.parse($scope.addViewModel.newModel.coordinates);
                var striinged = JSON.stringify($scope.addViewModel.newModel.coordinates);
                coordinates = JSON.stringify(parsed);

            }

            switch($scope.addViewModel.mapLevel)
            {
                case 'province':
                    if($scope.addViewModel.selectedCountryId != null)
                    {
                        $scope.addViewModel.saveProvince({name: $scope.addViewModel.newModel.name, coord: coordinates || ""});
                    }
                break;

                default :
                    $scope.regionService.addNewCountry({name: $scope.addViewModel.newModel.name, coord: coordinates || ""}).then(
                        function(succeed){

                            $scope.addViewModel.setProcessing(false);
                            $scope.addViewModel.collapseAddNewCountry();

                            if( $scope.countries != null) {
                                //debugger;
                                var obj = succeed;
                                $scope.countries[0].objects.push(obj);

                                $scope.addViewModel.newCountryTempArr = [];
                                $scope.addViewModel.newCountryTempArr.push(obj);

                                //var cntryType = { type: "path", objects : $scope.addViewModel.newCountryTempArr};

                                $scope.updateMap(obj);
                                obj = null;
                            }
                            else
                            {
                                $scope.updateMap(null);
                            }

                        },
                        function(failMsg){
                            $scope.addViewModel.setProcessing(false);
                            $scope.addViewModel.collapseAddNewCountry();
                        }
                    );
                break;
            }

        }
    }

    $scope.validateNewCountryModel = function(){

        $scope.addViewModel.newModel.isValid = true;

        if( $scope.addViewModel.newModel.name.length < 1)
        {
            $scope.addViewModel.newModel.isValid = false;
            $scope.validation.countryName.errorClass = "has-error has-feedback";
            $scope.validation.countryName.showError = true;
        }
        else
        {
            $scope.addViewModel.newModel.isValid = true;
        }
    }

    $scope.clearNewCountryValidationErrors = function(){
        $scope.addViewModel.newModel.isValid = false;
        $scope.validation.countryName = {errorClass:"", showError:false};
    }

/************ province logic*************************************************************/
    $scope.addViewModel.selectedCountryId = null;

    $scope.addViewModel.prevSelectedCountryId = null;

    $scope.addViewModel.saveProvince = function(provinceData)
    {
        $scope.regionService.addNewProvince($scope.addViewModel.selectedCountryId, provinceData).then(
            function(succeed){

                $scope.addViewModel.setProcessing(false);
                $scope.addViewModel.collapseAddNewCountry();

                    var model = {
                        requiredAction :"viualAppend",
                        actualData: {
                            type:        'path',
                            objects:     []
                        }
                    };
                model.actualData.objects.push(succeed);


                    $scope.updateMap(model);


            },
            function(failMsg){
                $scope.addViewModel.setProcessing(false);
                $scope.addViewModel.collapseAddNewCountry();
            }
        );
    }
/*********************Map logic************************************************************************/
    $scope.countries = null;
    $scope.countriesTimeoutCancelToken = null;
    $scope.countriesUpdateTimeoutCancelToken = null;
    $scope.countriesPromese = null;
    $scope.getMap = function(parentEntity){

        var countriesPromese = $q.defer();

        if(parentEntity == undefined || parentEntity == null)
        {
            $scope.addViewModel.mapLevel = "country";
            $scope.addViewModel.selectedCountryId = null;
            $scope.addViewModel.updateFormControls();


        }
        else
        {
            if( (parentEntity.area != undefined  && parentEntity.area != null) &&
                (parentEntity.area.properties != undefined  && parentEntity.area.properties != null) &&
                (parentEntity.area.properties.mapLevel != undefined  && parentEntity.area.properties.mapLevel != null))
            {
                switch(parentEntity.area.properties.mapLevel  )
                {
                    case "country":
                        $scope.addViewModel.mapLevel = "province";
                    break;
                    case "province":
                        $scope.addViewModel.mapLevel = "department";
                    break;
                    case "department" :
                        $scope.addViewModel.mapLevel = "city";
                    break
                    default:
                        $scope.addViewModel.mapLevel = "country";
                        break;
                }

            }
        }

        switch($scope.addViewModel.mapLevel)
        {
            case 'province':
                $scope.addViewModel.selectedCountryId = parentEntity.area.properties.id;
                $scope.addViewModel.updateFormControls();
                $scope.regionService.getProvinces($scope.addViewModel.selectedCountryId).then(
                    function (data) {

                        data[0].getID = $scope.mapGetID;
                        countriesPromese.resolve(data);
                    }
                );
            break;

            case 'country' :
                $scope.addViewModel.updateFormControls();
                if($scope.countries == null) {
                    $scope.regionService.getCountries().then(
                        function (data) {

                            $scope.countries = data;
                            countriesPromese.resolve(data);
                        }
                    );
                }
                else {
                    if($scope.countriesTimeoutCancelToken != null)
                        $timeout.cancel($scope.countriesTimeoutCancelToken);

                    $scope.countriesTimeoutCancelToken= null;

                    $scope.countriesTimeoutCancelToken = $timeout(function(){
                        countriesPromese.resolve($scope.countries);
                        $timeout.cancel($scope.countriesTimeoutCancelToken);
                        $scope.countriesTimeoutCancelToken= null;
                    }, 5);
                }
            break;

            default:
                if($scope.countriesTimeoutCancelToken != null)
                    $timeout.cancel($scope.countriesTimeoutCancelToken);

                $scope.countriesTimeoutCancelToken= null;

                $scope.countriesTimeoutCancelToken = $timeout(function(){

                    var model = {
                        type: "path",
                        objects: [],
                        getID: $scope.mapGetID};

                    //model.objects.push(parentEntity.area)

                    countriesPromese.resolve(model);
                    $timeout.cancel($scope.countriesTimeoutCancelToken);
                    $scope.countriesTimeoutCancelToken= null;
                }, 5);
            break;
        }
        return countriesPromese.promise;
    }
    $scope.countriesClass = "countriesClass";

    $scope.getMapUpdate = function(){
        if($scope.countriesPromese == null)
            $scope.countriesPromese = $q.defer();

        return $scope.countriesPromese.promise;
    }

    $scope.updateMap = function(newModel){

        if($scope.countriesPromese == null)
            return;

        var nwModel = newModel;

        if($scope.countriesUpdateTimeoutCancelToken != null)
            $timeout.cancel($scope.countriesUpdateTimeoutCancelToken);

        $scope.countriesPromese.notify(nwModel);
    }

    $scope.mapGetID = function(node){
        if((node != null && node != undefined) && (node.properties != undefined)
            && (node.properties.id != undefined) && (node.properties.mapLevel != undefined))
        {
            node.id = node.properties.id;
            return node.id;
        }
    }

    $scope.processLatLong = function(coord, node){
        var test = coord;
        var test2 = node;

        return true;
    }


        /****************************************************** Import Export Logic *******************/
        $scope.importExport = {};
        $scope.importExport.operationBeingProcessed = false;
        $scope.importExport.title = "";
        $scope.importExport.buttonTitle = "";
        $scope.importExport.data = null;
        $scope.importExport.dataPlaceHolder = "";
        $scope.importExport.canceled = false;
        $scope.importExport.opIE = "none";
        $scope.importExport.cancelButtonTitle = "Close";
        $scope.importExport.importTimeoutCancelToken = null;

        $scope.importExport.importEnabled = true; // true or false
        $scope.importExport.exportEnabled = true; // true or false

        $scope.importExport.cancelOperation = function(){

            $scope.importExport.canceled = true;

            if($scope.importExport.operationBeingProcessed == false) {
                $('.import-export-form-collapse').collapse('hide');

                $scope.importExport.enableImportExport(true);
                $scope.importExport.opIE = "none";
                $scope.importExport.cancelButtonTitle = "Close";
            }
            else {
                $scope.importExport.cancelButtonTitle = "Close";
                $scope.importExport.enableImportExport(false);
                $scope.importExport.operationBeingProcessed = false;

                switch($scope.importExport.opIE)
                {
                    case "imp":
                        $scope.importExport.title = "Import Countries & Provinces";
                        $scope.importExport.dataPlaceHolder = "Please paste the data to be imported!";
                        break;
                    case "exp" :
                        $scope.importExport.title = "Export Countries & Provinces";
                        $scope.importExport.dataPlaceHolder = "click the Export button to start processing the data base for export";
                        break;
                    default:
                        break;
                }

            }
        }

        $scope.importExport.completeOperation = function(){
            if( $scope.importExport.opIE == null)
            {
                return
            }
            $scope.importExport.canceled = false;
            switch( $scope.importExport.opIE)
            {
                case "imp":
                    $scope.importExport.cancelButtonTitle = "Cancel";
                    $scope.importExport.dataPlaceHolder = "Please wait while your pasted data is being imported!";
                    $scope.importExport.title = "Importing Countries & Provinces";

                    $scope.importExport.operationBeingProcessed = true;

                    var tempData = $scope.importExport.data;
                    $scope.importExport.data = "";

                    $timeout(function(){
                        $scope.regionService.importCountries(tempData).then(
                            function(successData){
                                $scope.importExport.cancelOperation();
                                tempData = "";
                                tempData = null;
                                $scope.importExport.$intervalCounter = 3;
                                $scope.importExport.importTimeoutCancelToken = $interval(function() {

                                    //if($scope.importExport.$intervalCounter == 0)
                                    //{
                                        $scope.countries = null;
                                        $scope.updateMap(null);
                                    //}
                                   // else
                                   // {
                                        //$scope.updateMap($scope.countries);
                                   // }


                                    $scope.importExport.$intervalCounter -- ;

                                    if($scope.importExport.$intervalCounter <= 0)
                                    {
                                        $timeout.cancel($scope.importExport.importTimeoutCancelToken);
                                        $scope.importExport.importTimeoutCancelToken = null;
                                    }
                                }, 2, 3);
                            },
                            function(errMsg){
                                tempData = "";
                                tempData = null;
                            }
                        );
                    }, 20);



                    $scope.importExport.operationBeingProcessed = true;
                    break;
                case "exp":
                    $scope.importExport.cancelButtonTitle = "Cancel";
                    $scope.importExport.title = "Exporting Countries & Provinces";
                    $scope.importExport.dataPlaceHolder = "Please wait while the database is being exported";

                    $scope.importExport.operationBeingProcessed = true;

                    $scope.regionService.exportCountries().then(
                        function(successData){
                            $scope.showPopWindow("Exported Data", JSON.stringify(successData));
                            $scope.importExport.cancelOperation();
                        },
                        function(errMsg){}
                    );

                    $scope.importExport.operationBeingProcessed = true;
                    break;
                default:
                    break;
            }
        }

        $scope.importExport.onImportClicked = function(){
            $scope.importExport.enableImportExport(false);

            $scope.importExport.title = "Import Countries & Provinces";
            $scope.importExport.buttonTitle = "Import";
            $scope.importExport.dataPlaceHolder = "Please paste the data to be imported!";

            $scope.importExport.opIE = "imp";
        }

        $scope.importExport.onExportClicked = function(){
            $scope.importExport.enableImportExport(false);

            $scope.importExport.title = "Export Countries & Provinces";
            $scope.importExport.buttonTitle = "Export";
            $scope.importExport.dataPlaceHolder = "click the Export button to start processing the data base for export";

            $scope.importExport.opIE = "exp";
        }

        $scope.importExport.enableImportExport = function(enabledState){
            $scope.importExport.importEnabled = enabledState; // true or false
            $scope.importExport.exportEnabled = enabledState;
        }

    }]);

appControllers.controller('infoController', ['$scope', '$routeParams', '$location', 'infomationService','regionService', function ($scope, $routeParams, $location, infomationService, regionService) {

    $scope.showNotification('loading the Information Hotlines module ... ' ) ;
    $scope.infomationService = infomationService;
    $scope.$routeParams = $routeParams;
    $scope.regionService = regionService;

    $scope.infos = [
        {
            countryName: "encore Moi",
            provinces:[
                {
                    provinceName: "group1",
                    contactInfos: [
                        { contact: "###", synop:" blahahhha", clClass: null}
                    ]
                },
                {
                    provinceName: "group2",
                    contactInfos: [
                        { contact: "###", synop:" blahahhha", clClass: null}
                    ]
                }
            ]
        },
        {
            countryName: "encore Moi",
            provinces:[
                {
                    provinceName: "group1",
                    contactInfos: [
                        { contact: "###", synop:" blahahhha", clClass: null},
                        { contact: "###", synop:" blahahhha", clClass: null},
                        { contact: "###", synop:" blahahhha", clClass: null}
                    ]
                }
            ]
        }
    ];


    $scope.view = "Listing ...";
    $scope.viewModel = "list";
    $scope.viewUrl = "views/information/list.html";
    $scope.newModel = {
        provinceTitle : "Province",
        countryTitle: "Country",
        province: "",
        country: "",
        isValid:  false,
        description: "",
        contactInfo: "",
        currentCountryId: null,
        currentProvinceId: null
    };
    $scope.countries =[];

    $scope.provinces = [];

    $scope.newModelWatcher = {
        province : "",
        country: ""
    };
    $scope.newModel.titleWatchers = null;

    $scope.validation = {};
    $scope.validation.description = {
        errorClass: "",
        showError: false
    };
    $scope.validation.contactInfo = {
        errorClass: "",
        showError: false
    };
    $scope.validation.country = {
        errorClass: "",
        showError: false
    };
    $scope.validation.province = {
        errorClass: "",
        showError: false
    };

    $scope.$watch("viewModel", function(newVal, oldVal){
        if(newVal != oldVal)
        {
            switch(newVal)
            {
                case "list":
                        $scope.view = "Listing ...";
                        $scope.viewUrl = "views/information/list.html";
                    break;
                case "add":

                    $scope.view = "Add new information."
                    $scope.viewUrl = "views/information/add.html";

                    break;
                case "map": $scope.view = "Map View";
                    $scope.viewUrl = "views/information/map.html";
                    break;
                default: break;
            }
        }
    });

    $scope.Save = function(){
        $scope.AnimHideNotification();

        $scope.clearValidationErrors();
        $scope.validateNewModel();

        if($scope.newModel.isValid == true)
        {
            var nwModel = {
                description: $scope.newModel.description,
                contact: $scope.newModel.contactInfo,
                countryId: $scope.newModel.currentCountryId,
                provinceId:$scope.newModel.currentProvinceId
            }

            $scope.infomationService.InsertInfos(nwModel).then(function(){
                $scope.showSaveModal("", 'Information Save. ', false, true);
                $scope.cancel();
            }, function(msg){
                $scope.showNotification(' Error Saving the Information . ' ) ;
            });
            nwModel = null;
        }
    }

    $scope.cancel = function(){
        $scope.newModel.description = "";
        $scope.newModel.contactInfo = "";
        $scope.newModel.country = "";
        $scope.newModel.province = "";
        $scope.newModel.provinceTitle = "Province";
        $scope.newModel.countryTitle = "Country";
        $scope.clearValidationErrors();
    }

    $scope.validateNewModel = function(){

        $scope.newModel.isValid = true;

        if( $scope.newModel.description.length < 1)
        {
            $scope.newModel.isValid = false;
            $scope.validation.description.errorClass = "has-error has-feedback";
            $scope.validation.description.showError = true;
        }
        if( $scope.newModel.contactInfo.length < 1)
        {
            $scope.newModel.isValid = false;
            $scope.validation.contactInfo.errorClass = "has-error has-feedback";
            $scope.validation.contactInfo.showError = true;
        }
        if( $scope.newModel.country == null || $scope.newModel.country.length < 1)
        {
            $scope.newModel.isValid = false;
            $scope.validation.country.errorClass = "has-error has-feedback";
            $scope.validation.country.showError = true;
        }
        if( $scope.newModel.province == null || $scope.newModel.province.length < 1)
        {
            $scope.newModel.isValid = false;
            $scope.validation.province.errorClass = "has-error has-feedback";
            $scope.validation.province.showError = true;
        }
    }

    $scope.clearValidationErrors = function(){
        $scope.newModel.isValid = false;
        $scope.validation.description.errorClass = "";
        $scope.validation.description.showError = false;

        $scope.validation.contactInfo = {errorClass:"", showError:""};
        $scope.validation.country = {errorClass:"", showError:""};
        $scope.validation.province = {errorClass:"", showError:""};
    }


    $scope.showNotification( 'done loading Information Hotlines module');
    //$scope.AnimHideNotification();

    $scope.loadProvinces= function(){
        $scope.showNotification( "loading Information Hotlines module's provinces");
        $scope.regionService.getAllProvinces().then(function(arrData){

            var provinces = arrData[0].objects;
            var provincesLength = provinces.length;

            for(var i = 0; i < provincesLength ; i++)
            {
                $scope.provinces.push({id: provinces[i].properties.id  , name: provinces[i].properties.label, countryId: provinces[i].properties.countryId});
            }
            provinces = null;
            arrData = null;
            $scope.AnimHideNotification();

        });

    };
    $scope.loadCountries = function() {

        $scope.showNotification("loading Information Hotlines module's countries");
        $scope.regionService.getCountries().then(function (arrData) {

            var contries = arrData[0].objects;
            var contriesLength = contries.length;

            for (var i = 0; i < contriesLength; i++) {
                $scope.countries.push({id: contries[i].properties.id, name: contries[i].properties.label});
            }
            contries = null;
            arrData = null;
            $scope.AnimHideNotification();

        });
    };

    $scope.prevContactInfoSeletedItem = null;
    $scope.contactInfoSelected = function(item)
    {
        if($scope.prevContactInfoSeletedItem != null)
            $scope.prevContactInfoSeletedItem.clClass = null;

        $scope.prevContactInfoSeletedItem = item;
        $scope.prevContactInfoSeletedItem.clClass = "active";

    };

    $scope.LoadInfos = function(){
        //$scope.infos = [];

        $scope.infomationService.fetchInfos().then(function(data){
            $scope.infos = data;
        },function(msg){
            $scope.showNotification( 'Error loading Information Hotlines ...' + msg);
        });
    };

    $scope.loadCountries();
    $scope.loadProvinces();
    $scope.LoadInfos();

}
]);

