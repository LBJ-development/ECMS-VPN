
//  BALLU ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
'use strict';

angular.module('ECMSapp.login', [])
    .controller('LoginCtrl',
    function($scope, $rootScope, $location, loginService, StorageService) {
        $scope.isDisabled = true;
        $scope.errormessage = "";

        $scope.login = function(credentials){
			
            loginService.login(credentials).success(function(data, status, headers, config) {
                if (data.status == 'SUCCESS')
                {
                    $location.path('/home');
                    $rootScope.displayMainMenu = true;
                    console.log(JSON.stringify(data));
                    $rootScope.permissions = data.content.permissions;
                    $rootScope.usernameScope = data.content.firstName;
                    StorageService.setToken(data.content.token);
                }
                else
                {
                    $scope.errormessage			= "Incorrect Information, please try again!";
                    $scope.errormessageclass	= 'errorMessageOn';
                }
            }).error(function(data, status) { // called asynchronously if an error occurs
// or server returns response with an error status.
                $scope.errormessageclass	= 'errorMessageOn';
                if (data == null){
                    $scope.errormessage			= "System error, please contact admin !!";
                } else {
                    $scope.errormessage			= data.error;
                }

            }) // Call login service
        };

        this.enableBtn = function(){
            $scope.isDisabled 			= false;
            $scope.buttonClass  		= 'regular-btn';
        };

        this.disableBtn = function(){
            $scope.isDisabled 			= true;
            $scope.buttonClass  		= 'disabled-btn';
            $scope.errormessageclass 	= "errorMessageOff";
        };

        this.hideErrorMessage = function(){
            $scope.errormessageclass 	= "errorMessageOff";
        }
    })

    .directive ('loginDirective', function () {

    return {
        restrict: 'E',
        transclude: false,
        controller: 'LoginCtrl',
        link: function (scope, element, attrs, LoginCtrl){

            /*scope.buttonClass 		= "disabled-btn";
             scope.errormessageclass = "errorMessageOff";
             scope.errormessage = "";

             var username = document.getElementById("username");
             var password = document.getElementById("password");

             username.addEventListener('input', function() {
             LoginCtrl.hideErrorMessage();
             ( username.value != "" && password.value != "")? LoginCtrl.enableBtn() : LoginCtrl.disableBtn();
             });

             password.addEventListener('input', function() {
             LoginCtrl.hideErrorMessage();
             ( username.value != "" && password.value != "")? LoginCtrl.enableBtn() : LoginCtrl.disableBtn();
             });*/
        }
    }
})
//  LUDWIG ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
'use strict';

angular.module('ECMSapp.login', [])

.controller('LoginCtrl',
	function($scope, loginService) {
		//$scope.errormessage = "";
		$scope.isDisabled = true;
		$scope.login = function(credentials){
			loginService.login(credentials, $scope); // Call login service	
		}

		this.hideErrorMessage = function(){
			$scope.errormessageclass 	= "errorMessageOff";
		}
	})

.directive ('loginDirective', function () {

	return {
		restrict: 'E',
		transclude: false,
		controller: 'LoginCtrl',
		link: function (scope, element, attrs, LoginCtrl){

			}
		}
	})
	*/