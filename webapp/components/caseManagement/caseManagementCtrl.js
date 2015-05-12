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
	console.log("FROM CASE HEADER");
	console.log($scope);


}])

.directive ('caseHeader', ['DataFtry', '$http', function (DataFtry, $http) {
	return {
	restrict: 'E',
	scope :{},
	controller: 'CaseHeaderCtrl',
	templateUrl: 'components/caseManagement/caseHeader.html',
	link: function (scope, element, attrs){

		$("#moreBtn").css("display", "none");

		scope.toggleHeader = function(ev) {

			if($("#caseHeaderInfo").is(":visible")) {

				$("#caseHeaderInfo").css("display", "none");
				$("#moreBtn").css("display","inline-block");
				$("#lessBtn").css("display", "none");

			} else {
				$("#caseHeaderInfo").css("display", "inline-block");
				$("#moreBtn").css("display", "none");
				$("#lessBtn").css("display","inline-block");
				}
			}
		}
	};
}]);