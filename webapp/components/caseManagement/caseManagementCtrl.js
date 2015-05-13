'use strict';

angular.module('ECMSapp.caseManagement', [])

.controller('CaseManagementCtrl', ['$scope', '$http', function($scope,  $http){

	$scope.CMtabstripOptions = {
		dataTextField: 'Name',
		dataContentUrlField: 'ContentUrl',
		dataSource: [
         			{ Name: 'Case 12346', ContentUrl: 'components/caseManagement/caseTemplate.html' },
          			{ Name: 'Tab2', ContentUrl: '' }
       			 ],
		animation: {
			close: {
				duration: 200,
				effects: 'fadeOut'
			},
			open: {
				duration: 200,
				effects: 'fadeIn'
			}
		},
	};

	setTimeout(function(){ $scope.CMtabstrip.select(0) }, 500)
}])

.controller('CaseHeaderCtrl', ['$scope', '$http', function($scope,  $http){
	// console.log("FROM CASE HEADER");
	// console.log($scope);
}])

.directive ('caseHeader', ['DataFtry', '$http', function (DataFtry, $http) {
	return {
	restrict: 'E',
	scope :{},
	controller: 'CaseHeaderCtrl',
	templateUrl: 'components/caseManagement/caseHeader.html',
	link: function (scope, element, attrs){

		console.log(scope);

		$("#moreBtn").css("display", "none");

		scope.toggleHeader = function(ev) {

			if($("#caseHeaderInfo").is(":visible")) {

				$("#caseHeaderInfo").animate(
					{height: "0", opacity: "0"}, 300, function(){
						$("#caseHeaderInfo").css("display", "none");
					});
				$("#moreBtn").css("display","inline-block");
				$("#lessBtn").css("display", "none");

			} else {

				$("#caseHeaderInfo").css({display: "inline-block"});

				$("#caseHeaderInfo").animate(
					{height: "100%", opacity: "1"}, 300);
				$("#moreBtn").css("display", "none");
				$("#lessBtn").css("display","inline-block");
				}
			}
		}
	};
}])

.controller('CaseMenuCtrl', ['$scope', '$http', function($scope,  $http){
	$scope.caseMenuOptions = {
		contentUrls: [ null, null, "" ]
		};
}])

.directive ('caseMenu', ['DataFtry', '$http', function (DataFtry, $http) {
	return {
	restrict: 'E',
	scope :{},
	controller: 'CaseMenuCtrl',
	templateUrl: 'components/caseManagement/caseMenu.html',
	link: function (scope, element, attrs){

		}
	};
}])

.controller('CaseSummaryCtrl', ['$scope', '$http', function($scope,  $http){
	// console.log("FROM CASE HEADER");
	// console.log($scope);
}])

.directive ('caseSummary',function ($interval, $window) {
	return {
	restrict: 'E',
	scope :{},
	controller: 'CaseSummaryCtrl',
	templateUrl: 'components/caseManagement/caseSummary.html',
	link: function (scope, element, attrs){

		$window.addEventListener('resize', function() {

			if( window.innerWidth < 1650) {

				$("#info-holder").css('width', (window.innerHeight - 400));
			}


			
			console.log( window.innerWidth)
			}, false);

		}
	};
});