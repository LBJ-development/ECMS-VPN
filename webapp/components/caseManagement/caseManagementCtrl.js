'use strict';

angular.module('ECMSapp.caseManagement', [])

// GENERAL TAPSTRIP CONTROLLER //////////////////////////////////////////
.controller('CaseManagementCtrl', function($scope){

	$scope.CMtabstripOptions = {
		dataTextField: 'Name',
		dataContentUrlField: 'ContentUrl',
		dataImageUrlField: "imageUrl",
		dataSource: [
			{
				Name: 'Case 12346',
				imageUrl: "assets/images/TS-case-icn.png",
				ContentUrl: 'components/caseManagement/caseTemplate.html'
			},
			{
				Name: 'Jane Doe',
				imageUrl: "assets/images/TS-person-icn.png",
				ContentUrl: 'components/caseManagement/personTemplate.html'
			},
			{
				Name: 'RFS 789456',
				imageUrl: "assets/images/TS-rfs-icn.png",
				ContentUrl: 'components/caseManagement/rfsTemplate.html'
			}
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

// CASE CONTROLLER /////////////////////////////////////////////////////////

.controller('CaseTemplateCtrl', function($scope){

	$("#test").css("display", "none");

	$scope.$on('myCustomEvent', function (event, data) {
		console.log(data); // 'Data to send'

		$("#summary").animate(
					{opacity: "0"}, 300, function(){
						$("#summary").css("display", "none");
						$("#test").css("display", "block");
					});
	});
})

// CASE HEADER CONTROLLER & DIRECTIVE /////////////////////////////////////////////////////////

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

// CASE LEFT MENU CONTROLLER & DIRECTIVE /////////////////////////////////////////////////////////

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

		var menuSelect = function(e) {
			// BROADCASTING THE SELECTION
			scope.$parent.$broadcast('myCustomEvent', e.item.id);
		};

		var menu = $("#caseMenu").kendoPanelBar({
					expand: menuSelect
				}).data("kendoPanelBar");
			menu.select("#caseSummaryMen")
		}
	};
})

// CASE SUMMARRY CONTROLLER & DIRECTIVE /////////////////////////////////////////////////////////

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
})

// CASE TEST DIRECTIVE /////////////////////////////////////////////////////////

.directive ('caseTest',function () {
	return {
	restrict: 'E',
	scope :{},
	templateUrl: 'components/caseManagement/caseTest.html',
	link: function (scope, element, attrs){
		}
	};
});