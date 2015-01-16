/*///<reference path="C:\S\Javascript_DS_LIBS\jaydata.d.ts" />*/

var appservices = angular.module('appServices',[]);

appservices.service('repositoryService', [ "$data", "$q", function($data, $q){

    var x=$data.Entity.extend("country",
        {
            id: {type: "int", key:true, computed: true},
            name: {type: "string", required: true},
            geometry:{type: "string"},
            provinces:{type: Array, elementType:"province", inverseProperty:"country"}
        });

    $data.Entity.extend("province",
        {
            id: {type: "int", key:true, computed: true},
            name: {type: "string", required: true},
            geometry:{type: "string"},
            country:{ type: "country", required: true, inverseProperty: "provinces"},
            countryId:{type: "int", required: true}
        });

    $data.Entity.extend("disease",
        {
            id: {type: "int", key:true, computed: true},
            name: {type: "string", required: true},
            description:{type: "string"}
        });

    $data.Entity.extend("hotline",
        {
            id: {type: "int", key:true, computed: true},
            description: {type: "string", required: true},
            province:{type: "province"},
            country:{type: "country"},
            contact: {type: "string", required: true},
            countryId:{type: "int", required: true},
            provinceId:{type: "int", required: true}
        });

    $data.Entity.extend("note",
        {
            id: {type: "int", key:true, computed: true},
            detail: {type: String, required: true},
            quand:{type: Date},
            dcase:{type:"dcase", required: true, inverseProperty:"notes"},
            dcaseId:{type: "int", required: true}
        });

    $data.Entity.extend("medsite",
        {
            id: {type: "int", key:true, computed: true},
            name: {type: "string", required: true},
            province:{ type: "province", required: true},
            //location:{type:"gpslocation"},
            locationLat:{type: "string", required: true},
            locationLong:{type: "string", required: true},
            detail: {type: String, required: true},
            country:{ type: "country", required: true},
            countryId:{type: "int", required: true},
            provinceId:{type: "int", required: true},
            capacity: {type: "int"},
            centerType: {type: String, required: true}
        });

    $data.Entity.extend("gpslocation",
        {
            id: {type: "int", key:true, computed: true},
            lat:{type: String, required : true},
            long: {type: String, required: true}
        }
    );

    $data.Entity.extend("dcase",
        {
            id: {type: "int", key:true, computed: true},
            description: {type: "string", required: true},
            diseaseType:{type: "disease", required: true},
            diseaseTypeId:{type: "int", required: true},
            province:{ type: "province", required: true},
            //location:{type:"gpslocation"},
            locationLat:{type: "string", required: true},
            locationLong:{type: "string", required: true},
            initiallyReported:{type: Date},
            initiallyDetected:{type: Date},
            dateConfirmed:{type: Date},
            notes:{type: Array, elementType: "note", inverseProperty:"dcase"},
            country: {type: "country", required: true},
            countryId:{type: "int", required: true},
            provinceId:{type: "int", required: true},
            caseStatusId:{type: "int", required: true}
        }
    );

    $data.Entity.extend("caseStatus",
        {
            id: {type: "int", key:true, computed: true},
            label:{type: String, required : true}
        }
    );

    /**************************************************************************************************/


    $data.EntityContext.extend("CDMDatabase",
        {
            Countries: {type: $data.EntitySet, elementType: country},
            Provinces: {type: $data.EntitySet, elementType: province},
            Diseases: {type: $data.EntitySet, elementType: disease},
            Hotlines: {type: $data.EntitySet, elementType: hotline},
            Notes: {type: $data.EntitySet, elementType: note},
            MedSites: {type: $data.EntitySet, elementType: medsite},
            Locations: {type: $data.EntitySet, elementType: gpslocation},
            Cases: {type: $data.EntitySet, elementType: dcase},
            CaseStatus: {type: $data.EntitySet, elementType: caseStatus}
        });

    this.Db = new CDMDatabase({ provider: 'indexedDb', databaseName:'DiseaseMonitoringDb', version: 1.35 });


    /* debug version

     this.Db = new CDMDatabase({ provider: 'indexedDb', databaseName:'DiseaseMonitoringDb', dbCreation: $data.storageProviders.DbCreationType.DropTableIfChanged, version: 1 });

     DropTableIfChanged: The IndexedDB database is dropped if it exists but JayData detects any change (added, removed or modified) in the key properties of the data model. This behavior is different for WebSQL - WebSQL DB is dropped if JayData detects any change in the data model.
     DropAllExistingTables: This option is primarily useful for testing, it recreates the datastore from scratch each time the program is run.
     */

    /*this.Db .onReady(function() {
        DB1.People.add({ Name: 'Jay Data'});
        DB1.saveChanges();
    });*/

    InitializeDb = function(repoService){
        var repo = repoService;

        repo.onReady(function(){
            repo.Diseases.toArray(function(arrDiseases){
                if(arrDiseases.length <= 0)
                {
                    repo.Diseases.add({name: "Ebola", description :"transmited through body fluid"});

                    repo.Diseases.add({name: "AIDS", description :" transmitted by blood contact or intercourse"});

                    repo.Diseases.add({name: "Tuberculosis", description :" contamination from coughing"});

                    repo.Diseases.add({name: "Trypanosomiasis", description :" Sleeping sickness"});

                    repo.saveChanges();
                }
            });
            repo.CaseStatus.toArray(function(arrCaseStatus){
                if(arrCaseStatus.length <= 0)
                {
                    repo.CaseStatus.add({label: "Pending"});

                    repo.CaseStatus.add({label: "Validated"});

                    repo.CaseStatus.add({label: "False Alert"});

                    repo.CaseStatus.add({label: "Negative Intent"});

                    repo.saveChanges();
                }
            });
        });
    };

    InitializeDb(this.Db);
}]);

appservices.factory('medService', [ "$location", "$q" ,"repositoryService","$data", function ( $location, $q, repositoryService, $data) {
    var service = {};
    //debugger;

    service.addNewCenter = function(newMedCenter){

        var defr = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function(){

            repos.MedSites.add(newMedCenter);
            repos.saveChanges();

            defr.resolve(null);
        });

        return defr.promise;
    }


    service.getMedSites = function(){
        var newDeferred = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function() {
            //format data
            var jData = [];
            var countries = [];
            var provinces = [];

            var data = repos.Countries.forEach(function(country){
                countries[country.id.toString()] = country
            }).then(function(){

                repos.Provinces.forEach(function(province){

                    var prov = {country: countries[province.countryId.toString()], province: province};
                    provinces[province.id.toString()] = prov;
                }).then(function(){
                    repos.MedSites.forEach(function(medSite){
                        var site = {};
                        site.countryName = countries[medSite.countryId.toString()].name;
                        site.provinceName = provinces[medSite.provinceId.toString()].province.name;
                        site.name = medSite.name;
                        site.locationLat = medSite.locationLat;
                        site.locationLong = medSite.locationLong;
                        site.detail = medSite.detail;
                        site.capacity = medSite.capacity;
                        site.centerType = medSite.centerType;

                        jData.push(site);

                    }).then(function(){
                        newDeferred.resolve(jData);
                    });
                });

            });
        });

        return newDeferred.promise;
    }


    return service;

}]);


appservices.factory('securityService', [ "$location", "$q" , function ( $location, $q) {
    var service = {};
    //debugger;


    return service;

}]);

appservices.factory('hotSpotService', [  "$location", "$q" , function ( $location, $q) {
    var service = {};
    //debugger;


    return service;

}]);

appservices.factory('infomationService', [  "$location", "$q","regionService", "repositoryService",function ( $location, $q, regionService, repositoryService) {
    var service = {};
    service.timeoutTkn = null;

    service.fetchInfos = function(){
        var deferred = $q.defer();

        var arrCountries = [];
        var arrProvinces = [];
        var infos = [];
        var result = [];

        regionService.getCountries().then(function(data){

            var countries = data[0].objects;
            var countriesLength = countries.length;

            for(var i = 0; i <countriesLength; i++)
            {
                arrCountries.push({id:countries[i].properties.id, name: countries[i].properties.label});
            }
            data = null;
            countries = null;

            regionService.getAllProvinces().then(function(provData){
                var provinces = provData[0].objects;
                var provincesLength = provinces.length;

                for(var i = 0; i <provincesLength; i++)
                {
                    arrProvinces.push({id : provinces[i].properties.id, name : provinces[i].properties.label, countryId : provinces[i].properties.countryId });
                }
                provData = null;
                provinces = null;

                service.getAllInfosRaw().then(function(infoData){
                    infos = infoData;

                    var arrCountriesLength = arrCountries.length;
                    var arrProvincesLength = arrProvinces.length;
                    var infosLength = infos.length;

                    for(var cntryCntr = 0; cntryCntr < arrCountriesLength; cntryCntr++ )
                    {
                        var currentCountry = arrCountries[cntryCntr];
                        var info = { countryName: currentCountry.name,   provinces: []}

                        for(var provCntr = 0; provCntr < arrProvincesLength; provCntr++)
                        {
                            var currentProv = arrProvinces[provCntr];

                            if(currentCountry.id == currentProv.countryId)
                            {
                                var prov = { provinceName: currentProv.name  , contactInfos:[]};

                                for(var nfoCntr = 0; nfoCntr < infosLength; nfoCntr++)
                                {
                                    var currentInfo = infos[nfoCntr];

                                    if((currentInfo.countryId == currentProv.countryId) && (currentInfo.provinceId == currentProv.id))
                                    {
                                        var cntInfo = { contact : currentInfo.contact, synop : currentInfo.description, clClass : null}
                                        prov.contactInfos.push(cntInfo);
                                        cntInfo = null;
                                    }
                                    currentInfo = null;
                                }

                                info.provinces.push(prov);
                                prov = null;
                            }
                            currentProv = null;
                        }

                        result.push(info);
                        info = null;
                        currentCountry = null;
                    }

                    deferred.resolve(result);

                    infos = null;
                    infoData = null;
                    arrCountries = null;
                    arrProvinces = null;

                }, function(msg){
                    debugger;
                    var ate = "";
                });
            }, function(msg){
                debugger;
            });

        },function(msg){
            debugger;
        });

        return deferred.promise;
    }

    service.getAllInfosRaw = function()
    {
        var deferred = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function(){
            var hotlines = [];
            repos.Hotlines.forEach(function(hotline){
                hotlines.push(hotline);
            }).then(function(){
                deferred.resolve(hotlines);
            });
        });

        return deferred.promise;
    }


    service.InsertInfos = function(info){
        var deferred = $q.defer();
        var repos = repositoryService.Db;

        repos.onReady(function(){
            repos.Hotlines.add(info);
            repos.saveChanges();
            deferred.resolve(null);
        });
        return deferred.promise;
    }


    return service;

}]);

//mapLevels: country, province, department, city
appservices.factory('regionService', [  "$location", "$q" , "repositoryService","$data", function ( $location, $q, repositoryService, $data) {
    var service = {};

    service.addNewCountry = function(newItem){
        var newDeferredCountry = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function() {
            repos.Countries.add({ name: newItem.name, geometry: newItem.coord});
            repos.saveChanges();
            var geom = JSON.parse( newItem.coord);
            var obj = { "type": "Feature", "properties": { }, "geometry": geom};
            obj.properties.country = newItem.name;

            newDeferredCountry.resolve(obj);
            geom = null;
            obj = null;
        });

        return newDeferredCountry.promise;
    }

    service.getCountries = function(){
        var newDeferredCountry = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function() {
            //format data
            var jData = [];
            var data = repos.Countries.forEach(function(country){
                var temp = JSON.parse(country.geometry);
                var obj = { "type": "Feature", "properties": { }, "geometry": temp};
                obj.properties.label = country.name;
                obj.properties.id = country.id;
                obj.properties.mapLevel = "country";
                jData.push(obj);

            }).then(function(){

               // var collection = {type: "FeatureCollection", features: jData}; // GeoJSON
                //var topology = topojson.topology({collection: collection},{"property-transform":function(object){return object.properties;}}); // convert to TopoJSON preserving  properties info
               // console.log(topology.objects.collection); // inspect TopoJSON

                newDeferredCountry.resolve([{
                                  type:        'path',
                                  objects:     jData
                                }]);
            });
        });

        return newDeferredCountry.promise;
    }

    service.getCountry = function(countryId){
        var promess = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function(){

            repos.Countries.first(function(cntry){
                return cntry.id == this.id;
            }, {id : countryId}, function(country){
                promess.resolve(country);
            });
        });

        return promess.promise;
    }

    service.exportCountries = function(){
        var exportCountryDeffered = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function() {
            //format data
            var jData = [];
            var data = repos.Countries.forEach(function(country){
                var cntry = country;
                jData.push(cntry);
                cntry = null;
            }).then(function(){
                exportCountryDeffered.resolve(jData);
                jData = [];
            });
        });

        return exportCountryDeffered.promise;
    }

    service.importCountries = function(countriesString){

        var importtCountryDeffered = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function() {
            var cntryArr = JSON.parse(countriesString);

            if(angular.isArray(cntryArr))
            {
                cntryArr.forEach(function(elem, idx, arr){
                    repos.Countries.add({ name: elem.name, geometry: elem.geometry});

                });
            }
            repos.saveChanges();
            cntryArr = [];
            cntryArr = null;
            importtCountryDeffered.resolve("done!");
        });

        return importtCountryDeffered.promise;
    }

    service.getProvinces = function(countryIdVal){
        var newDeferredCountry = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function() {
            //format data
            var jData = [];

            service.getCountry(countryIdVal).then(function(parentCountry){



               repos.Provinces.forEach(function(province){

                   if(province.countryId == countryIdVal)
                   {
                       var temp = JSON.parse(province.geometry);
                       var obj = { "type": "Feature", "properties": { }, "geometry": temp};
                       obj.properties.label = province.name;
                       obj.properties.id = province.id;
                       obj.properties.country = parentCountry.name;
                       obj.properties.mapLevel = "province";

                       jData.push(obj);
                   }
               }).then(function(){
                   newDeferredCountry.resolve([{
                       type:        'path',
                       objects:     jData
                   }]);
               });
            });

        });

        return newDeferredCountry.promise;
    }

    service.addNewProvince = function(countryIdVal, newItem){
        var newDeferredCountry = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function() {

            repos.Countries.single(function(country){
                return  country.id == this.countryId
            }, {countryId : countryIdVal})
                .then(function(foundCountry){
                    repos.Countries.attach(foundCountry);
                    var prov = new province({ name: newItem.name, geometry: newItem.coord});
                    prov.country = foundCountry;
                    prov.countryId = foundCountry.id;

                    repos.Provinces.add(prov);
                    repos.saveChanges();

                    var temp = JSON.parse(newItem.coord);
                    var obj = { "type": "Feature", "properties": { }, "geometry": temp};
                    obj.properties.label = newItem.name;
                    obj.properties.id = newItem.id;
                    obj.properties.mapLevel = "province";


                    newDeferredCountry.resolve(obj);

                });
        });

        return newDeferredCountry.promise;
    }


    service.getAllProvinces = function(){
        var newDeferredCountry = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function() {
            //format data
            var jData = [];


            var countries = [];
            var data = repos.Countries.forEach(function(country){
                countries[country.id.toString()] = country
            }).then(function(){

                repos.Provinces.forEach(function(province){
                    var temp = JSON.parse(province.geometry);
                    var obj = { "type": "Feature", "properties": { }, "geometry": temp};
                    obj.properties.label = province.name;
                    obj.properties.id = province.id;
                    obj.properties.country = countries[province.countryId.toString()].name;
                    obj.properties.countryId = province.countryId;
                    obj.properties.mapLevel = "province";

                    jData.push(obj);

                }).then(function(){
                    newDeferredCountry.resolve([{
                        type:        'path',
                        objects:     jData
                    }]);
                });

            });
        });

        return newDeferredCountry.promise;
    }

    return service;

}]);

appservices.factory('reportCaseService', [  "$location", "$q" , "repositoryService","$data", function ( $location, $q, repositoryService, $data) {
    var service = {};

    service.getCaseTypes = function(){
        var deferred = $q.defer();

        var repos = repositoryService.Db;

        repos.onReady(function(){
            repos.Diseases.toArray(function(arrDiseases){
                deferred.resolve(arrDiseases);
            });
        });

        return deferred.promise;
    }

    service.reportSuspiciousCase = function(newSuspectedCase){
        var repos = repositoryService.Db;
        var deferred = $q.defer();

        repos.onReady(function(){
            repos.Cases.add(newSuspectedCase);
            repos.saveChanges();
            deferred.resolve(null);
        });

        return deferred.promise;
    };

    service.loadCaseStatus = function(){

        var deferred = $q.defer();
        var repos = repositoryService.Db;

        repos.onReady(function(){
            repos.CaseStatus.toArray(function(arr){
                deferred.resolve(arr);
            });
        });

        return deferred.promise;

    };

    service.loadCases = function(){
        var deferred = $q.defer();
        var repos = repositoryService.Db;

        repos.onReady(function(){
            repos.Cases.toArray(function(arr){
                deferred.resolve(arr);
            });
        });

        return deferred.promise;
    };

    service.loadNotes = function(caseId){
        var deferred = $q.defer();
        var repos = repositoryService.Db;
        var notes = [];

        repos.onReady(function(){
            repos.Notes.forEach(function(note){
                if(note.dcaseId == caseId)
                {
                    notes.push(note);
                }
            }).then(function(){
                deferred.resolve(notes);
            });
        });

        return deferred.promise;
    };

    service.saveNote = function(newNote){
        var deferred = $q.defer();
        var repos = repositoryService.Db;

        repos.onReady(function(){
            repos.Notes.add(newNote);
            repos.saveChanges();

            deferred.resolve(newNote);
        });

        return deferred.promise;
    };

    service.updateCaseStatus = function(varArg){

        var caseId = varArg.caseId;
        var caseStatusId = varArg.caseStatusId;

        var deferred = $q.defer();
        var repos = repositoryService.Db;

        repos.onReady(function(){
            repos.Cases.first(function(searchCase){
                return searchCase.id == this.caseToSearchId;
            },
                {caseToSearchId: caseId},
                function(foundCase){
                    repos.Cases.attach(foundCase);
                    foundCase.caseStatusId = caseStatusId;
                    repos.saveChanges();
                    deferred.resolve(null);
                });
        });

        return deferred.promise;
    };

    return service;
}]);