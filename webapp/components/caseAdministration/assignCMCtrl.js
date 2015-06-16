'use strict';

angular.module('ECMSapp.assignCM', [])

.controller('AssignCMCtrl', [ '$scope', 'DataFtry', '$http', '$location', '$interval', function( $scope, DataFtry, $http, $location, $interval){

	// INIT STATES /////////////////////////////////////////////////
	$scope.init = function (){
		// WAIT UNTIL THE GRID BECOMES AVAILABLE
		var delay = $interval(function(){
			if($("#grid").data("kendoGrid")) {
				
				$interval.cancel(delay);
				// IF THERE IS A PREVIOUS STATE FETCH IT
				if(sessionStorage.optionsToSave){

					var savedOptions =  JSON.parse(sessionStorage.getItem('optionsToSave'));
					var grid = $("#grid").data("kendoGrid");

					grid.setOptions(JSON.parse(savedOptions.gridOptions));
					$scope.startingDate = new Date(savedOptions.startingDate);
					$scope.endingDate = new Date(savedOptions.endingDate);
					$("#radioBtn-RDR").prop("checked", savedOptions.radioBtnRDR);
					$("#radioBtn-UAC").prop("checked", savedOptions.radioBtnUAC);
					$scope.submitDisabled = savedOptions.submitDisabled;
					$scope.datePickerDisabled = savedOptions.datePickerDisabled;
					$scope.warning = savedOptions.warningMessage;
					$scope.warningClass = savedOptions.warningClass;
					//$scope.$digest();
				// IF ITS A NEW SESSION LOAD THE DATA
				} else {
					$scope.reloadData();
				}
			}
		}, 200);
		// SAVE THE CURRENT STATES WHEN NAVIGATING AWAY FORM THE PAGE 
		$scope.$on('$locationChangeStart', function (event, next, current) {
		
			var grid = $("#grid").data("kendoGrid");

			var optionsToSave = {
				"gridOptions"		: kendo.stringify(grid.getOptions()),
				"startingDate"		: $scope.startingDate,
				"endingDate"		: $scope.endingDate,
				"radioBtnRDR"	: $("#radioBtn-RDR").is(":checked"),
				"radioBtnUAC"	: $("#radioBtn-UAC").is(":checked"),
				"submitDisabled"	: $scope.submitDisabled,
				"datePickerDisabled"	: $scope.datePickerDisabled,
				"warningMessage"	: $scope.warning,
				"warningClass"	: $scope.warningClass
			};
			sessionStorage.setItem('optionsToSave', JSON.stringify(optionsToSave));
		});

		$scope.searchCriteria = {
			startDate: null,
			endDate: null,
			isUnassignedCases: null
		};
	}

	// SELECT A CASE AND REDIRECT TO THE CASE MANAGMENT //////////////////////////////////////////////////
	$scope.selectCase = function(e){
		
		// OPEN A CASE IN THE CASE MANAGEMENT SECTION
		 $location.path('/casemanagement');
	};

	$scope.dawsGridOptions =  { 
		dataSource: {
			data: result,
				schema: {
					model: {
						fields: {
								id			: { type: "integer", editable: false},
								name		: { type: "string",  editable: false},
								location	: { type: "string",  editable: false},
								cmGroup		: { type: "string",  editable: false},
								otherGroup	: { type: "string",  editable: false },
								faRegion	: { type: "string",  editable: false },
								foreignLang	: { type: "string",  editable: false },
								ooo			: { type: "string" },
								onCall		: { type: "string" },
								shift		: { type: "string" },
								telecommute	: { type: "string" }
								},
							}
						},
					},
		sortable	: true,
		scrollable	: true,
		height 		: "83%",
		editable	: true,
		columns		: [
					/*{
						field	: "id",
						title	: "Id",
						width	: "5%",
					},*/
					{
						field	: "name",
						title	: "Name",
						width	: "15%",
					},{
						field	: "location",
						title	: "Loc.",
						width	: "6%"
					},{	
						field	: "cmGroup",
						title	: "CM Grp.",
						width	: "7%"
					},{
						field	: "otherGroup",
						title	: "Other",
						width	: "6%"
					},{
						field	: "faRegion",
						title	: "FA Region",
						width	: "10%"
					},{
						field	: "foreignLang",
						title	: "Language(s)",
						width	: "10%"
					},{
						field	: "ooo",
						title	: "OOO",
						width	: "6%",
						editor: categoryDropDownEditor,
					},{
						field	: "onCall",
						title	: "On-call",
						width	: "6%",
						editor: categoryDropDownEditor,
					},{
						field	: "shift",
						title	: "Shift hrs",
						width	: "17%"
					},{
						field	: "telecommute",
						title	:"Telecom.",
						width	: "7%",
						editor: categoryDropDownEditor,
					} ]
				};

	function categoryDropDownEditor(container, options) {
		 $('<input required data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"/>')
		.appendTo(container)
		.kendoDropDownList({
			autoBind: false,
			dataSource: {
				data :  [
					{ text: "Yes", value: "Yes" },
					{ text: "No", value: "No" }
					],
				}
			});
		}
	
	$scope.modifiedSchedules = {};
	$scope.trackChanges = function(e) {
        //console.log("inside save");
		//console.log("values string:" + JSON.stringify(e.values) +" model string:" + JSON.stringify(e.model));
		
		//Find if row is modified already for another field
		var schedule = $scope.modifiedSchedules[e.model.id] ? $scope.modifiedSchedules[e.model.id] : {'id': e.model.id};
		
		// push the user changed field and value into the map
		if (e.values.ooo) {
			// console.log("ooo modified:"+ e.values.ooo);
			schedule['ooo'] = (e.values.ooo === 'Yes'?1:0);
        }
		
		if (e.values.onCall) {
			schedule['onCall'] = (e.values.onCall === 'Yes'?1:0);
        }
		
		if (e.values.telecommute) {
			schedule['telecommute'] = (e.values.telecommute === 'Yes'?1:0);
        }

		if (e.values.shift) {
			schedule['shift'] = e.values.shift;
        }
		$scope.modifiedSchedules[e.model.id] = schedule;
		
		//console.log("modified schedules:" + JSON.stringify($scope.modifiedSchedules) );                        
    };

    // DAILY ASSIGNMENT WORKSHEET WINDOW //////////////////////////////////////////////////
	$scope.dawsOptions = {
		width: "80%",
		visible: false,
		maxWidth: 1400,
		height: "80%",
		modal: true,
		// title: "Daily Assignment Worksheet",
		open: getDAWSdata
		// position: {
		// top: 400,
		// left: "center"
		// },
	};

	function getDAWSdata(){

		var url = "/rest/casemanager/worksheet/current";

		DataFtry.getData(url).then(function(result){

			$scope.dawsGridOptions.dataSource.data = result.data.content;

			localStorage["kendo-grid-data"] = kendo.stringify(result.data.content);
			console.log(localStorage);
		});
	};
	
	$scope.saveScheduleUpdates = function() {
		var scheduleUpdatesAsArray = new Array();
		for (var id in $scope.modifiedSchedules) {
			// console.log("id:" + id);
			// console.log(JSON.stringify($scope.modifiedSchedules[id]));
			scheduleUpdatesAsArray.push($scope.modifiedSchedules[id]);
		}
		// console.log("schedules input for URL:" + JSON.stringify(scheduleUpdatesAsArray) );
		DataFtry.submitUpdatedSchedules(scheduleUpdatesAsArray);
	}
	
	$scope.saveAndCloseScheduleUpdates = function() {
		$scope.saveScheduleUpdates();
		// console.log("saveAndCloseScheduleUpdates");
		$("#dawsWin").data("kendoWindow").close();
		// console.log("saveAndCloseScheduleUpdates done");
	}

	$scope.cancelDAWSChanges = function() {
		
		var dawsData = localStorage["kendo-grid-data"];

		console.log(dawsData);

		if (dawsData) {
			$scope.dawsGridOptions.dataSource.data = dawsData;
			$("#dawsWin").data("kendoWindow").close();
                        }
	}
		
	$scope.assignMessage = "";
	$scope.assignCM = function(){
		var assignURL = "case:" + $scope.dataItem.caseNumber + "manager:"+ $scope.assignCM.caseManagerId;

		DataFtry.assignCaseManager($scope.dataItem.caseNumber, $scope.assignCM.caseManagerId).then(function(result){
			
			//Handle the result
			if (result.status==200 && result.data.status == 'SUCCESS') {
				$scope.assignMessage = "Successfully assigned to " + $scope.caseManagerName + ".";
				$scope.warningClass = "inline-msg";
			} else {
				$scope.assignMessage = "Unable to assign " + $scope.caseManagerName + ". Please retry"
				$scope.warningClass = "inline-err";
			}

			// console.log("assigned manager successfully:" + assignURL);
			$scope.dataItem.caseManager = $scope.caseManagerName; //"12312";
			if ($.inArray($scope.dataItem.caseManager, $scope.filterCaseManagerList) < 0) {
				$scope.filterCaseManagerList.push($scope.dataItem.caseManager);
			}
			//console.log($scope.caseManagerName);
		});
	};

	$scope.handleRadioSelection = function(ev) {
		$scope.submitDisabled = false;
		ev == 0? $scope.datePickerDisabled = false : $scope.datePickerDisabled = true;
		//ev == 0? dateRange.enable(true) : dateRange.enable(false);
	};

	$scope.filterSourcesList = [];
	$scope.filterCaseTypeList = [];
	$scope.filterCaseManagerList = [];
	
	var tempSource = "";
	var tempCaseType= "";
	var tempCaseManager;

	// USING THE DATE RANGE WIDGET //////////////////////////////
	/*var dateRangeHolder = $("#dateRangeHolder"); // HTML ELEMENT HOLDING THE DATE RANGE
	var dateRangeValue = 1; // DATE RANGE VALUE IN NUMBER OF DAYS
	var dateRange = new DateRange(dateRangeHolder, dateRangeValue);
	dateRange.enable(true);
	$(dateRange).bind("dateRangeHasChanged", function(ev, startingDate, endingDate){
		$scope.submitDisabled = false;
		$scope.$digest();
		//console.log("FROM DATE CHANGE! :" + startingDate + " / " + endingDate);
	});*/
	$scope.isUnassignedCases = 0;
	//$scope.submitSearch = 0; //
	$scope.submitDisabled		= true; // DISABLES THE SUBMIT BUTTON
	$scope.datePickerDisabled = false; // ENABLES THE DATE PICKER

	$scope.reloadData = function(){
	//$scope.$watch('submitSearch', function(newValue, oldValue) {
		
		$scope.mainGridOptions.dataSource.data = [];

		$scope.searchCriteria.startDate 	= $scope.formatStartingDate();
		$scope.searchCriteria.endDate 	= $scope.formatEndingDate();
		$scope.searchCriteria.isUnassignedCases = $scope.isUnassignedCases;

		// GET CASES FROM ANGULARJS DIRECTIVE WIDGET //////////////////////////////////
		DataFtry.getCasesForAssignment($scope.searchCriteria).then(function(result){
		// GET CASES FROM JAVASCRIPT OBJECT WIDGET //////////////////////////////////
		//DataFtry.getCasesForAssignment(dateRange.formatStartingDate(), dateRange.formatEndingDate(), $scope.isUnassignedCases).then(function(result){
			$scope.mainGridOptions.dataSource.data = result.data.content;
			
			//console.log(result.data.content);
			$.each(result.data.content, function(idx, currentCase){ 
				
					//source filter
					tempSource 	= currentCase['caseSource'];
					if ('undefined' != typeof tempSource ) {
						//console.log('adding '+ tempSource);
						if ($.inArray(tempSource, $scope.filterSourcesList) < 0) {
							$scope.filterSourcesList.push(tempSource);
						}
					}
					
					//type filter
					tempCaseType	= currentCase['caseTypeAbbr'];
					if ('undefined' != typeof tempCaseType ) {
						//console.log('adding '+ tempCaseType);
						if ($.inArray(tempCaseType, $scope.filterCaseTypeList) < 0) {
							$scope.filterCaseTypeList.push(tempCaseType);
						}
					}

					//assignee list caseManager=(null)
					tempCaseManager	= currentCase['caseManager'];
					if ('undefined' != typeof tempCaseManager ) {
						//console.log('adding '+ tempCaseManager);
						if ($.inArray(tempCaseManager, $scope.filterCaseManagerList) < 0) {
							$scope.filterCaseManagerList.push(tempCaseManager);
						}
					}

			});
			
			if(result.data.content.length >= 500){
				$scope.warningClass = "inline-err";
			} else {
				$scope.warningClass = "inline-msg";
			}
			$scope.warning = result.data.messages.RESULTS_LIST;
			$scope.submitDisabled = true;
		});
		//var divgrid = angular.element('#datagrid').data("kendo-grid").dataSource.read(); 
	};
	
    // MAIN GRID SETTINGS //////////////////////////////////////////////////////////////////////////////////////	
	var result = {};
	
	$scope.mainGridOptions =  {
		 
		dataSource: {
			data: result,
				schema: {
					model: {
						fields: {
								caseAlerts			: { type: "string" },
								caseNumber			: { type: "string" },
								caseSource			: { type: "string" },
								caseTypeAbbr		: { type: "string" },
								caseChildrenCount	: { type: "number" },
								caseDateTimeReceived: { type: "date"	},
								caseIncidentDate	: { type: "date"	},
								caseManager			: { type: "string" },
								selectedID			: {editable: false, nullable: true }
								},
							}
						},
					},
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
								//neq		: "Not equal to",
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
						refresh: false,
						pageSizes: true,
						buttonCount: 5,
						pageSize: 15
                        },
		detailTemplate: kendo.template($("#detail-template").html()),
		detailInit: detailInit,
		columns		: [{
						field	: "caseAlerts",
						title	: "Alerts",
						width	: "10%"
						},{
						field	: "caseSource",
						title	: "Source",
						width	: "15%",
						filterable: {
							ui			: sourceFilter,
							operators	: {
								string	: {
								eq		: "Equal to",
									}
								}
							}
						},{
							
						field	: "caseNumber",
						title	: "Case",
						template: "<a href='' ng-click='selectCase($event)' class='baseLinkText' >#=caseNumber#</a>",
						width	: "15%"
						},
						{
						field	: "caseDateTimeReceived",
						title	: "Date Rcvd.",
						format	:"{0:MM/dd/yyyy}" ,
						width	: "15%",
						filterable: false,
						},{
						
						field	: "caseTypeAbbr",
						title	: "Type",
						width	: "5%",
						filterable: {
							ui			: typeFilter,
							operators	: {
								string	: {
								eq		: "Equal to",
									}
								}
							}
						},{
						field	: "caseChildrenCount",
						title	: "# of Vict.",
						width	: "5%",
						filterable: {
							ui			: victimFilter,
							operators	: {
								number	: {
								eq		: "Equal to",
								neq		: "Not equal to",
								gte		: "Greater or equal to",
								gt		: "Greater than",
								lte		: "Less or equal to",
								lt		: "Less than"
									}
								}
							}
						},{
						field	: "caseIncidentDate",
						title	: "Incid. Date",
						format	:"{0:MM/dd/yyyy}" ,
						width	: "15%"
						},{
						field	: "caseManager",
						title	: "Assignee",
						width	: "20%",
						filterable: {
							ui			: caseManagerFilter,
							operators	: {
								string	: {
								eq		: "Equal to"
									}
								}
							}
						}]
				};
			
	// GRID DETAIL SETTINGS /////////////////////////////////////////////////////////////////////////////////////

	function detailInit(e) {
		/*var grid = e.detailRow.find("[data-role=grid]").data("kendoGrid");
		grid.dataSource.read();*/

		var detailRow = e.detailRow;
			kendo.bind(detailRow, e.data);
		// console.log(grid.tbody.find("tr.k-master-row").first());
		// console.log(e.data.caseManager);

		var caseNumber = e.data.caseNumber;
		var caseManager = e.data.caseManager;
		$scope.caseManager = e.data.caseManager;

		$scope.urlDetail = "/rest/caseadmin/incidentDetails?caseNumber=" + caseNumber;
		DataFtry.getData($scope.urlDetail).then(function(result){

			getNarrative(e, caseNumber, caseManager);

			detailRow.find("#gridDetail-CM").kendoGrid({

				dataSource:{
						data: result.data.content,	
							},
				scrollable: false,
				sortable: false,
				pageable: false,
				columns: [
					{ field: "childRecoveryStatus", title: "Recovery Status", width: "12%" },
					{ field: "incidentType", title: "Child Case Type", width: "17%" },
					{ field: "incidentState", title: "Incd. State", width: "45px" },
					{ field: "parentRelationship", title: "P/G Relationship", width: "15%" },
					{ field: "foreignLanguage", title: "Foreign Lang.", width: "10%" },
					{ field: "childName", title:"Child Name", width: "20%" },
					{ field: "childAge", title:"Child Age", width: "45px" },
					{ field: "criticalEndangerements", title: "Endangerments", width: "20%" }
					]
				});
			});
		}

	function getNarrative(e, caseNumber, caseManager){

		var detailRow = e.detailRow;
		kendo.bind(detailRow, e.data);

		var grid = {};
		$scope.urlNarrative = "/rest/caseadmin/narratives?caseNumber=" + caseNumber;
		DataFtry.getData($scope.urlNarrative).then(function(result){

			console.log("FROM NARRATIVE");
			console.log(result.data.content);


			grid = detailRow.find("#narrative-CM").kendoGrid({

				dataSource:{
						data: result.data.content,
						pageSize: 1

						},
				scrollable: false,
				sortable: false,
				pageable: true,
				height	: 300,

				rowTemplate: kendo.template($("#row-template").html()),
				//dataBound: changeNarrative,
				// toolbar: kendo.template($("#toolbar-template").html()),
				columns: [
					{ field: "", width: "100%" , height: "100%",

					headerAttributes: {
						style: "display: none"
							}
						},
					]
				});
			// getCaseManagers(caseManager);
		});
	}
	
	// FILTERING WITH DROPDOWN MENU 
	var victim	= ["1", "2", "3", "4", "5", "6"],
		bool	= ["Yes", "No"];
		
	function typeFilter(element) {
		//element.kendoMultiSelect({
		element.kendoDropDownList({
			dataSource: $scope.filterCaseTypeList.sort(),
			//multiple: "multiple",
			optionLabel: "--Select Value--"
		});
	}
	
	function sourceFilter(element) {
		element.kendoDropDownList({
			dataSource: $scope.filterSourcesList.sort(),
			optionLabel: "--Select Value--"
		});
	}		
	
	function caseManagerFilter(element) {
		element.kendoDropDownList({
			dataSource: $scope.filterCaseManagerList.sort(),
			optionLabel: "--Select Value--"
		});
	}

	function victimFilter(element) {
		element.kendoDropDownList({
			dataSource: victim,
			optionLabel: "--Select Value--"
		});
	}
	function boolFilter(element) {
		element.kendoDropDownList({
			dataSource: bool,
			optionLabel: "--Select Value--"
		});
	}

}])

// DIRECTVE FOR THE DETAIL ROW ///////////////////////////////////////
.directive ('detailRow', ['DataFtry', '$http', function (DataFtry, $http) {
	return {
	restrict: 'E',
	//scope :{},
	controller: 'AssignCMCtrl',
	templateUrl: 'components/caseAdministration/detailRow.html',
	link: function (scope, element, attrs){

		// GET THE GROUP LIST 
		$http.get( "/rest/casemanager/groups/list/all")
			.success( function(result) {
				scope.acmGroupSource = result.content;
				scope.disableCaseMgrBtnFlag = true;

				//console.log("FROM GET MANAGER GROUP");
			});

		// GET CASE MANAGERS LIST 
		$http.get( "/rest/casemanager/list/all")
			.success( function(result) {
				scope.acmCMSource = result.content;

				setTimeout(function(){

					if(scope.caseManagersList ){

						scope.caseManagersList.dataSource.read();

						scope.caseManagersList.select(function(dataItem) {

							//console.log("FROM CASE MANAGER LIST: " + dataItem.name + " / " + scope.caseManager + "ARE THEY THE SAME? " + (dataItem.name == scope.caseManager));

							// console.log(dataItem.name == scope.caseManager);

							return dataItem.name.trim() === scope.caseManager.trim();
						});
					}
				}, 500);
			});

		//SELECT MANAGER GROUP ///////////////////////////////
		scope.selectMgrGroup = function(ev) {

			// scope.urlCMsForGroup = "/rest/casemanager/list/group/";

			var URL;

			if(ev.item.text() == "Select Group") {
				URL = "/rest/casemanager/list/all";
			} else {
				URL = "/rest/casemanager/list/group/" + ev.item.text();
			}

			DataFtry.getData(URL).then(function(result){

				console.log("FROM SELECT MANAGER GROUP");

				scope.disableCaseMgrBtnFlag = true;

				scope.acmCMSource = result.data.content;

				});
			};

		//SELECT CASE MANAGER ///////////////////////////////
		scope.selectManager = function(ev) {
			//console.log("FROM SELELCT MANAGER");
			scope.caseManagerName = ev.item.text();
			scope.disableCaseMgrBtnFlag = false;
		// console.log($scope.caseManagerName);
			};

		}
	};
}]);




