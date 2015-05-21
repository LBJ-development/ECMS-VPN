'use strict';

angular.module('ECMSapp.intakeDistribution', [])

.controller('IntakeDistributionCtrl', [ '$scope', 'DataFtry', '$http', '$location', 'ECMSConfig', 'StorageService',  function( $scope, DataFtry, $http, $location,  ECMSConfig, StorageService){

	// QUERY OPTIONS ///////////////////////////////////////////////////////////////////////

	console.log("FROM INTAKE DISTRIBUTION");
	console.log($location);
	$scope.casesearch = {
		caseCreateStartDate: startingDate,
		caseCreateEndDate: endingDate,
		frmSrchCaseHasPoliceReport: "-1", //set default value to ALL for drop-down list
		frmSrchCaseDistributedTo: "-1", //set default value to ALL for drop-down list
		frmSrchCaseDistributedStatus: "-1" //set default value to ALL for drop-down list
	};

	$scope.submitSearch = function(){
		// data massaging
		// format dates
		$scope.casesearch.caseCreateStartDate = formatcaseCreateStartDate();
		$scope.casesearch.caseCreateEndDate = formatcaseCreateEndDate();
		
		//handle null and  convert to string array into comma-separated string
		if ($scope.casesearch.frmSrchCaseHasPoliceReport === null){
			// console.log('assigning -1');
			$scope.casesearch.frmSrchCaseHasPoliceReport = "-1";
		}
		
		if ($scope.casesearch.frmSrchCaseDistributedTo === null){
			// console.log('assigning -1');
			$scope.casesearch.frmSrchCaseDistributedTo = "-1";
		}
		
		if ($scope.casesearch.frmSrchCaseDistributedStatus === null){
			// console.log('assigning -1');
			$scope.casesearch.frmSrchCaseDistributedStatus = "-1";
		}
		$scope.casesearch.frmSrchCaseHasPoliceReport = $scope.casesearch.frmSrchCaseHasPoliceReport.toString();
		$scope.casesearch.frmSrchCaseDistributedTo = $scope.casesearch.frmSrchCaseDistributedTo.toString();
		$scope.casesearch.frmSrchCaseDistributedStatus = $scope.casesearch.frmSrchCaseDistributedStatus.toString(); 
		
		$scope.submissionCount ++;
	};

	function formatDate(){
		var date	= new Date().getDate();
		var month	= new Date().getMonth() + 1;
		var year	= new Date().getFullYear();
		return   month  + "/" + date + "/" +  year ;
	}

	function formatcaseCreateStartDate(){
		var stDate	= $scope.caseCreateStartDate.getDate();
		var stMonth = $scope.caseCreateStartDate.getMonth() + 1;
		var stYear	= $scope.caseCreateStartDate.getFullYear();
		return stYear + "-" + stMonth  + "-" + stDate;
	}

	function formatcaseCreateEndDate(){
		var enDate	= $scope.caseCreateEndDate.getDate();
		var enMonth = $scope.caseCreateEndDate.getMonth() + 1;
		var enYear	= $scope.caseCreateEndDate.getFullYear();
		return enYear + "-" + enMonth  + "-" + enDate;
	}

	$http.get("/rest/common/lookup?lookupName=frmSrchCaseHasPoliceReport")
		.success( function(result) {
			$scope.frmSrchCaseHasPoliceReportDataSource = result.content;
		});
		 
	$http.get("/rest/common/lookup?lookupName=frmSrchCaseDistributedStatus")
		.success( function(result) {
			$scope.frmSrchCaseDistributedStatusDataSource = result.content;
	});
	
	$http.get("/rest/common/lookup?lookupName=frmSrchCaseDistributedTo")
		.success( function(result) {
			$scope.frmSrchCaseDistributedToDataSource = result.content;
	});

	// INITIAL DATE RANGE //////////////////////////////////////////////////
	var todayDate		= new Date();
	var dateOffset		= (24*60*60*1000) * 1; //DEFAULT: 2 DAYS 
	var caseCreateStartDate		= new Date(todayDate.getTime() - dateOffset);
	var caseCreateEndDate			= todayDate;
	$scope.caseCreateStartDate	= caseCreateStartDate;
	$scope.caseCreateEndDate		= caseCreateEndDate;
	$scope.submissionCount = 0; //	

	$scope.submitSearch();
	
	// WATCH FOR A DATE RANGE CHANGE
	var result = {};
	$scope.$watch('submissionCount', function(newValue, oldValue) {
		// console.log("Calling submissionCount:" + $scope.submissionCount);

		if (newValue === 0){
			return;
		}
		$scope.filterSourcesList = [];
		$scope.filterCaseTypeList = [];
		$scope.filterCaseIncidentStateList= [];
		$scope.filterCaseStatusList = [];
		
		var tempSource = "";
		var tempCaseType= "";
		var tempIncidentState= "";
		var filterCaseStatus = "";
		
		
		DataFtry.getCasesForIntakeDist($scope.casesearch).then(function(result){
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
					filterCaseStatus	= currentCase['caseStatus'];
					if ('undefined' != typeof filterCaseStatus ) {
						//console.log('adding '+ filterCaseStatus);
						if ($.inArray(filterCaseStatus, $scope.filterCaseStatusList) < 0) {
							$scope.filterCaseStatusList.push(filterCaseStatus);
						}
					}

			});
			
			
			
			// console.log(result.data.content.length)
			if(result.data.content.length >= 500){
				$scope.warningClass = "inline-err";
			} else {
				$scope.warningClass = "inline-msg";
			}
			$scope.warning = result.data.messages.RESULTS_LIST;
			$scope.disabled = true;
			$scope.caseNum = 0; // KEEP TRACK OF THE NUMBER OF SELECTED CASES
		});
	});
	
	// MAIN GRID SETTINGS //////////////////////////////////////////////////////////////////////////////////////
	$scope.mainGridOptions =  {
		 
		dataSource: {
			data: result,
				schema: {
					model: {
						fields: {
								caseNumber				: { type: "string" },
								caseDateTimeReceived	: { type: "date"	},
								caseSource				: { type: "string" },
								caseTypeAbbr			: { type: "string" },
								// caseStatus	: { type: "string" },
								caseChildrenCount		: { type: "number" },
								caseIncidentState		: { type: "string" },
								caseHasPoliceReport     : { type: "string" },
								caseIsInternational		: { type: "string" },
								caseAssignmentDateTime	: { type: "date" },
								caseDistributionMehtod	: { type: "string" }
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
		detailTemplate: kendo.template($("#detail-template-Int-Dist").html()),
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
						field	: "caseNumber",
						title	: "Case",
						width	: "10%",
						template: "<a href='' ng-click='selectCase($event)' class='baseLinkText' >#=caseNumber#</a>"
						},{

						field	: "caseDateTimeReceived",
						title	: "Intake D/T",
						format	:"{0:MM/dd/yyyy}",
						width	: "15%",
						filterable: false
						},{
							
						field	: "caseSource",
						title	: "Source",
						width	: "5%",
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
						
						/*field	: "caseStatus",
						title	: "Status",
						width	: "5%",
						filterable: false,
						sortable: false,
						},{*/

						field	: "caseChildrenCount",
						title	: "# of Vict",
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

						field	: "caseIncidentState",
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

						field	: "caseHasPoliceReport",
						title	: "Pol. Rep.",
						width	: "5%",
						filterable: {
							ui			: boolFilter,
							operators	: {
								string	: {
								eq		: "Equal to"
									}
								}
							}
						},{

						field	: "caseIsInternational",
						title	: "Intl. Risk",
						width	: "5%",
						filterable: {
							ui			: boolFilter,
							operators	: {
								string	: {
								eq		: "Equal to"
									}
								}
							}
						},{

						field	: "caseAssignmentDateTime",
						title	: "CM Assigned D/T",
						width	: "15%",
						format	:"{0:MM/dd/yyyy hh:mm tt}"
						},{

						field	: "caseDistributionMehtod",
						title	: "Recip/D Sent/Method",
						width	: "25%",
						filterable: false,
						},{

						field	: "View",
						title	: "Int. Rep.",
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
						}]
					};

	// GRID FUNCTIONALITIES /////////////////////////////////////////////////////////////////////////////////////
	$scope.enableSumbitBtn = function() {
		$scope.disabled = false;
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

	$scope.confirmClearinghouse = function(e) {
		$scope.numCases = $scope.caseNum + " cases";
		$scope.recipient = "to Clearinghouses.";
		$scope.confirmMessage.center().open();
	};

	$scope.confirmTeamHope = function(e) {
		$scope.numCases = $scope.caseNum + " cases";
		$scope.recipient = "to Team Hope.";
		$scope.confirmMessage.center().open();
	};

	$scope.confirmEmail = function(e) {
		$scope.numCases = $scope.caseNum + " cases";
		$scope.recipient = "to Custom Email.";
		$scope.confirmMessage.center().open();
	};

	// PDF WINDOW //////////////////////////////////////////////////
	$scope.PDFPreviewOptions = {
		width: "80%",
		visible: false,
		maxWidth: 1200,
		height: "80%",
		modal: true,
		content: {
			iframe: false,
			template:  '<embed src=' + ECMSConfig.restServicesURI + '/rest/document/export/intake?X-Auth-Token=' + StorageService.getToken() + 'reportFilename=Intake_Report_ECMS.pdf&ids='  + $scope.caseID + '" width="100%" height="100%" type="application/pdf"></embed>'
		}
	};
	
	$scope.getPDF = function(ev){
		var element	= $(ev.currentTarget);
		var row 	= element.closest("tr");
		var grid 	= $(ev.target).closest("[kendo-grid]").data("kendoGrid");
		var dataItem 	= grid.dataItem(row);
		$scope.caseID  = dataItem.caseNumber;

		setTimeout(function(){
			$scope.PDFPreview.center().open();
		}, 300);
		console.log($scope.caseID);
	};

	// SELECT A CASE AND REDIRECT TO THE CASE MANAGMENT //////////////////////////////////////////////////
	$scope.selectCase = function(e){
		
		// OPEN A CASE IN THE CASE MANAGEMENT SECTION
		 $location.path('/casemanagement');
	};

/*
	$scope.getPDF = function(e){

		console.log("FROM GET PDF");

		$scope.PDFPreview.center().open();
	};
*/

	
/*	$scope.caseSel = []; // KEEP TRACK OF THE CASES SELECTED
	$scope.caseSelected = function(evt){

		var	row			= evt.currentTarget.closest("tr"),
			grid		= $("#grid").data("kendoGrid"),
			dataItem	= grid.dataItem(row);


		if(!evt.currentTarget.checked) {

			for(var i=0; i < $scope.caseSel.length; i++) {

				if($scope.caseSel[i] === dataItem.caseNumber){

					$scope.caseSel.splice(i , 1);

					$scope.caseNum --;
				}
			}
		} else {

			$scope.caseSel.push(dataItem.caseNumber);

			$scope.caseNum ++;
		}

		console.log($scope.caseSel);
	};*/

	// GRID DETAIL SETTINGS /////////////////////////////////////////////////////////////////////////////////////
	function detailIExpand(e) {

		// console.log("FROM EXPAND ");
		// console.log(e);

	}
	function detailInit(e) {
/*var grid = e.detailRow.find("[data-role=grid]").data("kendoGrid");
		grid.dataSource.read();*/

		var detailRow = e.detailRow;
			kendo.bind(detailRow, e.data);
			// console.log(grid.tbody.find("tr.k-master-row").first());
			// console.log(e.data.caseNumber);

		var caseNumber = e.data.caseNumber;

		$scope.urlDetail = "/rest/caseadmin/incidentDetails?caseNumber=" + caseNumber;

		DataFtry.getData($scope.urlDetail).then(function(result){

			detailRow.find("#gridDetail-ID").kendoGrid({

				dataSource:{
						data: result.data.content,
							},
				scrollable: false,
				sortable: false,
				pageable: false,
				columns: [
					{ field: "childRecoveryStatus", title: "Recovery Status", width: "12%" },
					{ field: "incidenType", title:"Child Case Type", width: "20%" },
					{ field: "childName", title:"Child Name", width: "40%" },
					{ field: "childAge", title:"Child Age", width: "8%" },
					{ field: "id", title: "Person ID", width: "20%" }
					]
				});
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

