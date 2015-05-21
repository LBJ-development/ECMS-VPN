'use strict';

angular.module('ECMSapp.assignCM', [])

.controller('AssignCMCtrl', [ '$scope', 'DataFtry', '$http', '$location', function( $scope, DataFtry, $http, $location){

	console.log("FROM ASSIGN CM");
	console.log($location);

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
								name		: { type: "string", editable: false},
								location	: { type: "string",  editable: false},
								cmGroup	: { type: "string" , editable: false},
								otherGroup	: { type: "string",  editable: false },
								faRegion	: { type: "string",  editable: false },
								foreignLang	: { type: "string",  editable: false },
								ooo		: { type: "string" },
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
		columns		: [{
						field	: "id",
						title	: "Id",
						width	: "5%",
					},{
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

	$scope.todayDate = formatDate();

	//var grid = $("#grid").data("kendoGrid");

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

	// INITIAL DATE RANGE //////////////////////////////////////////////////
	var todayDate		= new Date();
	var dateOffset		= (24*60*60*1000) * 1; //DEFAULT: 1 DAYS 
	var startingDate	= new Date(todayDate.getTime() - dateOffset);
	var endingDate		= todayDate;
	$scope.startingDate	= startingDate;
	$scope.endingDate	= endingDate;
	$scope.isUnassignedCases = 0;
	$scope.submitSearch = 0; //
	$scope.disabled		= true; // DISABLES THE SUBMIT BUTTON
	$scope.datePickerDisable = false; // ENABLES THE DATE PICKER
		
	function formatDate(){
		var date	= new Date().getDate();
		var month	= new Date().getMonth() + 1;
		var year	= new Date().getFullYear();
		return   month  + "/" + date + "/" +  year ;
	}
	function formatStartingDate(){
		var stDate	= $scope.startingDate.getDate();
		var stMonth	= $scope.startingDate.getMonth() + 1;
		var stYear	= $scope.startingDate.getFullYear();
		return stYear + "-" + stMonth  + "-" + stDate;
	}

	function formatEndingDate(){
		var enDate	= $scope.endingDate.getDate();
		var enMonth	= $scope.endingDate.getMonth() + 1;
		var enYear	= $scope.endingDate.getFullYear();
		return enYear + "-" + enMonth  + "-" + enDate;
	}
	
	$scope.assignCM = function(){
		var assignURL = "case:" + $scope.dataItem.caseNumber + "manager:"+ $scope.assignCM.caseManagerId;

		DataFtry.assignCaseManager($scope.dataItem.caseNumber, $scope.assignCM.caseManagerId).then(function(result){
			// console.log("assigned manager successfully:" + assignURL);
			$scope.dataItem.caseManager = $scope.caseManagerName; //"12312";

			console.log($scope.caseManagerName);
			//$scope.reloadData(); //triggering main grid refresh
		});
	};

	$scope.handleRadioSelection = function(ev) {
		$scope.disabled = false;
		ev == 0? $scope.datePickerDisable = false : $scope.datePickerDisable = true;
	};
	
	$scope.enableSumbitBtn = function() {
		$scope.disabled = false;
	};
	
	// WHEN DATE RANGE CHANGES //////////////////////////////////////////////////
	$scope.reloadData = function(){
		    console.log("reloadData");
			$scope.submitSearch++;
	};


	// WATCH FOR A DATE RANGE CHANGE
	$scope.$watch('submitSearch', function(newValue, oldValue) {
		// console.log("Calling submitSearch:" + $scope.submitSearch);
		$scope.mainGridOptions.dataSource.data = [];
		DataFtry.getCasesForAssignment(formatStartingDate(), formatEndingDate(), $scope.isUnassignedCases).then(function(result){
			$scope.mainGridOptions.dataSource.data = result.data.content;
			if(result.data.content.length >= 500){
				$scope.warningClass = "inline-err";
			} else {
				$scope.warningClass = "inline-msg";
			}
			$scope.warning = result.data.messages.RESULTS_LIST;
			$scope.disabled = true;
		});
		//var divgrid = angular.element('#datagrid').data("kendo-grid").dataSource.read(); 
	});
	
	
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
		//height		: 550,
        //dataBound	: onDataBound,
		//toolbar		: ["create"],
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
		/*detailExpand: function(e) {
			this.collapseRow(this.tbody.find(' > tr.k-master-row').not(e.masterRow));
		},*/
		// detailExpand:detailIExpand,
		detailInit: detailInit,
			/*detailInit: function(e) {
			// without this line, detail template bindings will not work
			kendo.bind(e.detailRow, e.data);
		},*/
						
      //dataBound: function() {
                           // this.expandRow(this.tbody.find("tr.k-master-row").first());
                        //},

		columns		: [{
						field	: "caseAlerts",
						title	: "Alerts",
						width	: "10%"
						},{
						field	: "caseSource",
						title	: "Source",
						width	: "15%",
						filterable: {
							ui			: caseSourceFilter,
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
						width	: "20%"
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
					{ field: "incidentState", title: "Inc. State", width: "45px" },
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
		bool	= ["Yes", "No"],
		status	= ["Active", "Recovered", "Closed"],
		types	= ["ERU", "FA", "NFA", "LIM", "5779", "UHR", "DECC", "RCST", "ATT", "UMR"],
		caseSources	= ["Call", "Email", "Internet", "WebService", "Online Sighting Form"],
		states	= ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
		
	function typeFilter(element) {
		//element.kendoMultiSelect({
		element.kendoDropDownList({
			dataSource: types,
			//multiple: "multiple",
			optionLabel: "--Select Value--"
		});
	}
		
	function victimFilter(element) {
		element.kendoDropDownList({
			dataSource: victim,
			optionLabel: "--Select Value--"
		});
	}
		
	function caseSourceFilter(element) {
		element.kendoDropDownList({
			dataSource: caseSources,
			optionLabel: "--Select Value--"
		});
	}

	function boolFilter(element) {
		element.kendoDropDownList({
			dataSource: bool,
			optionLabel: "--Select Value--"
		});
	}

	function stateFilter(element) {
		element.kendoDropDownList({
			dataSource: states,
			optionLabel: "--Select Value--"
		});
	}

}])

// DIRECTVE FOR THE DETAIL ROW ///////////////////////////////////////
.directive ('detailRow', ['DataFtry', '$http', function (DataFtry, $http) {
	return {
	restrict: 'E',
	// scope :{},
	controller: 'AssignCMCtrl',
	templateUrl: 'components/caseAdministration/detailRow.html',
	link: function (scope, element, attrs){

		// GET THE GROUP LIST 
		$http.get( "/rest/casemanager/groups/list/all")
			.success( function(result) {
				scope.acmGroupSource = result.content;
				scope.disableCaseMgrBtnFlag = true;

				console.log("FROM GET MANAGER GROUP");
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

							return dataItem.name === scope.caseManager;
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
			console.log("FROM SELELCT MANAGER");
			scope.caseManagerName = ev.item.text();
			scope.disableCaseMgrBtnFlag = false;
		// console.log($scope.caseManagerName);
			};

		}
	};
}]);




