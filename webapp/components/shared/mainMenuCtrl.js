
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

        $routeProvider.when('/caseadministration/rfsadministration', {
            templateUrl: 'components/caseAdministration/caseAdministration.html'

        });
		
		$routeProvider.when('/caseadministration/assigncm', {
            templateUrl: 'components/caseAdministration/assignCM.html'
        });

        $routeProvider.when('/caseadministration/intakedistribution', {
            templateUrl: 'components/caseAdministration/intakeDistribution.html'
        });

        $routeProvider.when('/caseadministration/mediacertdistribu', {
            templateUrl: 'components/caseAdministration/mediaCertDistribu.html'
        });

        $routeProvider.when('/casemanagement', {
            templateUrl: 'components/caseManagement/caseManagement.html'
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
            permission: "menu:view:home"
        },{
            text: "Call Management",
            url: "#/callmanagement",
            permission: "menu:view:callmgmt"
        }, {
            text: "Case Administration",
            //url: "#",
            cssClass: "head-menu", // EMPTY CLASS ONLY FOR SELECTION PURPOSES
            permission: "menu:view:caseadmin",
            items: [{
                    text: "RFS Administration",
                    cssClass: "sub-menu",
                    url: "#/caseadministration/rfsadministration",
                    permission: "caseadmin:view:basic"
                },{
                    text: "Assign Case Manager",
                    cssClass: "sub-menu",
                    url: "#/caseadministration/assigncm",
                    permission: "caseadmin:view:basic"
                },{
                    text: "Intake Distribution",
                    cssClass: "sub-menu",
                    url: "#/caseadministration/intakedistribution",
                    permission: "caseadmin:view:basic"
                },{
                    text: "Media Doc Distribution",
                    cssClass: "sub-menu",
                    url: "#/caseadministration/mediacertdistribu",
                    permission: "caseadmin:view:basic"
                }]
            },
            {
                text: "Case Management",
                cssClass: "casemanagement-menu", // EMPTY CLASS ONLY FOR SELECTION PURPOSES
                url: "#/casemanagement",
                permission: "menu:view:casemgmt"
            },
            {
                text: "Case Analysis",
                url: "#/caseanalysis",
                permission: "menu:view:caseanalysis"
            },
            {
                text: "Person Management",
                url: "#/personmanagement" ,
                permission: "menu:view:personmgmt"
            },
            {
                text: "Reports",
                url: "#/reports",
                permission: "menu:view:reports"
            },
            {
                text: "Supervisor",
                url: "#/supervisor",
                permission: "menu:view:supervisory"
            }];
    })

    .directive ('mainMenu', function ($location, $rootScope, $http, StorageService, loginService) {
    return {
        restrict: 'E',
        controller: 'MainMenuCtrl',
        templateUrl: 'components/shared/mainMenu.html',
        link: function (scope, element, attrs){

            var locations = [];

        // WHEN A CASE HAS BEEN SELECTED AND REDIRECT TO CASE MANAGEMENT
            scope.$on('$routeChangeStart', function(next, current) { 

                // HIDE THE BACK BUTTON WHEN FIRST 
                (locations.length === 0)? scope.backVis = false : scope.backVis = true;

                // STORE THE LCCATIONS FOR THE BACK BUTTON //////////////////////////
                locations.push($location.path());
         
                // ADJUST THE MENU WHEN NAVIGATION IS TRIGGER OUTSIDE THE MENU
                if($location.path() == "/casemanagement" ){
                    // CHANGE THE ITEM MENU CLASS
                    $("#mainMenu").find(".k-state-selected").removeClass("k-state-selected");
                    $("#mainMenu").find(".casemanagement-menu").addClass("k-state-selected");
                }

                var caseAdmin = $location.path().slice(0,19); // CHECK IF WE NEED TO HIGHLIGHT THE HEAD-MENU WHE THE NAVIGATION IS NOT TRIGGERED FROM THE MAIN MENU
                if(caseAdmin == "/caseadministration" ){
                    // CHANGE THE ITEM MENU CLASS
                    $("#mainMenu").find(".k-state-selected").removeClass("k-state-selected");
                    $("#mainMenu").find(".head-menu").addClass("k-state-selected");
                }
            });

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
           
			//console.log(permissions);
            if (permissions) {
                for (var i in scope.menuSource) {
                    if ($.inArray(scope.menuSource[i]['permission'], permissions) > 0){
						//Remove any unauthorized submenu items before adding menu to menuWithPermissions
                        if('items' in scope.menuSource[i]){
                            var submenu = scope.menuSource[i]['items'].slice();
							var k=submenu.length-1;
							//console.log(scope.menuSource[i]['items']);
							while(k>=0){
								//console.log("Submenu item");
								//console.log(submenu[k]);
								//if submenu item is not in permissions list, remove it
								if ($.inArray(submenu[k]['permission'], permissions) < 0) {
									scope.menuSource[i]['items'].splice(k, 1);
								}
								k--;
							}
                }
                					//console.log(scope.menuSource[i]['permission'] + ' will be enabled because:' + ($.inArray(scope.menuSource[i]['permission'], permissions) >0));
                        $rootScope.menuWithPermissions.push(scope.menuSource[i]);
                    }
                }
            }

            scope.goBack = function(ev) { 
                   locations.pop();
                var route = locations[locations.length - 1];
                 
                     console.log(route);
                   $location.path(route);

                  
            }

            var CASelected = false;

            scope.onOpen = function(ev) {
               // console.log(CASelected);
               $("#mainMenu").find(".head-menu").removeClass("k-state-selected");
            };

            scope.onClose = function(ev) {
                // console.log(CASelected);

               if(CASelected){
                     // console.log(CASelected);
                      $("#mainMenu").find(".head-menu").addClass("k-state-selected");
               }   
            };

            // HIDE THE MENU WHEN LOGIN OUT
            scope.logout = function() {
                $rootScope.displayMainMenu = false;
               // console.log (StorageService.getToken());
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
            //console.log('Token-hold-debug' + StorageService.getToken());

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
})
