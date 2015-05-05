'use strict';

angular.module('ECMSapp.caseManagement', [])

.controller('CaseManagementCtrl', ['$scope', '$http', function($scope,  $http){

	$scope.CMtabstripOptions = {
		dataTextField: "Name",
		dataContentField: "Content",
		dataSource: [
			{ Name: "Case 123465", Content: "Tab1: content" },
			{ Name: "Tab2", Content: "Tab2: content" }
		],
		animation: {
			close: {
				duration: 200,
				effects: "fadeOut"
			},
			open: {
				duration: 200,
				effects: "fadeIn"
			}
		},
	};

	setTimeout(function(){ $scope.CMtabstrip.select(0) }, 500);

	

}]);