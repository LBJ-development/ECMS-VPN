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
				Name: 'Case 1247010',
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

	$scope.$on('caseMenuSelect', function (event, data) {

		//console.log("FROM MENU CASE TEMPLATE CONTROLLER");
		
		if(data == "caseSummary"){
			
			//$("#summary").animate(
			//{opacity: "0"}, 300, function(){
				$("#summary").css("display", "block");
				$("#test").css("display", "none");
			//});
		} else {
			//$("#summary").animate(
			//{opacity: "0"}, 300, function(){
				$("#summary").css("display", "none");
				$("#test").css("display", "block");
			//});
		}
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

		/*$("#moreBtn").css("display", "none");

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
			}*/
		}
	};
})

.controller('VictimsHeaderCtrl', function($scope){
	// console.log("FROM CASE HEADER");
	// console.log($scope);
})

.directive ('victimsHeader' , function ($rootScope) {

	return {
	restrict: 'E',
	scope :{},
	controller: 'VictimsHeaderCtrl',
	templateUrl: 'components/caseManagement/victimsHeader.html',
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

		// RESIZE THE INFO HOLDER WHEN ONE RESIZE WINDOW
		var offset = 310;
		var infoWidth = $("#wrapper").width() - offset;

		$("#victim-holder").css('width', infoWidth);

		$rootScope.$on('wrapperWidthChanges', function (event, data) {
	
			$("#victim-holder").css('width', data - offset);
			});
		}
	};
})

// CASE LEFT MENU CONTROLLER & DIRECTIVE /////////////////////////////////////////////////////////

.controller('CaseMenuCtrl', function($scope){
	// $scope.caseMenuOptions = {
	// 	contentUrls: [ null, null, "" ]
	// };
})

.directive ('caseMenu', function () {
	return {
	restrict: 'E',
	//scope :{},
	controller: 'CaseMenuCtrl',
	templateUrl: 'components/caseManagement/caseMenu.html',
	link: function (scope, element, attrs){

		var menu = $("#caseMenu").kendoPanelBar({
					expand: menuExpand,
					select: menuSelect,
					collapse: menuCollapse,
					activate: menuActivate
				}).data("kendoPanelBar");
			menu.select("#caseSummary");
	
		function menuSelect(e) {
		
			//console.log("FROM MENU SELECT");
			// BROADCASTING THE SELECTION
			scope.$parent.$broadcast('caseMenuSelect', e.item.id);
			}
		
		function menuExpand(e){

			console.log("FROM MENU EXPAND");
			}

		function menuCollapse(e){

			console.log("FROM MENU COLLAPSE");
			}

		function menuActivate(e){

			console.log("FROM MENU ACTIVATE");
			}
		}
	};
})

// CASE SUMMARY CONTROLLER & DIRECTIVE /////////////////////////////////////////////////////////

.controller('CaseSummaryCtrl', function($scope){
	// console.log("FROM CASE HEADER");
	// console.log($scope);
	
})

.directive ('caseSummary',function ( $rootScope) {
	return {
	restrict: 'E',
	scope :{},
	controller: 'CaseSummaryCtrl',
	templateUrl: 'components/caseManagement/caseSummary.html',
	link: function (scope, element, attrs){

		// RESIZE THE INFO HOLDER WHEN ONE RESIZE WINDOW
		var offset = 350;
		var infoWidth = $("#wrapper").width() - offset;

		$("#info-holder").css('width', infoWidth);

		$rootScope.$on('wrapperWidthChanges', function (event, data) {
			
			$("#info-holder").css('width', data - offset);
			});
		}
	};
})

// CASE TEST DIRECTIVE /////////////////////////////////////////////////////////

.directive ('caseTest',function ($rootScope) {
	return {
	restrict: 'E',
	//scope :{},
	templateUrl: 'components/caseManagement/caseTest.html',
	link: function (scope, element, attrs){

		var menuTitle;

		// RESIZE THE INFO HOLDER WHEN ONE RESIZE WINDOW
		var offset = 350;
		var infoWidth = $("#wrapper").width() - offset;

		$("#test-holder").css('width', infoWidth);

		console.log("FROM TEST DIRECTIVE");
		console.log($("#test-holder").width());

		$rootScope.$on('wrapperWidthChanges', function (event, data) {
			
			$("#test-holder").css('width', data - offset);
			});

		scope.$on('caseMenuSelect', function (event, data) {
			//console.log("FROM CASE TEST");
			element.sectionTitle =  data;
			menuTitle  = data == "caseMenu_pb_active"? data = "Submenu" : data = data;
			scope.$apply(scope.sectionTitle = menuTitle);

			//console.log("FROM MENU CASE TEST DIRECTIVE");
			});
		}
	};
});