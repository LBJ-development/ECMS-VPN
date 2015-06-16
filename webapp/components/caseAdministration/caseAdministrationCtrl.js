'use strict';

angular.module('ECMSapp.adminMain', [])

.controller('MainCaseAdminCtrl', ['$rootScope', '$scope', 'ECMSConfig', 'StorageService', 'DataFtry', 'ECMSGrid', '$http', function($rootScope, $scope, ECMSConfig, StorageService, DataFtry, ECMSGrid, $http){
	
	$scope.searchCriteria = {
		startDate: null,
		endDate: null,
		rfsPrimaryType: "-1", //set default value to ALL for drop-down list
		rfsSource: "-1", //set default value to ALL for drop-down list
		rfsStatus: "-1" //set default value to ALL for drop-down list
	};

	$scope.submitSearch = function(){
		$scope.today = new Date()
		// data massaging
		console.log("startDate valid:" + ($scope.startDate instanceof Date));
		console.log("endDate valid:" + ($scope.endDate instanceof Date));
		
		//Reset everytime search is submitted
		if ($scope.checkedIds){
			$scope.checkedIds.splice(0, $scope.checkedIds.length);
		}
		
		
		if (!($scope.startDate instanceof Date)){
			alert("Error: Enter correct Start Date(mm/dd/yyyy) OR  Pick a date from DatePicker widget.");
			return;
		}
		
		if (!($scope.endDate instanceof Date)){
			alert("Error: Enter correct End Date(mm/dd/yyyy) OR  Pick a date from DatePicker widget.");
			return;
		}
		
		if ($scope.startDate > $scope.endDate) {
			alert("Start Date can't be after End Date");
			return;
		}

		
		// format dates
		$scope.searchCriteria.startDate = formatstartDate();
		$scope.searchCriteria.endDate = formatendDate();
		
		//handle null and  convert to string array into comma-separated string
		if ($scope.searchCriteria.rfsPrimaryType === null){
			//console.log('assigning -1');
			$scope.searchCriteria.rfsPrimaryType = "-1";
		}
		
		if ($scope.searchCriteria.rfsSource === null){
			//console.log('assigning -1');
			$scope.searchCriteria.rfsSource = "-1";
		}
		
		if ($scope.searchCriteria.rfsStatus === null){
			//console.log('assigning -1');
			$scope.searchCriteria.rfsStatus = "-1";
		}
		

		
		$scope.searchCriteria.rfsPrimaryType = $scope.searchCriteria.rfsPrimaryType.toString();
		$scope.searchCriteria.rfsSource = $scope.searchCriteria.rfsSource.toString();
		$scope.searchCriteria.rfsStatus = $scope.searchCriteria.rfsStatus.toString();
		
		$scope.submissionCount ++;
	};

	function formatstartDate(){
		var stDate	= $scope.startDate.getDate();
		var stMonth = $scope.startDate.getMonth() + 1;
		var stYear	= $scope.startDate.getFullYear();
		return stYear + "-" + stMonth  + "-" + stDate;
	}

	function formatendDate(){
		var enDate	= $scope.endDate.getDate();
		var enMonth = $scope.endDate.getMonth() + 1;
		var enYear	= $scope.endDate.getFullYear();
		return enYear + "-" + enMonth  + "-" + enDate;
	}

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
		
	var result = {};
	// QUERY OPTIONS ///////////////////////////////////////////////////////////////////////
	// INITIAL DATE RANGE //////////////////////////////////////////////////
	var todayDate		= new Date();
	var dateOffset		= (24*60*60*1000) * 1; //DEFAULT: 1 DAY 
	$scope.startDate	= new Date(todayDate.getTime() - dateOffset);
	$scope.endDate		= todayDate;
	
	$scope.searchCriteria.startDate = formatstartDate();
	$scope.searchCriteria.endDate = formatendDate();
	$scope.submissionCount = 0;
	$scope.checkedIds =[];
		
	//Initial Load
	$scope.submitSearch();
	
	// GRID ////////////////////////////////////////////////////////////////////
	// WATCH FOR A Search Submission
	$scope.$watch('submissionCount', function(newValue, oldValue) {
		
		//console.log("FROM WATCH: submissionCount ="  + $scope.submissionCount);
		if (newValue === 0){
			return;
		}

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
			setTimeout(function(){
				// DELAY THE INITIALIZATION FOR THE TABLE CLICK ENVENT (CHECK IF CHECKBOX IS CLICKED)
				//$scope.mainGrid.table.on("click", ".checkbox" , selectRow);
			}, 1000);
		});
	});
	
/*	$scope.enableSumbitBtn = function() {
		$scope.disabled = false;
	};*/
	
	// MAKE THE CHECK BOX PERSISTING
	ECMSGrid.init($scope.checkedIds);
	$scope.caseSelected = ECMSGrid.caseSelected;
	$scope.toggleSelectAll =  ECMSGrid.toggleSelectAll;
	
	// DISABLE/ENABLE BUTTON WHEN CASE ARE SELECTED /////////////
	$scope.buttonDisabledClass = "linkButtonDisabled"
	$scope.$watch('checkedIds.length', function() {
		console.log($scope.checkedIds.length);
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
						
		/*columnMenu: {
			messages	: {
				columns			: "Choose columns",
				filter			: "Apply filter",
				sortAscending	: "Sort (asc)",
				sortDescending	: "Sort (desc)"
							}
					},*/

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
					   console.log(result.content)
					   var options =  {     
									 width: "80%",
									 visible: false,
									 maxWidth: 1200,
									 height: "80%",
									 modal: true,
									 content: {
											iframe: true,
											template:  '<embed src="' + ECMSConfig.restServicesURI + result.content + '" width="100%" height="100%" ></embed>' 
									 }};    
					   
					   $scope.previewWindow.setOptions(options);
					   
					   console.log($scope.previewWindowOptions);
					   $scope.previewWindow.refresh().center().open();
		  });           
		  
   }


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
