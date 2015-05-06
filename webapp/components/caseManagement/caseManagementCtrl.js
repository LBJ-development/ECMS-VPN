'use strict';

angular.module('ECMSapp.caseManagement', [])

.controller('CaseManagementCtrl', ['$scope', '$http', function($scope,  $http){

	$scope.CMtabstripOptions = {
		dataTextField: 'Name',
		dataContentUrlField: 'ContentUrl',
		dataSource: [
          { Name: 'Case 12346', ContentUrl: 'components/caseManagement/caseTemplate.html' },
          { Name: 'Tab2', ContentUrl: 'components/caseManagement/caseTemplate.html' }
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

.directive ('caseHeader', ['DataFtry', '$http', function (DataFtry, $http) {
	return {
	restrict: 'E',
	// scope :{},
	controller: 'CaseManagementCtrl',
	templateUrl: 'components/caseManagement/caseHeader.html',
	link: function (scope, element, attrs){

		console.log("FROM DIRECTIVE");

		}
	};
}]);