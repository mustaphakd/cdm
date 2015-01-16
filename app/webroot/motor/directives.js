var appDirectives = angular.module('appDirectives', []);

appDirectives.directive('statusBar', [
    function () {
        //debugger;
        return {
            restrict: 'A',
            scope: {
                modelContent  :  '=ngModel',
                //showSpinner     :  '=',
                //onComplete       :  '&evtCompleted'
                onCloseRequest: '&closeRequest'
            },

            controller : function ($scope) {
                //debugger;

                $scope.show = (typeof $scope.show === 'undefined') ? true : $scope.show;
                $scope.content = (typeof $scope.modelContent === 'undefined') ? "" : $scope.modelContent;
                $scope.updateHandler = null;
                $scope.attRemoved = false;
                $scope.cache = null;
                $scope.showSpinner = (typeof $scope.showSpinner === 'undefined') ? true : $scope.showSpinner;


                $scope.$watch(function(){return $scope.modelContent}, function(newValue, oldValue) {
                   // debugger;
                    if (oldValue != newValue)
                        if($scope.updateHandler != null)
                        $scope.updateHandler(newValue);
                });
            },

            template: '<button type="button" class="close" data-ng-click="onCloseRequest()" ><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> ' +
            '<strong><i class="fa fa-bolt fa-2x"></i></strong> {{content}}',

           // terminal: true,

            compile: function () {
                //debugger;
                return {
                    pre: function (scope, element, attributes) {
                        //debugger;
                        if(!scope.attRemoved) {

                            scope.attRemoved = true;
                           $(element).removeAttr("status-bar");
                          $(element).addClass("alert alert-info statusBar alert-dismissible").attr("role", "alert");
                            //.attr("ng-show", "{{show}}");

                            //angular.element(element).injector().get('$compile')(element)(scope);
                        }
                    },
                    post: function (scope, element, attributes, controller) {
                         //debugger;

                       //scope.cache = element;

                        /* scope.closeAlert = function(){
                            debugger;
                            this.show = false;

                            angular.element(this.cache).injector().get('$compile')(this.cache)(this);

                            //this.$apply(); //function(){this.show = false;});

                        }*/

                        scope.updateHandler  = function(newContent){
                            scope.content = newContent;
                            scope.show = true;
                            scope.show = false;
                        };
                    }
                }
            }

        };
    }
]);

appDirectives.directive('caseAddReportCharts',['$timeout',function($timeout){

    return{
        restrict: 'E',
        scope:{
            deseasePercentageNotifier: '&',
            caseStatusNotifier: '&',
            infectionRateNotifier: '&'
        },
        template: '<div class="container-fluid">' +
        '<div class="col-xs-12" id="infectionRateChartReportCharts" ><a class="reset" ng-click="resetInfectionRateLineChart()" style="display: none;float: right;">reset</a></div>' +
        '<div class="col-xs-12 col-md-6 ovrSvgVisible" id="deseasePercentageChartReportCharts"><strong>Diseases % Partition</strong><a class="reset" ng-click="resetDiseaseBarChart()" style="display: none;float: right;">reset</a></div>' +
        '<div class="col-xs-12 col-md-6 ovrSvgVisible" id="caseStatusChartReportCharts"><strong> Cases Statue %</strong><a class="reset" ng-click="resetcaseStatusBarChart()" style="display: none;float: right;">reset</a></div>' +
        '</div>',
        transclude: true,
        controller: function($scope, $element){
            $scope.diseaseBarChart = null;
            $scope.caseStatusBarChart = null;
            $scope.infectionRateLineChart = null;


            $scope.resetDiseaseBarChart = function(){
                $scope.diseaseBarChart.filterAll();
                dc.redrawAll();
            };

            $scope.resetcaseStatusBarChart = function(){
                $scope.caseStatusBarChart.filterAll();
                dc.redrawAll();
            };

            $scope.resetInfectionRateLineChart = function(){
                $scope.infectionRateLineChart.filterAll();
                dc.redrawAll();
            };

        },
        link: function(scope, iElement, iAttr){

            var infectionRateChartEle = $(iElement).find('#infectionRateChartReportCharts');
            var diseasePercentageChartEle = $(iElement).find('#deseasePercentageChartReportCharts');
            var caseStatusChartReportChartsEle = $(iElement).find('#caseStatusChartReportCharts');

            scope.diseaseBarChart = dc.pieChart(diseasePercentageChartEle[0]);
            scope.caseStatusBarChart = dc.pieChart(caseStatusChartReportChartsEle[0]);
            scope.infectionRateLineChart = dc.lineChart(infectionRateChartEle[0]);  //lineChart

            if(angular.isDefined(scope.deseasePercentageNotifier())  && angular.isFunction(scope.deseasePercentageNotifier))
            {
                scope.deseasePercentageNotifier().then(function(dimGrp){

                        scope.diseaseBarChart
                            .radius(90)
                            .dimension(dimGrp.dim)
                            .group(dimGrp.grp)
                             .label(function (d) {
                                 if (scope.diseaseBarChart.hasFilter() && !scope.diseaseBarChart.hasFilter(d.key)) {
                                 return  ' (0%)'; //d.key +
                                 }
                                 var label = d.key;

                                label += "\n\r"
                                 if (dimGrp.all.value()) {
                                 label = '(' + Math.floor(d.value / dimGrp.all.value() * 100) + '%)';
                                 }
                                 return label;
                             })
                            .renderLabel(true)
                            .innerRadius(40)
                            .transitionDuration(500)
                            .colors(colorbrewer.Set3[7])
                            .colorAccessor(function (d, i){
                                return i;
                            })
                            .legend(dc.legend().horizontal(true))
                            .calculateColorDomain();


                        //dc.renderAll();
                    scope.diseaseBarChart.render();
                });
            }

            if(angular.isDefined(scope.caseStatusNotifier())  && angular.isFunction(scope.caseStatusNotifier))
            {
                scope.caseStatusNotifier().then(function(dimGrp){

                    scope.caseStatusBarChart
                        .radius(90)
                        .dimension(dimGrp.dim)
                        .group(dimGrp.grp)
                        .label(function (d) {
                            if (scope.caseStatusBarChart.hasFilter() && !scope.caseStatusBarChart.hasFilter(d.key)) {
                                return  ' (0%)'; //d.key +
                            }
                            var label = d.key;

                            label += "\n\r"
                            if (dimGrp.all.value()) {
                                label = '(' + Math.floor(d.value / dimGrp.all.value() * 100) + '%)';
                            }
                            return label;
                        })
                        .renderLabel(true)
                        .innerRadius(40)
                        .transitionDuration(100)
                        .colors(colorbrewer.Set3[5])
                        .colorAccessor(function (d, i){
                            return i;
                        })
                        .legend(dc.legend().horizontal(true))
                        .calculateColorDomain();


                    //dc.renderAll();
                    scope.caseStatusBarChart.render();
                });
            }


            if(angular.isDefined(scope.infectionRateNotifier())  && angular.isFunction(scope.infectionRateNotifier))
            {
                scope.infectionRateNotifier().then(function(dimGrp){

                    scope.infectionRateLineChart
                        .width(768)
                        .x(d3.time.scale().domain([new Date(dimGrp.year, 0, 1), new Date(dimGrp.year, 11, 31)]))  /*****/
                        .xUnits(d3.time.months)
                        .elasticY(true)
                        //.elasticX(true)
                        .renderHorizontalGridLines(true)
                        .interpolate('linear')
                        .renderArea(true)
                        .brushOn(false)
                        .renderDataPoints(true)
                        //.clipPadding(10)
                        .yAxisLabel("Volume of cases")
                        .dimension(dimGrp.dim)
                        .group(dimGrp.grp);

                    scope.infectionRateLineChart.render();

                });
            }



        }
    };
}]);


appDirectives.directive('medCentersMap', [function(){
    return{
        restrict: 'E',
        scope:{
            markersNotifier: '&'
        },
        controller: function($scope){
            $scope.map = null;
            //$scope.markers = null;
        },
        link: function(scope, iEle, iAttr){

            scope.map = L.map($("#medCenterLeafletContainer")[0], {maxBounds:[[39.108751, -27.905273],[-41.459195, 56.074219]]}).setView([15.884734, -0.241699],5);
            var mapLink =
                '<a href="http://openstreetmap.org">OpenStreetMap</a>';
            L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; ' + mapLink + ' Contributors',
                    maxZoom: 13,
                    minZoom: 3
                }).addTo(scope.map);

            if((angular.isDefined(scope.markersNotifier())) && (angular.isFunction(scope.markersNotifier)))
            {
                scope.markersNotifier().then(function(data){

                    if( (angular.isDefined(data)) && (data != null) && (angular.isArray(data)))
                    {
                        var length = data.length;
                        for(var i = 0; i < length; i ++)
                        {
                            data[i].addTo(scope.map);
                        }
                       // $scope.markers = data;
                        data = null;
                    }
                });
            }

        }
    };
}]);


appDirectives.directive('heatsMap', [function(){
    return{
        restrict: 'E',
        scope:{
            heatSpotsNotifier: '&'
        },
        controller: function($scope){
            $scope.map = null;
        },
        link: function(scope, iEle, iAttr){

            scope.map = L.map($("#hotSpotLeafletContainer")[0], {maxBounds:[[39.108751, -27.905273],[-41.459195, 56.074219]]}).setView([15.884734, -0.241699],5);
            var mapLink =
                '<a href="http://openstreetmap.org">OpenStreetMap</a>'; // http://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png
            L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; ' + mapLink + ' Contributors',
                    maxZoom: 13,
                    minZoom: 3
                }).addTo(scope.map);

            if((angular.isDefined(scope.heatSpotsNotifier())) && (angular.isFunction(scope.heatSpotsNotifier)))
            {
                scope.heatSpotsNotifier().then(function(data){

                    if( (angular.isDefined(data)) && (data != null) && (angular.isArray(data)))
                    {
                       var length = data.length;
                        /*for(var i = 0; i < length; i ++)
                            L.heatLayer(data[1], {radius: 50}).addTo(scope.map);*/


                        //{*/
                        try {
                            scope.heatLayer = L.heatLayer(data, {radius: 15}).addTo(scope.map);
                            //scope.heatLayer.setLatLngs(data);
                            //scope.map.redraw();
                        }
                        catch(e){console.log(e.stack);}
                        //}[0], {radius: 18 }, minOpacity: 0.0025, blur: 10, gradient: {0.1: 'gray', 0.3: 'blue', 0.55: 'yellow', 0.75: 'lime', 1: 'red'}
                        //data = null;
                    }
                });
            }

        }
    };
}]);
