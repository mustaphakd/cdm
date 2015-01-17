<?php
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.View.Layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

$cakeDescription = __d('cake_dev', 'An attempt at a Disease Monitoring App contre Ebola');
$cakeVersion = __d('cake_dev', 'CakePHP %s', Configure::version())
?>
<!DOCTYPE  html>
<html>
<head id="header">
    <?php echo $this->Html->charset(); ?>
   <!-- <title>
        <?php
        //echo $cakeDescription
        ?>
        :
        <?php
        //echo $this->fetch('title');
        ?>
    </title>-->

    <title>Center for Disease Monitoring</title>

    <link href="libs/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="all" type="text/css" />
    <link href="libs/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet" media="all" type="text/css" />
    <link href="motor/app.css" rel="stylesheet" media="all" type="text/css" />
    <link href="motor/leaflet.css" rel="stylesheet" media="all" type="text/css" />
    <link href="css/font-awesome.min.css" rel="stylesheet" media="all" type="text/css" />
    <link href="css/angular-csp.css" rel="stylesheet" media="all" type="text/css" />
    <link href="css/dc.min.css" rel="stylesheet" media="all" type="text/css" />




    <?php
    echo $this->Html->meta('icon');

    echo $this->Html->css('cake.generic');

    echo $this->fetch('meta');
    echo $this->fetch('css');
    echo $this->fetch('script');
    ?>

</head>
<body ng-csp >
<div class="fillBody" ng-controller="mainAppController">
    <div class="row affix-row" >
        <div class="col-sm-3 col-md-2 col-lg-3 affix-sidebar">
            <div class="sidebar-nav">
                <div class="navbar " role="navigation">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-navbar-collapse">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <span class="visible-xs navbar-brand">Sidebar menu</span>
                    </div>
                    <div class="navbar-collapse collapse sidebar-navbar-collapse">
                        <ul class="nav navbar-nav" id="sidenav01">
                            <li class="li-header"> <div class="col-md-offset-2"><i class="fa fa-book fa-5"></i></div> </li>

                            <li  ><a href="#spots"><span class="glyphs fa fa-map-marker fa-5"></span> Hot-Spots </a></li>
                            <li  ><a href="#medcenters"><span class="glyphs fa fa-hospital-o fa-5"></span> Medical Centers<span class="badge pull-right">42</span></a></li>
                            <li  ><a href="#information"><span class="glyphs fa fa-info fa-5 active"></span> Information Hotlines</a></li>
                            <li ><a href="#medcenters/add">
                                          <span class=" fa-stack fa-md">
                                            <i class="fa fa-hospital-o fa-4 fa-stack-2x glyphs"></i>
                                            <i class="fa fa-plus fa-1 fa-stack-1x glyphs-top-right fa-inverse"></i>
                                          </span> Add Medical Center </a></li>
                            <li  ><a href="#cases/add">
                                          <span class=" fa-stack fa-md">
                                            <i class="fa fa-stethoscope fa-4 fa-stack-2x glyphs"></i>
                                            <i class="fa fa-plus fa-1 fa-stack-1x glyphs-top-right fa-inverse"></i>
                                          </span> Add New Case</a></li>
                            <li  ><a href="#reportcase"><span class="glyphs fa fa-bullhorn fa-5"></span>Report Suspected Case<span class="badge pull-right">42</span></a></li>
                            <li  ><a href="#regions"><span class="glyphs fa fa-puzzle-piece fa-5"></span>Regions<span class="badge pull-right">42</span></a></li>
                        </ul>
                    </div><!--/.nav-collapse -->
                </div>
            </div>
        </div>
        <div class="col-sm-9 col-md-10 col-lg-9 affix-content">
            <div class="container" ng-view >

                <?php echo $this->Session->flash(); ?>

                <?php echo $this->fetch('content'); ?>

            </div>
        </div>

    </div>
    <div  ng-model="NotificationMessage" status-bar close-request="hideNotification()" data-ng-show="notify">
    </div>
</div>
<script type="text/javascript" src="motor/include.js" async ></script>
<?php
//echo $this->element('sql_dump');
?>

</body>
</html>
