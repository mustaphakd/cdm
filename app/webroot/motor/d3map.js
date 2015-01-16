'use strict';

/**
 * @ngdoc directive
 * @description draw interactive map with D3
 *
 * mapWidth, mapHeight - sizes of map, if fixed sizes are required
 * widthScale, heightScale - scales coefficients (when size is not fixed)
 * leftOffset, ..., bottomOffset - offsets in percents
 * scale - initial scale of map
 * pointClass - css class for 'circle' objects
 * circleRadius - default radius of 'circle' objects (when 'r' property is undefined)
 * areaClass - css class for map area
 * activeClass - css class for zoomed map area
 * zoomEmptyAreas - if we should zoom areas where getMap returned no objects
 * zoomXscale, zoomYscale - scale coefficients on zoom
 * textFontSize - font size for 'text' objects
 * textClass - css class for 'text' objects
 * textFont - font family for 'text' objects
 *
 * getMap - function, will be called on map initialization and on each map area click, and
 *  to use it you should return promise (angular.$q) where result of promise
 *  is array of objects, and each object contain fields:
 *    nested objects will be read from 'objects' field
 *    type of objects will be read from 'type' field
 *    getID function (if declared) will be read from getID field and will be called to define ID of each element
 *    getContent function (if declared) will be read from getContent field and will be called to fill contents of 'div' or 'text' elements
 *    nodeHandler function (if declared) will be read from nodeHandler field and
 *      will be called after all objects added, with arguments nodeHandler(nodes, nodesParent, projection).
 * Supported object types are 'path' (default), 'circle', 'div' and 'text'.
 * In nodeHandler() you can declare any attributes and event-handlers for objects.
 *
 *
 * add getMapUpdater:     enables auto map update when new nodes are added
 processCoord:   all user to process lat and long prior to handling click event
 */
angular.module('oz.d3Map',[])
  .directive('ozD3Map', function ($timeout, D3ChartSizer) {
    var xyz, g, projection, path, svg, width, height, objects, resizeBind, zoomBvr, hightlightOnMouseOver;
        var timeoutToken, tip;
    var stack = [];
    var sizer = new D3ChartSizer();

    function setDefaults(attrs) {
      attrs.widthScale = attrs.widthScale || '1.4';
      attrs.heightScale = attrs.heightScale || '1.5';
      attrs.leftOffset = attrs.leftOffset || '0';
      attrs.topOffset = attrs.topOffset || '0';
      attrs.rightOffset = attrs.rightOffset || '0';
      attrs.bottomOffset = attrs.bottomOffset || '0';
      attrs.scale = attrs.scale || '0.14';
      attrs.zoomXscale = attrs.zoomXscale || '1.8';
      attrs.zoomYscale = attrs.zoomYscale || '2.1';
      attrs.circleRadius = attrs.circleRadius || '2';
      if (attrs.zoomEmptyAreas === undefined) {
        attrs.zoomEmptyAreas = 'false';
      }
      attrs.textFontSize = attrs.textFontSize || '8px';
      attrs.textFont = attrs.textFont || 'sans-serif';
      attrs.highlightOnMouseOver = attrs.highlightOnMouseOver || false;
    }

    return {
      restrict: 'E',
      scope:    {
        mapWidth:       '@',
        mapHeight:      '@',
        widthScale:     '@',
        heightScale:    '@',
        leftOffset:     '@',
        topOffset:      '@',
        rightOffset:    '@',
        bottomOffset:   '@',
        scale:          '@',
        height:         '@',
        getMap:         '&',
        pointClass:     '@',
        activeClass:    '@',
        areaClass:      '@',
        zoomEmptyAreas: '@',
        zoomXscale:     '@',
        zoomYscale:     '@',
        circleRadius:   '@',
        textFontSize:   '@',
        textClass:      '@',
        textFont:       '@',
        divClass:       '@',
        highlightOnMouseOver: '@',
        getMapUpdater:     '&',
        processCoord:   '&'
      },
        controller: function($scope){
            var hydratedScale = 0;
            var hydratedTranslationCoord = [];
            var prevCoordTrans = [];

            var aspectRatio = {};

            $scope.conserveScale = function(intVal){ hydratedScale = intVal   };

            $scope.retrieveScale = function(){  return hydratedScale;   };

            $scope.hydrateTranslation = function(idx, transCoord){
                hydratedTranslationCoord[idx] = transCoord;
            };

            $scope.getHydrateTranslation = function(idx){
                return hydratedTranslationCoord[idx + 1] ;
            };

            $scope.prevCoordTrans = function( transCoord){
                prevCoordTrans = transCoord;
            };

            $scope.getprevCoordTrans = function(idx){
                return prevCoordTrans ;
            };

            $scope.preserveAspectRatio = function(translation, scale)
            {
                aspectRatio.translation = translation;
                aspectRatio.scale = scale;
            };

            $scope.retrieveAspectRatio = function(){
              return aspectRatio;
            };

            $scope.usePreservedAspectRatio = false;
            $scope.stackLevel = 0;


        },
      compile:  function (el, attrs) {
        setDefaults(attrs);
        return {
          post: function ($scope, $element) {
            if (!$scope.getMap || !angular.isFunction($scope.getMap)) {
              console.error('map getter not binded');
              return false;
            }

              hightlightOnMouseOver = attrs.highlightOnMouseOver;
                svg = d3.select(angular.element($element)[0]).append('svg');
                g = svg.append('g');
                sizer.setSizes($scope, $element.parent());
                 var originalScale = $scope.scale;
                drawMap();

              if($scope.getMapUpdater && angular.isFunction($scope.getMapUpdater))
              {
                  try {
                      $scope.getMapUpdater().then(function () {
                          },
                          function () {
                          },
                          function (newData) {
                              //addObjects(newData);

                              $scope.height = false;
                              $scope.width = false;
                              sizer.setSizes($scope, $element.parent());
                              var originalScale = $scope.scale;
                              if(newData == null)
                              {
                                  objects = null;
                                  drawMap();
                              }
                              else
                              {
                                  if(angular.isArray(newData))
                                  {
                                      objects[0].objects = newData;
                                      addObjects(objects);
                                  }
                                  else if(newData.requiredAction != undefined && newData.requiredAction != null)
                                  {
                                      if(newData.requiredAction == "viualAppend")
                                        addObjects(newData.actualData)
                                  }
                                  else {
                                      objects[0].objects.push(newData);
                                      drawMap();
                                  }


                              }

                          });
                  }
                  catch(err){

                      console.log(err);
                  }
              }




            function drawMap() {
              stack = [];
              if (!$scope.widthScale && $scope.mapWidth) {
                $scope.widthScale = $scope.width/$scope.mapWidth;
              }
              if (!$scope.heightScale && $scope.mapHeight) {
                $scope.heightScale = $scope.height/$scope.mapHeight;
              }
              $scope.scale = originalScale*$scope.width;
              width = $scope.width;
              height = $scope.height;
              projection = d3.geo.mercator()
                .scale($scope.scale)
                ///.translate([width/$scope.widthScale, height/$scope.heightScale]);
                .translate([width/2, height]);

                svg.attr('preserveAspectRatio', 'xMidYMid')
                .attr('viewBox', Math.round(($scope.leftOffset/100)*width) + ' ' + Math.round(($scope.topOffset/100)*height) + ' ' + Math.round(width*(1 - ($scope.rightOffset/100))) + ' ' + Math.round(height*(1 - ($scope.bottomOffset/100))))
                .attr('width', width)
                .attr('height', height);

              path = d3.geo.path().projection(projection);

                /*************************************************/
                zoomBvr = d3.behavior.zoom(g)
                    //.translate([0, 0])
                    //.scale(1)
                    .scaleExtent([.2, 25])
                    .on("zoom", zoomed)
                    .on("zoomstart", zoomStarted);

              if (!objects) {
                $scope.getMap(null).then(function (newObjects) {
                  if (!newObjects) {
                    console.error('map objects empty');
                    return false;
                  }
                  objects = newObjects;
                  g.selectAll('g').remove();
                  addObjects(objects);

                    svg.call(zoomBvr) // delete this line to disable free zooming
                        .call(zoomBvr.event);

                    tip = null;

                    tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-1, 0])
                        .html(function(d) {
                            return "<strong>Country:</strong> <span style='color:red'>" + d.properties.label + "</span>" +
                            "<br /><strong>Population:</strong> <span style='color:#ffc33b'> 2 mill :) </span>" ;
                        })


                    //maybe based on length. 0 = country, 1 = provinces ....
                    svg.call(tip);
                });
              }
              else {
                g.selectAll('g').remove();
                addObjects(objects);
              }

                /*svg
                    .call(zoom) // delete this line to disable free zooming
                    .call(zoom.event);*/
            }

            function addObjects(objects) {

              if(objects == undefined || objects == null)
                    return;

              if (angular.isArray(objects)) {
                angular.forEach(objects, function (subObjects) {
                  if (subObjects.objects) {
                    addObjects(subObjects);
                  }
                });
                return true;
              }
              var objectsType, nodes, nodeHandler;
              var getID = function (d) {return d.id;};
              var getContent = function (d) {return d.data;};
              if (!angular.isArray(objects) && angular.isArray(objects.objects)) {
                objectsType = objects.type;
                if (angular.isFunction(objects.getID)) {
                  getID = objects.getID;
                }
                if (angular.isFunction(objects.getContent)) {
                  getContent = objects.getContent;
                }
                nodeHandler = objects.nodeHandler;
                objects = objects.objects;
                if (!angular.isArray(objects)) {
                  console.error('d3-map: Expected array of objects or array of array of objects.', objects);
                  return false;
                }
              }
              var nodesParent = g.append('g');
              switch (objectsType) {
                case 'circle':
                  nodes = nodesParent
                    .attr('id', 'level' + parseInt(stack.length + 1))
                    .selectAll('path')
                    .data(objects)
                    .enter()
                    .append('circle')
                    .attr('r', function (d) {
                      return d.r || $scope.circleRadius;
                    })
                    .attr('id', getID)
                    .attr('class', $scope.pointClass)
                    .attr('transform', function (d) {
                      return 'translate(' + projection([
                        d.location.longitude,
                        d.location.latitude
                      ]) + ')';
                    });
                  break;
                case 'text':
                  nodes = nodesParent
                    .attr('id', 'level' + parseInt(stack.length + 1))
                    .selectAll('text')
                    .data(objects)
                    .enter()
                    .append('text')
                    .attr('transform', function (d) {
                      var centerCoordinates = projection([
                        d.location.longitude,
                        d.location.latitude
                      ]);
                      centerCoordinates[1] += parseFloat(parseInt($scope.textFontSize)/3);
                      return 'translate(' + centerCoordinates + ')';
                    })
                    .attr("font-family", $scope.textFont)
                    .attr("font-size", $scope.textFontSize)
                    .attr("class", $scope.textClass)
                    .text(getContent);
                  break;
                case 'div':
                  nodesParent = nodesParent.attr('id', 'level' + parseInt(stack.length + 1))
                    .append('foreignObject').attr("width", width).attr("height", height);
                  nodes = nodesParent
                    .selectAll('div')
                    .data(objects)
                    .enter()
                    .append('xhtml:div')
                    .attr('style', function (d) {
                      var centerCoordinates = projection([
                        d.location.longitude,
                        d.location.latitude
                      ]);
                      var padding = parseFloat(parseInt($scope.textFontSize));
                      centerCoordinates[0] -= padding;
                      centerCoordinates[1] -= padding;
                      return 'position: absolute; left: ' + centerCoordinates[0] + 'px; top: ' + centerCoordinates[1] + 'px;';
                    })
                    .attr("class", $scope.divClass)
                    .html(getContent);
                  break;
                //case 'path':
                  default:
                  var areaClass = $scope.areaClass;
                  if (stack.length > 0) {
                    areaClass = areaClass + " "+ $scope.activeClass;
                  }

                    //objects = objects.objects;
                  nodes = nodesParent
                    .attr('id', 'level' + parseInt(stack.length + 1))
                    .selectAll("path")
                    .data(objects)
                    .enter()
                    .append("path")
                    .attr("id", getID)
                      .attr("data_level", parseInt(stack.length + 1) )
                    .attr("class", areaClass)
                      .attr("d", path)
                    .on("click", function (d) {
                          tip.hide(d);

                          if(!$scope.processCoord || !angular.isFunction($scope.processCoord))
                          {
                              d.thisRef = this;
                              var nodeLevel = parseInt(this.attributes["data_level"].value);
                              //mapClicked(d, stack.length);
                              mapClicked(d, nodeLevel);
                          }
                          else
                          {
                              var longLat = projection.invert(d3.mouse(this));
                              var proceed = $scope.processCoord()(longLat, d);

                              if(proceed == false)
                                return;

                              d.thisRef = this;
                              var nodeLevel = parseInt(this.attributes["data_level"].value);
                              //mapClicked(d, stack.length);
                              mapClicked(d, nodeLevel);
                          }
                    });

                    if(hightlightOnMouseOver)
                    {
                        nodes.on("mouseover", function(d) {


                            var parentNode = this.parentNode;
                            parentNode.removeChild(this);
                            parentNode.appendChild(this);


                                d.context = this.getBoundingClientRect();

                            tip.offset(  [this.getBBox().height / 2, 0] );

                            tip.show(d);
                        });

                        nodes.on("mouseout", function(d) {
                            tip.hide(d);
                        });
                    }

                     timeoutToken = $timeout(function () {
                              adjustTranslation();
                              $timeout.cancel(timeoutToken);
                              timeoutToken = null;
                          }, 5);
              }
              if (angular.isFunction(nodeHandler)) {
                nodeHandler(nodes, nodesParent, projection);
              }

            }


            function adjustTranslation(forced){

                  var localforced = forced || false;
                  var svgClientRect = svg.node().getBoundingClientRect();
                  var gClientRect = g.node().getBoundingClientRect();
                  var btmDiff =   (svgClientRect.top - gClientRect.top + d3.transform(g.attr("transform")).translate[1])  ;

                  var leftDiff = d3.transform(g.attr("transform")).translate[0] +  svgClientRect.left - gClientRect.left;
                  var wScale = 0;
                  var hScale = 0;

                var heightDiff = svgClientRect.height - gClientRect.height;

                  if(stack.length <= 0 || (localforced == true))
                  {
                      wScale = (svgClientRect.width * 10000) / (gClientRect.width * 100)
                      wScale = wScale / 100;

                      hScale = (svgClientRect.height * 10000) / (gClientRect.height * 100)
                      hScale = hScale / 100;

                      var localScale = Math.min(wScale, hScale);

                      //var doZoom = false;

                      if(localScale == Infinity || localScale == undefined || localScale == 0)
                      {localScale = $scope.scale ;
                       // doZoom = true;
                      }

                      if(localforced == false)
                      {
                          $scope.conserveScale(localScale);

                          btmDiff = Math.max(heightDiff, btmDiff) * localScale;

                          $scope.hydrateTranslation(stack.length, btmDiff);
                      }
                      else {
                          localScale = $scope.retrieveScale();

                          var coord = $scope.getHydrateTranslation(stack.length);

                          if(coord != undefined) {

                              leftDiff = coord[0];
                              btmDiff = coord[1];
                          }
                          coord = null;
                      }
                      g.attr("transform", "translate(" + (  leftDiff) + ", " + ( btmDiff ) + ")scale(" + localScale + ")");

                      /*if(doZoom)
                      zoomed(svg);*/
                  }
                 /* else
                  {
                      leftDiff = d3.transform(g.attr("transform")).translate[0];
                      btmDiff = d3.transform(g.attr("transform")).translate[1];

                      var localScale = d3.transform(g.attr("transform")).scale;
                      g.attr("transform", "translate(" + (  leftDiff) + ", " + (btmDiff ) + ")scale(" + localScale + ")");
                  }*/
                  btmDiff = null;
                  svgClientRect = null;
                  gClientRect = null;
              }

            function mapClicked(area, fromLevel) {
              if (stack.length > 0) {
                //var toRemove = g.selectAll('#level' + parseInt(stack.length + 1));

                  for(var i = parseInt(fromLevel) ; i <=stack.length; i++)
                  {
                      var toRemove = g.selectAll('#level' + (i + 1));
                      if (toRemove) {
                          toRemove.remove();
                      }
                  }
                  while(stack.length > fromLevel)
                  {
                      stack.shift();
                  }
                  //stack.length = fromLevel;
              }
              //if (stack[0]) {
              //  g.selectAll('#' + stack[0].id).style('display', null);
              //}
              if (area && (!stack[0] || stack[0].id !== area.id)) {
                xyz = getXyz(area);
                if (fromLevel <= stack.length) {
                  stack[0] = area;
                }
                else {
                  stack.unshift(area);
                }
                g.selectAll('.' + $scope.activeClass).classed($scope.activeClass, false);
                  var parentEntity = {area: area, stack: stack};
                $scope.getMap( {parentEntity: {area: area, stack: stack}}).then(function (mapObjects) {
                  addObjects(mapObjects);
                  //zoom(xyz);
                    zoomed(area);
                  //g.selectAll('#' + area.id).style('display', 'none');
                    parentEntity = null;
                }, function () {
                  if ($scope.activeClass) {
                    g.selectAll('#' + area.id).classed($scope.activeClass, true);
                      parentEntity = null;
                  }
                  if ($scope.zoomEmptyAreas && $scope.zoomEmptyAreas !== 'false') {
                    //zoom(xyz);
                      parentEntity = null;
                  }
                });
              } else {
                stack.shift();
                xyz = [width/$scope.widthScale, height/$scope.heightScale, 1];
                if ($scope.activeClass) {
                  g.selectAll('.' + $scope.activeClass).classed($scope.activeClass, false);
                }
                  if (fromLevel > 1) {
                      //var toRemove = g.selectAll('#level' + parseInt(stack.length + 1));
                      var toRemove = g.selectAll('#level' + parseInt(fromLevel));
                      if (toRemove) {
                          toRemove.remove();
                      }
                      zoomed(stack[0], false)
                  }
                  else
                  {
                      adjustTranslation(true);
                  }
                  //$scope.getMap();

                      //zoom(xyz);
                  //zoomed(area)

              }
                $scope.preserveAspectRatio(d3.transform(g.attr("transform")).translate, d3.transform(g.attr("transform")).scale);
            }

            function zoom(xyz) {
              g.transition()
                .duration(750)
                .attr('transform', 'translate(' + projection.translate() + ')scale(' + xyz[2] + ')translate(-' + xyz[0] + ',-' + xyz[1] + ')');
              if ($scope.pointClass) {
                g.selectAll('.' + $scope.pointClass)
                  .attr('d', path.pointRadius(20.0/xyz[2]));
              }
            }

              /*********************************************/

              function zoomStarted(d, arg1, arg2)
              {
                  //$scope.prevCoordTrans(d3.transform(g.attr("transform")).translate);
                  $scope.multiplierEffect = 1;
              }
              function zoomed(d, bHydrateTranslation) {

                  var hydrateTranslation = bHydrateTranslation == undefined ?  true : bHydrateTranslation;

                  if(d == undefined || d == null)
                  {
                      if(d3.event.sourceEvent == null) {
                        //console.log("d3.event.sourceEvent is null. exiting function zoomed(d)");
                          return;
                      }
                      if(d3.event.sourceEvent.wheelDelta == undefined) {

                          var localScale = d3.transform(g.attr("transform")).scale;

                          var prevTransCoord = d3.transform(g.attr("transform")).translate;
                          var eventTransCoord = d3.event.translate;

                          var xy = [];
                           xy[0] =  prevTransCoord[0]* $scope.multiplierEffect + (eventTransCoord[0]) * (1.1 - $scope.multiplierEffect) ;// * xDir);
                           xy[1] = prevTransCoord[1] * $scope.multiplierEffect   + (eventTransCoord[1]) * (1.1 - $scope.multiplierEffect)  ;// * yDir);

                          if($scope.multiplierEffect > .3)
                            $scope.multiplierEffect -= .005;

                          g.attr("transform", "translate(" + xy + ")scale(" + localScale +  ")");

                          $scope.prevCoordTrans(xy);
                          localScale = null;
                          prevTransCoord = null;
                      }
                      else
                      {
                          $scope.conserveScale(d3.event.scale);
                          g.style("stroke-width", 1.5 / d3.event.scale + "px");
                          g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                      }

                  }
                  else
                  {
                      var bounds = path.bounds(d);
                      var dWidth = (bounds[1][0] - bounds[0][0]);
                      var dheight = (bounds[1][1] - bounds[0][1]);
                      //var z = 1/Math.max(wScale, hScale);

                      var svgClientRect = svg.node().getBoundingClientRect();
                      var gClientRect = g.node().getBoundingClientRect();
                      var dClientRect = d.thisRef.getBoundingClientRect();

                      var localEleWidthScale = (width * 1000000) / (dWidth * 10000 );
                      localEleWidthScale /= 100;
                      var localEleHeightScale = (height * 1000000) / (dheight * 10000);
                      localEleHeightScale /= 100;
                      var localEleScale = Math.min(localEleWidthScale, localEleHeightScale);

                      var prevCoods = d3.transform(g.attr("transform")).translate;

                      if(hydrateTranslation)
                        $scope.hydrateTranslation(stack.length, d3.transform(g.attr("transform")).translate);
                      g.attr("transform", "translate(" + (  prevCoods[0]) + ", " + ( prevCoods[1] ) + ")scale(" + localEleScale + ")");

                      svgClientRect = svg.node().getBoundingClientRect();
                      gClientRect = g.node().getBoundingClientRect();
                      dClientRect = d.thisRef.getBoundingClientRect();

                     var eleLeftTrans =  d3.transform(g.attr("transform")).translate[0]   + (-( gClientRect.left  - svgClientRect.left )) - (dClientRect.left  - gClientRect.left  ) ;  ;
                     var eletopTrans =   d3.transform(g.attr("transform")).translate[1]     + (-( gClientRect.top  - svgClientRect.top )) - (dClientRect.top  - gClientRect.top  ) ;

                      var localScale =  d3.transform(g.attr("transform")).scale;

                      g.attr("transform", "translate(" + (  eleLeftTrans) + ", " + ( eletopTrans ) + ")scale(" + localScale + ")");
                      eleLeftTrans = eletopTrans = localEleWidthScale = prevCoods = localEleHeightScale =   svgClientRect = gClientRect = dClientRect = null;

                  }
              }

            function getXyz(d) {
              var bounds = path.bounds(d);
              var wScale = (bounds[1][0] - bounds[0][0])/width;
              var hScale = (bounds[1][1] - bounds[0][1])/height;
              var z = 1/Math.max(wScale, hScale);
              var x = (bounds[1][0] + bounds[0][0])/$scope.zoomXscale;
              var y = (bounds[1][1] + bounds[0][1])/$scope.zoomYscale + (height/z/6);
              return [x, y, z];
            }

            if (!resizeBind) {
              resizeBind = true;
              $(window).resize(function () {
                var newHeight = $(window).height();
                var newWidth = $(window).width();
                $timeout(function () {
                  if ($(window).height() === newHeight && $(window).width() === newWidth) {
                    $scope.height = false;
                    $scope.width = false;
                    sizer.setSizes($scope, $element.parent());
                    drawMap();
                  }
                }, 200);
              });
            }
          }
        };
      }
    };
  });
