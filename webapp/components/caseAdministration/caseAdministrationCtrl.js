'use strict';

angular.module('ECMSapp.adminMain', [])

.controller('MainCaseAdminCtrl', ['$rootScope', '$scope', 'ECMSConfig', 'StorageService', 'DataFtry', 'ECMSGrid', '$http', '$location', '$interval', function($rootScope, $scope, ECMSConfig, StorageService, DataFtry, ECMSGrid, $http, $location, $interval){
	
	$scope.checkedIds =[];

	$scope.init = function (){

		// WAIT UNTIL THE GRID BECOMES AVAILABLE
		var delay = $interval(function(){

			if($("#grid").data("kendoGrid")) {
				
				$interval.cancel(delay);

				// IF THERE IS A PREVIOUS STATE FETCH IT
				if(sessionStorage.OTSCA){

					var savedOptions =  JSON.parse(sessionStorage.getItem('OTSCA'));
					var grid = $("#grid").data("kendoGrid");

					grid.setOptions(JSON.parse(savedOptions.gridOptions));
					$scope.startingDate = new Date(savedOptions.startingDate);
					$scope.endingDate = new Date(savedOptions.endingDate);
					
					$scope.submitDisabled = savedOptions.submitDisabled;
					$scope.datePickerDisabled = savedOptions.datePickerDisabled;
					$scope.warning = savedOptions.warningMessage;
					$scope.warningClass = savedOptions.warningClass;

					ECMSGrid.reselectItems(grid, savedOptions.selectedIds);

					//$scope.$digest();

					//ECMSGrid.buildDynamicFilters(['caseSource'], savedOptions.searchResult);

				// IF ITS A NEW SESSION LOAD THE DATA
				} else {
					 console.log("FROM INIT B")

					$scope.reloadData();
				}
			}
		}, 200);
		// SAVE THE CURRENT STATES WHEN NAVIGATING AWAY FORM THE PAGE 
		$scope.$on('$locationChangeStart', function (event, next, current) {

			console.log("FROM LOCATION CHANGE: ");
			console.log($scope);
		
			var grid = $("#grid").data("kendoGrid");

			var OTSCA = {
				"gridOptions"		: kendo.stringify(grid.getOptions()),
				"startingDate"		: $scope.startingDate,
				"endingDate"		: $scope.endingDate,
				
				"submitDisabled"	: $scope.submitDisabled,
				"datePickerDisabled": $scope.datePickerDisabled,
				"warningMessage"	: $scope.warning,
				"warningClass"		: $scope.warningClass,
				"searchResult"		: $scope.searchResult,
				"selectedIds"		: $scope.checkedIds
			};
			sessionStorage.setItem('OTSCA', JSON.stringify(OTSCA));
		});

		$scope.searchCriteria = {
			startDate: null,
			endDate: null,
			rfsPrimaryType: "-1", //set default value to ALL for drop-down list
			rfsSource: "-1", //set default value to ALL for drop-down list
			rfsStatus: "-1" //set default value to ALL for drop-down list
		};

		$http.get("/rest/common/lookup?lookupName=rfsSource")
		.success( function(result) {
			$scope.rfsSourceDataSource = result.content;
			});
			 
		$http.get("/rest/common/lookup?lookupName=rfsPrimaryType")
		.success( function(result) {
			$scope.rfsPrimaryTypeDataSource = result.content;
			});
	
		$http.get("/rest/common/lookup?lookupName=rfsStatus")
		.success( function(result) {
			$scope.rfsStatusDataSource = result.content;
		});
	};

	var result = {};

	$scope.reloadData = function(){

		console.log("FROM RELOAD DATA")

		$scope.mainGridOptions.dataSource.data = [];

		$scope.searchCriteria.startDate 		= $scope.formatStartingDate();
		$scope.searchCriteria.endDate 			= $scope.formatEndingDate();
		$scope.searchCriteria.rfsPrimaryType 	= $scope.searchCriteria.rfsPrimaryType.toString();
		$scope.searchCriteria.rfsSource 		= $scope.searchCriteria.rfsSource.toString();
		$scope.searchCriteria.rfsStatus 		= $scope.searchCriteria.rfsStatus.toString();

		DataFtry.getRFSes($scope.searchCriteria).then(function(result){

			//console.log(result.data.content);
			ECMSGrid.buildDynamicFilters(['rfsSource' , 'rfsTypeDisplay', 'rfsIncidentState', 'rfsStatus', 'caseManager'], result.data.content );
			
			$scope.mainGridOptions.dataSource.data = result.data.content;

			if(result.data.content.length >= 500){
				$scope.warningClass = "inline-err";
			} else {
				$scope.warningClass = "inline-msg";
			}
			$scope.warning = result.data.messages.RESULTS_LIST;
			$scope.submitDisabled = true;

		});
	};
	
	// MAKE THE CHECK BOX PERSISTING
	ECMSGrid.init($scope.checkedIds);
	$scope.caseSelected = ECMSGrid.caseSelected;
	$scope.toggleSelectAll =  ECMSGrid.toggleSelectAll;
	
	// DISABLE/ENABLE BUTTON WHEN CASE ARE SELECTED /////////////
	$scope.buttonDisabledClass = "linkButtonDisabled"
	$scope.$watch('checkedIds.length', function() {
		//console.log($scope.checkedIds.length);
		$scope.checkedIds.length == 0? $scope.buttonDisabledClass = "linkButtonDisabled" : $scope.buttonDisabledClass = ""
	});
	
	// GRID SETTINGS 
	$scope.mainGridOptions =  {
		 
		dataSource: {
			data: result,
			schema: {
					model: {
						fields: {
								rfsAlerts				: { type: "string"},
								rfsDateTimeReceived     : { type: "date"  },
								rfsNumberDisplay		: { type: "string"},
								rfsNumber				: { type: "string"},
								caseNumberDisplay		: { type: "string"},
								caseNumber				: { type: "string"},
								rfsSource				: { type: "string"},
								rfsTypeDisplay			: { type: "string"},
								rfsPrimaryType			: { type: "string"},
								rfsSecondaryType		: { type: "string"},
								rfsStatus				: { type: "string"},
								rfsIncidentDate			: { type: "date"  },
								rfsIncidentState		: { type: "string"},
								caseManager				: { type: "string"}
							}
						}
					}
				},
		//height		: 550,
        dataBound	: onDataBound,
		//toolbar		: ["create"],
		sortable	: true,
		reorderable : true,
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
		columns		: [{
						field	: "rfsAlerts",
						title	: "Alerts",
						width	: "8%"
						},{
						field	: "rfsDateTimeReceived",
						title	: "Date Rcvd.",
						format	:"{0:MM/dd/yyyy}" ,
						width	: "9%",
						filterable: false,
						},{
						field	: "rfsNumber",
						title	: "RFS",
						width	: "8%"
						},{
						field	: "caseNumber",
						title	: "Case",
						width	: "8%"
						},{
						field	: "rfsSource",
						title	: "Source",
						width	: "6%"
						,
						filterable: {
							ui			: sourceFilter,
							operators	: {
								string	: {
								eq		: "Equal to",
									}
								}
							}
						},{
						field	: "rfsTypeDisplay",
						title	: "RFS Type",
						width	: "9%",
						filterable: {
							ui			: typeFilter,
							operators	: {
								string	: {
								eq		: "Equal to",
									}
								}
							}
						},{
						field	: "rfsStatus",
						title	: "RFS Status",
						width	: "9%",
						filterable: {
							ui			: statusFilter,
							operators	: {
									string	: {
									eq		: "Equal to",
											}
										}
									}
						},{
						field	: "rfsIncidentDate",
						title	: "Incid. Date",
						format	:"{0:MM/dd/yyyy}" ,
						width	: "9%"
						},{
						field	: "rfsIncidentState",
						title	: "State",
						width	: "5%",
						filterable: {
							ui			: stateFilter,
							operators	: {
								string	: {
								eq		: "Equal to"
									}
								}
							}
						},{
							
						field	: "caseManager",
						title	: "Assignee",
						width	: "14%",
						filterable: {
							ui			: caseManagerFilter,
							operators	: {
								string	: {
								eq		: "Equal to"
									}
								}
							}
						},{
						width	: "2%",
						filterable: false,
						sortable: false,
						template: "<input type='checkbox' ng-model='dataItem.selected' ng-click='caseSelected($event)' />",
						title: "<input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)'/>",
						attributes: {
							style: "text-align: center"
							}
						}]
		};

	// ON DATABOUND EVENT (WHEN PAGING) RESTORE PREVIOUSLY SELECTED ROWS
	function onDataBound(e) {

		var view = this.dataSource.view();
		for(var i = 0; i < view.length;i++){
			if($scope.checkedIds[view[i].rfsNumber]){
				this.tbody.find("tr[data-uid='" + view[i].uid + "']")
				//.addClass("k-state-selected")
                .find(".checkbox")
                .attr("checked","checked");
            }
        }
	}
		
	// FILTERING WITH DROPDOWN MENU 
	var victim	= ["1", "2", "3", "4", "5", "6"],
		bool	= ["Yes", "No"];

	function typeFilter(element) {
		ECMSGrid.multiSelectFilter(element, 'rfsTypeDisplay', 'Select RFS Type(s) you want to filter on:');
	}
	
	function sourceFilter(element) {
		console.log("FROM SOURCE FILTER:");
		console.log(element);
		ECMSGrid.multiSelectFilter(element, 'rfsSource', 'Select RFS Source(s) you want to filter on:');
	}
	
	function stateFilter(element) {
		ECMSGrid.multiSelectFilter(element, 'rfsIncidentState', 'Select Incident State(s) you want to filter on:');
	}
	
	function caseManagerFilter(element) {
		ECMSGrid.multiSelectFilter(element, 'caseManager', 'Select Case Managers(s) you want to filter on:');
	}
	  
	function statusFilter(element) {
		element.kendoDropDownList({
			dataSource: ECMSGrid.getDynamicFilter('rfsStatus').sort(),
			optionLabel: "--Select Value--"
		});
	}
	function boolFilter(element) {
		element.kendoDropDownList({
			dataSource: bool,
			optionLabel: "--Select Value--"
		});
	}

	// CUSTOM EMAIL WINDOW //////////////////////////////////////////////////
	$scope.emailWindowOptions = {
		title: "Please provide email info:",
		width: 790,
		height:600,
		visible: false,	
		modal: true,
		scrollable : false
	};

	$scope.openEmailWindow = function() {
		$scope.mailMessage = {
			from:  $rootScope.userId + "@ncmec.org",
			//to: $rootScope.userId + "@ncmec.org",
			subject: "Attention: RFSes",
			text: "Please find attached RFS: " + $scope.checkedIds.toString(),
			extraInfo: 
					{
						entityType: "rfs"
					},
			attachments : [
				{
					reportTemplate: "RfsReport",
					format: "xlsx",
					ids: $scope.checkedIds.toString()
				}
			]
		};
		$scope.attachmentFileName = "RfsReport.xls";
			
		$scope.emailWindow.center().open();
	};
	
	$scope.ccMyself = function() {
		$scope.mailMessage.cc = ($rootScope.userId + "@ncmec.org").split(",");
	}
	
	$scope.sendEmail = function(){
		$scope.mailMessage.to = $scope.mailMessage.to.split(',');

		DataFtry.sendEmail($scope.mailMessage).then(function(result){
			console.log("SENT EMAIL !!!");
			console.log(result);
			if(result.data.status == "SUCCESS")	alert("Your email has been successfully sent!");
		});
		$scope.emailWindow.close();
		
	};
	
	//PRINT RFSs ////////////////////////////////
	$scope.previewWindowOptions = {};
	$scope.previewRFSes = function(){
		console.log('Inside printRFSes');
		
		var exportEndpoint = '/rest/document/exportToHtml/rfses?token=' + StorageService.getToken() + '&reportName=RfsReport&ids='  + $scope.checkedIds.toString();
	
		$http.get(exportEndpoint)
			.success( function(result) {
				console.log(result.content);
				var options =  {
					width: "80%",
					visible: false,
					maxWidth: 1200,
					height: "80%",
					modal: true,
					content: {
						iframe: true,
						template:  '<embed src="' + ECMSConfig.restServicesURI + result.content + '" width="100%" height="100%" ></embed>' 
						}
					};
				$scope.previewWindow.setOptions(options);
	
				console.log($scope.previewWindowOptions);
				$scope.previewWindow.refresh().center().open();
		});
	};

	//EXPORT RFSs ////////////////////////////////
	$scope.exportRFSes = function() {
		if ($scope.checkedIds.length <= 0)
		{
			alert ('Please select one or more RFSes before exporting..');
			return;
		} else {
			//console.log("FROM EXPORT RFSES");
			var exportURL = '/rest/document/export/rfses?reportFileName=RfsReport.xlsx&ids=' +$scope.checkedIds.toString()
			DataFtry.exportDocument(exportURL, '.xlsx', 'SelectedRFSes.xlsx');
		}
	};

}]);
