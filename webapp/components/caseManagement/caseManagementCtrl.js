'use strict';

angular.module('ECMSapp.caseManagement', [])

.controller('CaseManagementCtrl', function($scope){

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
})

.controller('CaseHeaderCtrl', function($scope){
	// console.log("FROM CASE HEADER");
	// console.log($scope);
})

.directive ('caseHeader' , function () {
	return {
	restrict: 'E',
	scope :{},
	controller: 'CaseHeaderCtrl',
	templateUrl: 'components/caseManagement/caseHeader.html',
	link: function (scope, element, attrs){

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
})

.controller('CaseMenuCtrl', function($scope){
	$scope.caseMenuOptions = {
		contentUrls: [ null, null, "" ]
		};
})

.directive ('caseMenu', function () {
	return {
	restrict: 'E',
	scope :{},
	controller: 'CaseMenuCtrl',
	templateUrl: 'components/caseManagement/caseMenu.html',
	link: function (scope, element, attrs){

		}
	};
})

.controller('CaseSummaryCtrl', function($scope){
	// console.log("FROM CASE HEADER");
	// console.log($scope);
})

.directive ('caseSummary',function ($interval, $window) {
	return {
	restrict: 'E',
	scope :{},
	controller: 'CaseSummaryCtrl',
	templateUrl: 'components/caseManagement/caseSummary.html',
	link: function (scope, element, attrs){

		var offset = 310;
		var infoWidth = $("#caseSummaryHolder").width() - offset;
		$("#info-holder").css('width', infoWidth);

		$window.addEventListener('resize', function() {

			infoWidth = $("#caseSummaryHolder").width() - offset;
			$("#info-holder").css('width', infoWidth);

			}, false);
		}
	};
});