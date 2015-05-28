'use strict';

angular.module('ECMSapp.mediaCertDistribu', [])

.controller('mediaCertDistribuCtrl', [ '$rootScope', '$scope', 'DataFtry', '$http', '$location',  function( $rootScope, $scope, DataFtry, $http, $location){

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
		//Reset everytime search is submitted
		$scope.checkedIds =[];
		
		// data massaging
		$scope.today = new Date();
		if (!($scope.startingDate instanceof Date)){
			alert("Error: Enter correct Start Date(mm/dd/yyyy) OR  Pick a date from DatePicker widget.");
			return;
		}
		
		if (!($scope.endingDate instanceof Date)){
			alert("Error: Enter correct End Date(mm/dd/yyyy) OR  Pick a date from DatePicker widget.");
			return;
		}
		
		if ($scope.startingDate > $scope.endingDate) {
			alert("Start Date can't be after End Date");
			return;
		}

		//console.log("FROM SUBMIT SEARCH")

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
		$scope.filterSourcesList = [];
		$scope.filterCaseTypeList = [];
		$scope.filterCaseIncidentStateList= [];
		$scope.filterCaseStatusList = [];
		
		var tempSource = "";
		var tempCaseType= "";
		var tempIncidentState= "";
		var filterCaseStatus = "";
		
		// console.log($scope.casesearch);
		DataFtry.getCasesForMediaCertDist($scope.casesearch).then(function(result){
	
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
				
				//state filter
				tempIncidentState	= currentCase['caseIncidentState'];
				if ('undefined' != typeof tempIncidentState ) {
					//console.log('adding '+ tempIncidentState);
					if ($.inArray(tempIncidentState, $scope.filterCaseIncidentStateList) < 0) {
						$scope.filterCaseIncidentStateList.push(tempIncidentState);
					}
				}
				
				//status
				filterCaseStatus	= currentCase['caseMediaStatus'];
				if ('undefined' != typeof filterCaseStatus ) {
					//console.log('adding '+ filterCaseStatus);
					if ($.inArray(filterCaseStatus, $scope.filterCaseStatusList) < 0) {
						$scope.filterCaseStatusList.push(filterCaseStatus);
					}
				}
			});
			
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
								
								caseNumber			: { type: "string" },
								caseSource			: { type: "string" },
								caseTypeAbbr			: { type: "string" },
								caseHasPoliceReport		: { type: "string" },
								caseChildrenCount		: { type: "number" },
								caseManager			: { type: "string" },
								caseMediaStatus		: { type: "string" },
								caseCertifiedDate		: { type: "date" },
								caseRestrictedDate		: { type: "date" },
								recipientSend			: { type: "string" },
								casePosterFlag		: { type: "boolean" },
								posterURL			: { type: "string" },
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
							ui			: sourceFilter,
							operators	: {
								string	: {
								eq		: "Equal to",
									}
								}
							}
						},{
						field	: "caseTypeAbbr",
						title	: "Type",
						width	: "15%",
						filterable: {
							ui			: typeFilter,
							operators	: {
								string	: {
								eq		: "Equal to",
									}
								}
							}
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
						width	: "10%",
						filterable: {
							ui			: statusFilter,
							operators	: {
								string	: {
								eq		: "Equal to",
									}
								}
							}
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
						field	: "caseMediaSentHistory",
						title	: "Recipient- D/T Sent",
						width	: "15%",
						filterable: false,
						},{
						field	: "View",
						title	: "Poster",
						filterable: false,
						sortable: false,
						//template: "<span ><a href='' ng-click='getPoster($event)' class='baseLinkText'>View</a></span>",
						template: '<span #= casePosterFlag ? \'style="display:block"\' :  \'style="display:none"\' #  ><a href=#= posterURL #  target="_blank" class="baseLinkText">View</a></span>',
						width	: "5%"
						},{
						width	: "5%",
						filterable: false,
						sortable: false,
						template: "<input type='checkbox'  ng-model='dataItem.selected' ng-click='caseSelected($event)' />",
						//template:  '<input type="checkbox" #= casePosterFlag ? \'checked="checked"\' : "" # class="chkbx" />',
						title: "<input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)'/>",
						attributes: {
						style: "text-align: center"
						}
					}
				]
			};

////////
// MAKE THE CHECK BOX PERSISTING
	$scope.checkedIds =[];
	$scope.selectItem = function(item){
		//remove from selection list if unchecked
		if (!item.selected) {
			
			while ($.inArray(item.caseNumber, $scope.checkedIds) >=0) {
				console.log(item.caseNumber + "=" + $.inArray(item.caseNumber, $scope.checkedIds));
				$scope.checkedIds.splice($.inArray(item.caseNumber, $scope.checkedIds),1);
			}
			//console.log($scope.checkedIds.toString());
		} else {
			//do not add if it already exists
			if (!($.inArray(item.caseNumber, $scope.checkedIds) >=0)){
				$scope.checkedIds.push(item.caseNumber);
			}
							
		}
        
	}
	
	$scope.toggleSelectAll = function(ev) {
        //var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        //var items = grid.dataSource.view(); //This gets only current page view
		
		//select only filtered data
		var dataSource = $(ev.target).closest("[kendo-grid]").data("kendoGrid").dataSource;
        var filters = dataSource.filter();
        var allData = dataSource.data();
        var query = new kendo.data.Query(allData);
        var items = query.filter(filters).data;
		console.log(items);
		
        items.forEach(function(item){
			item.selected = ev.target.checked;
			$scope.selectItem(item);
        });
		
		ev.currentTarget.checked ? $scope.caseNum = items.length : $scope.caseNum = 0; 
    };


	$scope.caseSelected = function(ev){
		var element =$(ev.currentTarget);
        var checked = element.is(':checked');
        var row = element.closest("tr");
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var item = grid.dataItem(row);
		
		$scope.selectItem(item);

		!ev.currentTarget.checked ?  $scope.caseNum -- :$scope.caseNum ++; 
	
	};
	




	// DISABLE/ENABLE BUTTON WHEN CASE ARE SELECTED /////////////
	$scope.buttonDisabledClass = "linkButtonDisabled";

	$scope.$watch('caseNum', function() {

		$scope.caseNum == 0? $scope.buttonDisabledClass = "linkButtonDisabled" : $scope.buttonDisabledClass = "";
	});

	// DISTRIBUTE INTAKES MESSAGES //////////////////////////////////////////////////

	$scope.confirmMessageOptions = {
		width: 380,
		visible: false,
		// height: 170,
		modal: true,
		scrollable : false,
		// open: confirmMessage
	};

	$scope.confirmSendToLEA = function(e) {
		$scope.numCases = $scope.caseNum + " cases";
		$scope.recipient = "to LEA.";
		$scope.targetGroup = "lea";
		
		$scope.confirmMessage.center().open();
	};

	$scope.confirmSendToParent = function(e) {
		$scope.numCases = $scope.caseNum + " cases";
		$scope.recipient = "to parent.";
		$scope.targetGroup = "parent";
		
		$scope.confirmMessage.center().open();
	};
	
	$scope.sendEmailTo = function(){
		DataFtry.sendEmailTo($scope.targetGroup, $scope.checkedIds.toString(), 'case')
				.then(function(result){
					$scope.mailStatus = "Mail sent successfully";
					console.log(result);
				});
				
		$scope.confirmMessage.close();
		
	};
	
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
			subject: "Attention: Intakes",
			extraInfo: 
					{
						entityType: "case"
						},
			text: "Please find attached Intakes: " + $scope.checkedIds.toString(),
		};
			
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
		});
		$scope.emailWindow.close();
		
	};

///////


	// SELECT A CASE AND REDIRECT TO THE CASE MANAGMENT //////////////////////////////////////////////////
	$scope.selectCase = function(e){
		
		// OPEN A CASE IN THE CASE MANAGEMENT SECTION
		 $location.path('/casemanagement');
	};

	// GET POSTER /////////////////////////////////////////////////////////////////////////////////////////
	$scope.getPoster = function(ev){
		var element	= $(ev.currentTarget);
		var row 	= element.closest("tr");
		var grid 	= $(ev.target).closest("[kendo-grid]").data("kendoGrid");
		var dataItem 	= grid.dataItem(row);
		$scope.caseID  = dataItem.caseNumber;

		// FOR REAL DATA////////////////////////////////////////
		window.open("http://www.missingkids.com/poster/NCMC/" + $scope.caseID + "/screen");
		// HARD CODED FOR DEMO ////////////////////////////////////////
		window.open("http://www.missingkids.com/poster/NCMC/" +  "1245036" + "/screen");
		
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
					{ field: "incidentType", title: "Child Case Type", width: "20%" },
					{ field: "childRecoveryStatus", title: "Recovery Status", width: "20%" },
					{ field: "childName", title:"Child Name", width: "20%" },
					{ field: "childAge", title:"Incid. Age", width: "10%" },
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
		bool	= ["Yes", "No"];
		
	function typeFilter(element) {
		//element.kendoMultiSelect({
		element.kendoDropDownList({
			dataSource: $scope.filterCaseTypeList.sort(),
			//multiple: "multiple",
			optionLabel: "--Select Value--"
		});
	}
		
	function statusFilter(element) {
		element.kendoDropDownList({
			dataSource: $scope.filterCaseStatusList.sort(),
			optionLabel: "--Select Value--"
		});
	}
		
	function sourceFilter(element) {
		element.kendoDropDownList({
			dataSource: $scope.filterSourcesList.sort(),
			optionLabel: "--Select Value--"
		});
	}
	
	function stateFilter(element) {
		element.kendoDropDownList({
			dataSource: $scope.filterCaseIncidentStateList.sort(),
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

}]);





