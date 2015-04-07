
//  BALLU  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

'use strict';

angular.module('ECMSapp.mainMenu', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {



        $routeProvider.when('/login', {
            templateUrl: 'components/login/login.html'
        });

        $routeProvider.when('/home', {
            templateUrl: 'components/home/home.html'
        });

        $routeProvider.when('/caseadministration', {
            templateUrl: 'components/caseAdministration/caseAdministration.html'

        });
		
		$routeProvider.when('/caseadministration/assigncm', {
            templateUrl: 'components/caseAdministration/assignCM.html'
        });

        $routeProvider.when('/caseadministration/intakedistribution', {
            templateUrl: 'components/caseAdministration/intakeDistribution.html'
        });

        $routeProvider.when('/comingsoon', {
            templateUrl: 'components/shared/comingSoon.html'
        });
        $routeProvider.otherwise({redirectTo: '/comingsoon'});
        //$routeProvider.otherwise({redirectTo: '/login'});

    }])

    .controller('MainMenuCtrl', function($http, $scope, $location) {

        $scope.menuSource =    [{
            text: "Home",
            spriteCssClass: "home-menu-sel-btn", // Item image sprite CSS class, optional.
            cssClass: "k-state-selected",
            url: "#/home" ,
            permission: "menu:home"

        },{
            text: "Call Management",
            url: "#/callmanagement",
            permission: "menu:callmanagement"
        }, {
                 text: "Case Administration",
                url: "#/caseadministration",
                cssClass: "head-menu", // EMPTY CLASS ONLY FOR SELECTION PURPOSES
                permission: "menu:caseadministration",
                items: [ {
                    text: "Assign CM",
                    cssClass: "sub-menu",
                    url: "#/caseadministration/assigncm",
                    permission: "menu:caseadministration:assigncm"
                },
                    {
                        text: "Intake Distribution",
                        cssClass: "sub-menu",
                        url: "#/caseadministration/intakedistribution",
                        permission: "menu:caseadministration:intakedistribution"
                    },
                    {
                        text: "Manage Recoveries",
                        cssClass: "sub-menu",
                        url: "#/caseadministration/managerecoveries",
                        permission: "menu:caseadministration:managerecoveries"
                    },
                    {
                        text: "Des Case Rev Cat",
                        cssClass: "sub-menu",
                        url: "#/caseadministration/descaserevcat",
                        permission: "menu:caseadministration:descaserevcat"
                    }]
            },
            {
                text: "Case Management",
                url: "#/casemanagement",
                permission: "menu:casemanagement"
            },
            {
                text: "Case Analysis",
                url: "#/caseanalysis",
                permission: "menu:caseanalysis"
            },
            {
                text: "Person Management",
                url: "#/personmanagement" ,
                permission: "menu:personmanagement"
            },
            {
                text: "Reports",
                url: "#/reports",
                permission: "menu:reports"
            },
            {
                text: "Supervisor",
                url: "#/supervisor",
                permission: "menu:supervisor"
            }];
    })

    .directive ('mainMenu', function ($location, $rootScope, $http, StorageService, loginService) {
    return {
        restrict: 'E',
        controller: 'MainMenuCtrl',
        templateUrl: 'components/shared/mainMenu.html',
        link: function (scope, element, attrs){

            if(!StorageService.getToken()) $location.path('/login');
            //
            // CHECK IF THE MAIN MENU NEEDS TO BE DISPLAYED
            var url = $location.url();
            $rootScope.displayMainMenu = (url == "/login" ? false : true);

            scope.$on('$locationChangeStart', function(event) {
                // CHECK IF THE USER IS LOGGED IN WHILE HITTING DIRECTLY A PARTIAL PAGE
                // IF NOT HE IS REDIRECTED TO THE LOGIN PAGE
                //console.log('Null value?' + StorageService.getToken() === null);
                if(StorageService.getToken() === null) $location.path('/login');
                //console.log("FROM LOCATION CHANGE");
            });

            var permissions = $rootScope.permissions;
            $rootScope.menuWithPermissions = [];

            if (permissions) {
                for (var i in scope.menuSource) {
                    if ($.inArray(scope.menuSource[i]['permission'], permissions)){
                        //alert(scope.menuSource[i]['permission'] + ' will be enabled');
                        $rootScope.menuWithPermissions.push(scope.menuSource[i]);

                        if('items' in scope.menuSource[i]){
                            var submenu = scope.menuSource[i]['items'];
                            //console.log(submenu);
                            for (var k in submenu){
                                //console.log(submenu[k]['permission'] in permissions);
                                if (!(submenu[k]['permission'] in permissions)) {
                                    //console.log(submenu[k]['permission'] + ' will be disabled');
                                }
                            }
                        }
                    }
                }
            }
/*
            $('#mainMenu').mouseenter(function(event) {

                    console.log(event.currentTarget);
            });*/

   
/*
        var headMenu =   $('#mainMenu').find(".head-menu");

        headMenu.mouseleave(function(event) {
            console.log("MOUSE LEAVE");
        });


        console.log("FROM");
        console.log(headMenu);
    


          $('.mainMenu').mouseenter(function(event) {

           
            var headMenu =  $("#mainMenu").find(".head-menu");

              if($(event.item).hasClass("sub-menu")) {

                console.log("FROM ROLLOVER MENU");
                
            });*/

            var CASelected = false;

            scope.onOpen = function(ev) {
               console.log(CASelected);
               $("#mainMenu").find(".head-menu").removeClass("k-state-selected");
            };

            scope.onClose = function(ev) {
                console.log(CASelected);

               if(CASelected){
                     console.log(CASelected);
                      $("#mainMenu").find(".head-menu").addClass("k-state-selected");

               } 
               
            };


            // HIDE THE MENU WHEN LOGIN OUT
            scope.logout = function() {
                $rootScope.displayMainMenu = false;
               console.log (StorageService.getToken());
                StorageService.setToken(null);
                loginService.logout();
            };

            // DISPLAY THE NAME OF THE PAGE THAT HAS BEEN CLICKED
            scope.onSelect = function(ev) {
                $rootScope.pageToBuild = $(ev.item.firstChild).text();

                // console.log($("#mainMenu")[0].firstChild);
              
                // CHANGE THE HOME ICON IMAGE 
                if(ev.item == $("#mainMenu")[0].firstChild){
                    $(ev.item).find(".home-menu-btn").addClass("home-menu-sel-btn").removeClass("home-menu-btn");
                } else {
                    $("#mainMenu").find(".home-menu-sel-btn").addClass("home-menu-btn").removeClass("home-menu-sel-btn");
                }

                // CHANGE THE ITEM MENU CLASS
                $("#mainMenu").find(".k-state-selected").removeClass("k-state-selected");
                $(ev.item).addClass("k-state-selected");

                // HIGHTLIGHT THE HEAD MENU WHEN A SUBMENU IS SELECTED
                if($(ev.item).hasClass("sub-menu")) {
                   $("#mainMenu").find(".head-menu").addClass("k-state-selected").removeClass("k-state-border-down");
                } 

                // CLOSES THE SUBMENU WHEN THE MENU IS CLICKED
                 if($(ev.item).hasClass("head-menu")) {
                      var menu = $("#mainMenu").data("kendoMenu");
                       menu.close();
                  }

                // CHECK IF THE IF THE MENU ITEM CLICKED BELONG TO THE SUB-MENU 
                  if($(ev.item).hasClass("head-menu") || $(ev.item).hasClass("sub-menu")){
                        
                        CASelected = true;

                  } else {

                        CASelected = false;
                  }
            };
        }
    };
})
    .directive('authorized', function($location, StorageService){
    return {
        link: function (scope, element, attrs){
            if(StorageService.getToken() === 'null') $location.path('/login');
            console.log('Token-hold-debug' + StorageService.getToken());

        }
    };
    })

    .directive ('footer', function () {
    return {
        restrict: 'E',
        templateUrl: 'components/shared/footer.html',
        link: function (scope, element, attrs){

        }
    };
});
