
//  BALLU ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*'use strict';

 app.factory('loginService', function( $http){
	 return{
 		login:function(credentials){

 			Object.toparams = function ObjecttoParams(obj) {
 				var p = [];
 				for (var key in obj) {
 				p.push(key + '=' + encodeURIComponent(obj[key]));
 			}
 			return p.join('&');
 	};

 	var restservice = "/rest/auth/login";
 	var data = Object.toparams(credentials);
 	
	return $http({
 		method: 'POST',
 		url: restservice,
 		data: data,
 		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		 });
 	},

 	logout : function(){
 		var restservice = "/rest/auth/logout";
 		return $http.get(restservice);
 		}
 	}
 })
*/

//  LUDWIG ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
'use strict';
app.factory('loginService', function($http, $location, $rootScope){
	return{
		login:function(credentials, $scope){
			
			//var id ="http://cc-devapp1.ncmecad.net:8080/ecms/init?user=" + credentials['username'] + "&pass=" + credentials['password'];
			
			//var id ="http://localhost:8080/ecms/auth/" + credentials['username'] + "/" + credentials['password'];
			//var $promise = $http.get(id);
			
			$location.path('/home');
			$rootScope.displayMainMenu = true;
			$rootScope.loggedIn = true;

			//console.log("FROM LOGIN SERVICES: " + $rootScope.loggedIn);
			//var $promise = $http.post('components/login/testUser.php', credentials); //send data to testUser.php
		
			//$promise.then(function(result){
				//console.log(result);
				//console.log(result.status);
				//console.log(result.data.status);
				//if(result.data.status == 'SUCCESS'){
					//$scope.errormessage='';
					//$rootScope.usernameScope = credentials['username']; // display the user name
					//$location.path('/home'); // redirect to the home page
				//} else {
					//$scope.errormessage		= result.data.messages[0] + "!";
					//$scope.errormessage		= result.data + "!";
					//$scope.errormessage			= "Incorrect Information, please try again!";
					//$scope.errormessageclass	= 'errorMessageOn';	
					//$location.path('/home');
					
				//}
			//});
		}
	}
})
*/