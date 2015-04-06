'use strict';

angular.module('ECMSapp.adminMain', ['ngRoute'])

// SERVICE DATA FOR TESTING PURPOSE -- RETURN AN INSTANCE OF THE FUNCTION
.service("dataSvrc" ,function(){
	this.getData = function(num){
		var data = generateCaseAdminData(num);
		return data;	
	}
	return this;
})

// FACTORY DATA FOR TESTING PURPOSE -- RETURN A RESULT 
.factory("dataFtry", function($http){
	return{
		getData: function(){
			console.log("FROM FACTORY");
			var srvc ="http://cc-devapp1.ncmecad.net:8080/ecms-prod/rest/caseadmin/cases?startDate=2015-02-18&endDate=2015-02-19";
			var $promise = $http.get(srvc);
			
			$promise.then(function(result){
				console.log("SUCCESS" + result);
				/*console.log(result.status);
				console.log(result.data.status);
				if(result.data.status == 'SUCCESS'){
					$scope.errormessage='';
					$rootScope.usernameScope = credentials['username']; // display the user name
					$location.path('/home'); // redirect to the home page
				} else {
					//$scope.errormessage		= result.data.messages[0] + "!";
					//$scope.errormessage		= result.data + "!";
					$scope.errormessage			= "Incorrect Information, please try again!";
					$scope.errormessageclass	= 'errorMessageOn';	
					$location.path('/home');
					
				};*/
			})
		}
	}
})

.controller("DatePickerCtrl",['$rootScope','$scope',  function($rootScope, $scope){
	var todayDate 		= new Date();
	var dateOffset 		= (24*60*60*1000) * 2; //DEFAULT: 2 DAYS 
	var startingDate 	= new Date(todayDate.getTime() - dateOffset);
	var endingDate 		= todayDate;

	$scope.startingDate	= startingDate;
	$scope.endingDate	= endingDate;
	$rootScope.numRecords	= 33*2; // 33 RECORDS/DAY

	$rootScope.changeDateRange = function(){
		
		var numDays = ($scope.endingDate - $scope.startingDate) / 86400000;
		var numRecords = 33 * numDays; // 33 RECORDS/DAY
		$rootScope.numRecords = numRecords;
		//console.log("FROM DATEPICKERCTRL: " + dataSvrc.getData(numRecords));
	}
}])

.controller("CaseAdminCtrl",['$rootScope', '$scope', 'dataSvrc', function($rootScope, $scope, dataSvrc){
//.controller("CaseAdminCtrl",['$rootScope', '$scope', 'dataFtry', function($rootScope, $scope, dataFtry){
	
	var caseAdminData = dataSvrc.getData($rootScope.numRecords);
	//var caseAdminData = dataFtry.getData();
	
	// WATCH FOR A DATE RANGE CHANGE
	$rootScope.$watch('numRecords', function(newValue, oldValue) {
		
			caseAdminData = dataSvrc.getData(newValue);
			$scope.mainGridOptions.dataSource.data = caseAdminData;
			console.log($scope.mainGridOptions.dataSource.data);
	});

	$scope.mainGridOptions =  {
		 
		dataSource: {
			data: caseAdminData,
			    schema: {
					model: {
						fields: {
								cases			: { type: "string" },
								receivedDate	: { type: "date" },
								incidentDate	: { type: "date" },
								source			: { type: "string" },
								caseType		: { type: "string" },
								caseStatus		: { type: "string" },
								numVictims		: { type: "string" },
								endangerment	: { type: "string" },
								alerts			: { type: "string" },
								state			: { type: "string" },
								division		: { type: "string" },
								assignee		: { type: "string" },
								selected		: { type: "boolean" }
								}
							}
						},
					},
		//height		: 550,
		sortable	: true,
		scrollable	: false,
		filterable	: {
					mode		: "menu",
    				extra		: false,
					messages	: {
      					info		: "Filter by:",
						selectValue	: "Select category",
						isTrue		: "selected",
						isFalse		: "not selected"
							},
					operators	: {
      						string	: {
        						eq			: "Equal to",
        						//neq			: "Not equal to",
								contains	: "Contains",
								startswith	: "Starts with",
								endswith	: "Ends with"
      							},
							number	: {
								eq			: "Equal to",
								},
							date	: {
								gt			: "After",
       					 		lt			: "Before"
								}
							}
  						},
		pageable	: {
                     	refresh: true,
                      	pageSizes: true,
                     	buttonCount: 5,
						pageSize: 15
                        },
						
		/*columnMenu: {
   			messages	: {
      			columns			: "Choose columns",
      			filter			: "Apply filter",
      			sortAscending	: "Sort (asc)",
      			sortDescending	: "Sort (desc)"
							}
    				},*/
		columns		: [{
						field	: "cases",
						title	: "RFS/Case",
						width	: "8%",
						attributes: {
      						//style: "text-align: center"
    						}
						},{
						field	: "receivedDate",
						title	: "Date Rcvd",
            			format	:"{0:MM/dd/yyyy}" ,
						width	: "9%"
						},{
						field	: "incidentDate",
						title	: "Incid. Date",
						format	:"{0:MM/dd/yyyy}" ,
						width	: "9%"
						},{
						field	: "source",
						title	: "Source",
						width	: "6%"
						},{
						field	: "caseType",
						title	: "Case Type",
						width	: "9%"
						},{
						field	: "caseStatus",
						title	: "Case Status",
						width	: "9%",
						},{
						field	: "numVictims",
						title	: "# Vic.",
						filterable: false,
						width	: "5%"
						},{
						field	: "endangerment",
						title	: "Endg.",
						filterable: false,
						width	: "5%"
						},{
						field	: "alerts",
						title	: "Alerts",
						width	: "8%"
						},{
						field	: "state",
						title	: "State",
						filterable: false,
						width	: "5%"
						},{
						field	: "division",
						title	: "Div",
						filterable: false,
						width	: "8%"
						},{
						field	: "assignee",
						title	: "Assignee",
						width	: "14%"
						},{
						field	: "selected",
						title	: "Sel.",
						width	: "5%",
						filterable: false,
						template: "<input type='checkbox'/>",
						attributes: {
      						style: "text-align: center"
    					}
                	}]
				};
	
}])