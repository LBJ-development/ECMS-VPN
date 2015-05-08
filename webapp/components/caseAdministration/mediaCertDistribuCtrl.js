'use strict';

angular.module('ECMSapp.mediaCertDistribu', [])

.controller('mediaCertDistribuCtrl', [ '$scope', 'DataFtry', '$http', '$location',  function( $scope, DataFtry, $http, $location){

	// INITIAL DATE RANGE //////////////////////////////////////////////////
	var todayDate		= new Date();
	var dateOffset		= (24*60*60*1000) * 1; //DEFAULT: 1 DAYS 
	var startingDate	= new Date(todayDate.getTime() - dateOffset);
	var endingDate		= todayDate;
	$scope.startingDate	= startingDate;
	$scope.endingDate	= endingDate;
	$scope.isUnassignedCases = 0;
	//$scope.submitSearch = 0; //
	$scope.submissionCount = 0; //
	$scope.disableSubmit	= true; // DISABLES THE SUBMIT BUTTON
	$scope.disableDatePicker= false; // ENABLES THE DATE PICKER
		
	function formatDate(){
		var date	= new Date().getDate();
		var month	= new Date().getMonth() + 1;
		var year	= new Date().getFullYear();
		return   month  + "/" + date + "/" +  year ;
	}
	function formatcaseCreateStartDate(){
		var stDate	= $scope.startingDate.getDate();
		var stMonth	= $scope.startingDate.getMonth() + 1;
		var stYear	= $scope.startingDate.getFullYear();
		return stYear + "-" + stMonth  + "-" + stDate;
	}

	function formatcaseCreateEndDate(){
		var enDate	= $scope.endingDate.getDate();
		var enMonth	= $scope.endingDate.getMonth() + 1;
		var enYear	= $scope.endingDate.getFullYear();
		return enYear + "-" + enMonth  + "-" + enDate;
	}
	
// QUERY OPTIONS ///////////////////////////////////////////////////////////////////////

	$scope.casesearch = {
		caseMediaSearchStartDate: startingDate,
		caseMediaSearchEndDate: endingDate,
		frmSrchCaseType: "-1",
		frmSrchCaseMediaStatus: "-1",
		frmSrchCaseHasPoliceReport: "-1", //set default value to ALL for drop-down list
		frmSrchCaseMediaDistributedStatus: "-1", //set default value to ALL for drop-down list
		frmSrchCaseMediaDistributedTo: "-1", //set default value to ALL for drop-down list
		caseMediaSearchRadioOption : "certifiedDate"
	};

	$scope.submitSearch = function(){

		console.log("FROM SUBMIT SEARCH")

		$scope.casesearch.caseMediaSearchStartDate = formatcaseCreateStartDate();
		$scope.casesearch.caseMediaSearchEndDate = formatcaseCreateEndDate();
		
		//handle null and  convert to string array into comma-separated string
		if ($scope.casesearch.frmSrchCaseType === null){
			// console.log('assigning -1');
			$scope.casesearch.frmSrchCaseType = "-1";
		}

		if ($scope.casesearch.frmSrchCaseHasPoliceReport === null){
			// console.log('assigning -1');
			$scope.casesearch.frmSrchCaseHasPoliceReport = "-1";
		}

		if ($scope.casesearch.frmSrchCaseMediaStatus === null){
			// console.log('assigning -1');
			$scope.casesearch.frmSrchCaseMediaStatus = "-1";
		}
		
		if ($scope.casesearch.frmSrchCaseMediaDistributedStatus === null){
			// console.log('assigning -1');
			$scope.casesearch.frmSrchCaseMediaDistributedStatus = "-1";
		}

		if ($scope.casesearch.frmSrchCaseMediaDistributedTo === null){
			// console.log('assigning -1');
			$scope.casesearch.frmSrchCaseMediaDistributedTo = "-1";
		}
		
		/*$scope.casesearch.frmSrchCaseType = $scope.casesearch.frmSrchCaseType.toString();
		$scope.casesearch.frmSrchCaseHasPoliceReport = $scope.casesearch.frmSrchCaseHasPoliceReport.toString();
		$scope.casesearch.frmSrchCaseMediaStatus = $scope.casesearch.frmSrchCaseMediaStatus.toString();
		$scope.casesearch.frmSrchCaseMediaDistributedStatus = $scope.casesearch.frmSrchCaseMediaDistributedStatus.toString(); 
		$scope.casesearch.frmSrchCaseMediaDistributedTo = $scope.casesearch.frmSrchCaseMediaDistributedTo.toString(); 
		*/
		
		$scope.submissionCount ++;
	};

	// QUERY DROPDOWN ENDPOINTS /////////////////////////////////////////////////////////////
	$http.get("/rest/common/lookup?lookupName=frmSrchCaseType")
		.success( function(result) {
			$scope.frmSrchCaseTypeDataSource = result.content;
	});
	
	
	$http.get("/rest/common/lookup?lookupName=frmSrchCaseHasPoliceReport")
		.success( function(result) {
			$scope.frmSrchCaseHasPoliceReportDataSource = result.content;
	});

	$http.get("/rest/common/lookup?lookupName=frmSrchCaseMediaStatus")
		.success( function(result) {
			$scope.frmSrchCaseMediaStatusDataSource = result.content;
	});
	
	$http.get("/rest/common/lookup?lookupName=frmSrchCaseMediaDistributedStatus")
		.success( function(result) {
			$scope.frmSrchCaseMediaDistributedStatusDataSource = result.content;
	});
	
	$http.get("/rest/common/lookup?lookupName=frmSrchCaseMediaDistributedTo")
		.success( function(result) {
			$scope.frmSrchCaseMediaDistributedToDataSource = result.content;
	});
	
	

	$scope.handleRadioSelection = function(ev) {
		$scope.disableSubmit = false;
		ev == 2? $scope.disableDatePicker = true : $scope.disableDatePicker = false;
	};
	
	$scope.enableSumbitBtn = function() {
		$scope.disableSubmit = false;
	};
	
	$scope.submitSearch();

	// WATCH FOR A DATE RANGE CHANGE
	$scope.$watch('submissionCount', function(newValue, oldValue) {

		$scope.mainGridOptions.dataSource.data = [];

		// console.log($scope.casesearch);
		DataFtry.getCasesForMediaCertDist($scope.casesearch).then(function(result){
	
			$scope.mainGridOptions.dataSource.data = result.data.content;

			if(result.data.content.length >= 500){
				$scope.warningClass = "inline-err";
			} else {
				$scope.warningClass = "inline-msg";
			}
			$scope.warning = result.data.messages.RESULTS_LIST;
			$scope.disableSubmit = true;
			$scope.caseNum = 0; // KEEP TRACK OF THE NUMBER OF SELECTED CASES
		});

	});
	
    // MAIN GRID SETTINGS //////////////////////////////////////////////////////////////////////////////////////	
	var result = {};
	
	$scope.mainGridOptions =  {
		 
		dataSource: {
			data: result,
				schema: {
					model: {
						fields: {
								
								caseNumber				: { type: "string" },
								caseSource				: { type: "string" },
								caseType				: { type: "string" },
								caseHasPoliceReport		: { type: "string" },
								caseChildrenCount		: { type: "number" },
								caseManager				: { type: "string" },
								caseMediaStatus			: { type: "string" },
								caseCertifiedDate		: { type: "date" },
								caseRestrictedDate		: { type: "date" },
								recipientSend			: { type: "string" }
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
						refresh: true,
						pageSizes: true,
						buttonCount: 5,
						pageSize: 15
						},
		detailTemplate: kendo.template($("#detail-template-Med-Cer-Dist").html()),
		detailInit: detailInit,
		columns		: [{
						field	: "caseNumber",
						title	: "Case",
						width	: "10%",
						template: "<a href='' ng-click='selectCase($event)' class='baseLinkText' >#=caseNumber#</a>"
						},{
						field	: "caseSource",
						title	: "Source",
						width	: "10%",
						filterable: {
							ui			: caseSourceFilter,
							operators	: {
								string	: {
								eq		: "Equal to",
									}
								}
							}
						},{
						field	: "caseType",
						title	: "Type",
						width	: "15%"
						},{
						field	: "caseHasPoliceReport",
						title	: "Pol. Rep.",
						width	: "10%"
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
						field	: "caseManager",
						title	: "CM Assigned",
						width	: "15%"
						},{
						field	: "caseMediaStatus",
						title	: "Case Media Status",
						width	: "10%"
						},{
						field	: "caseCertifiedDate",
						title	: "Certified D/T",
						format	:"{0:MM/dd/yyyy}" ,
						width	: "15%",
						filterable: false,
						},{
						field	: "caseRestrictedDate",
						title	: "Restricted D/T",
						format	:"{0:MM/dd/yyyy}" ,
						width	: "15%",
						filterable: false,
						},{
						field	: "recipientSend",
						title	: "Recipient- D/T Sent",
						width	: "15%",
						filterable: false,
						},{
						field	: "View",
						title	: "Poster",
						filterable: false,
						sortable: false,
						template: "<span><a href='' ng-click='getPDF($event)' class='baseLinkText'>View</a></span>",
						width	: "5%"
						},{
						width	: "5%",
						filterable: false,
						sortable: false,
						template: "<input type='checkbox' ng-model='dataItem.selected' ng-click='caseSelected($event)' />",
						title: "<input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)'/>",
						attributes: {
						style: "text-align: center"
						}
					}
				]
			};

	$scope.toggleSelectAll = function(ev) {

		var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
		var items = grid.dataSource.data();
			items.forEach(function(item){
		item.selected = ev.target.checked;
		});

		ev.currentTarget.checked ? $scope.caseNum = grid.dataSource.total() : $scope.caseNum = 0; 
	};

	$scope.caseSelected = function(ev){

		!ev.currentTarget.checked ?  $scope.caseNum -- :$scope.caseNum ++; 
	
	};
	// DISABLE/ENABLE BUTTON WHEN CASE ARE SELECTED /////////////
	$scope.buttonDisabledClass = "linkButtonDisabled";

	$scope.$watch('caseNum', function() {

		$scope.caseNum == 0? $scope.buttonDisabledClass = "linkButtonDisabled" : $scope.buttonDisabledClass = "";
		// console.log("Number of case selected: " + $scope.caseNum);

	});

	// SELECT A CASE AND REDIRECT TO THE CASE MANAGMENT //////////////////////////////////////////////////
	$scope.selectCase = function(e){
		
		// OPEN A CASE IN THE CASE MANAGEMENT SECTION
		 $location.path('/casemanagement');
	};


	// GRID DETAIL SETTINGS /////////////////////////////////////////////////////////////////////////////////////

	function detailInit(e) {

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

			detailRow.find("#gridDetail-MCD").kendoGrid({

				dataSource:{
						data: result.data.content,
							},
				scrollable: false,
				sortable: false,
				pageable: false,
				columns: [
					{ field: "childCaseStatus", title: "Child Case Type", width: "20%" },
					{ field: "childRecoveryStatus", title: "Recovery Status", width: "20%" },
					{ field: "childName", title:"Child Name", width: "20%" },
					{ field: "incidAge", title:"Incid. Age", width: "10%" },
					{ field: "childMediaStatus", title: "Child Media Status", width: "20%" },
					{ field: "childID", title: "Child ID", width: "10%" }
					]
				});
			});
		}

	function getNarrative(e, caseNumber, caseManager){

		var detailRow = e.detailRow;
		kendo.bind(detailRow, e.data);

		var grid = {};
		$scope.urlNarrative = "/rest/caseadmin/mediaNarratives?caseNumber=" + caseNumber;
		DataFtry.getData($scope.urlNarrative).then(function(result){

			if(!result.data.content.length == 0){

				// console.log("FROM GET NARRATIVE (HAS NARRATIVE):");
				// console.log( result.data.content.length);

				grid = detailRow.find("#narrative-MCD").kendoGrid({

					dataSource:{
						data: result.data.content,
						pageSize: 1
							},
					scrollable: false,
					sortable: false,
					pageable: true,
					height	: 300,

					rowTemplate: kendo.template($("#row-template-Med-Cer-Dist").html()),
					columns: [
						{ field: "", width: "100%" , height: "100%",

						headerAttributes: {
							style: "display: none"
							}
						},
					]
				});
			} else {
				// console.log("FROM GET NARRATIVE (DONT HAVE NARRATIVE):");
				// console.log( result.data.content.length);
				$("#narrative-MCD").css("display" , "none");
			}
		
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

}]);





