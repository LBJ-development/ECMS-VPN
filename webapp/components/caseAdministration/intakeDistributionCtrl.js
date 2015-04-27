'use strict';

angular.module('ECMSapp.intakeDistribution', [])

.controller('IntakeDistributionCtrl', [ '$scope', 'DataFtry', '$http',  function( $scope, DataFtry, $http){
	
	// QUERY OPTIONS ///////////////////////////////////////////////////////////////////////
	// INITIAL DATE RANGE //////////////////////////////////////////////////
	var todayDate		= new Date();
	var dateOffset		= (24*60*60*1000) * 1; //DEFAULT: 1 DAY 
	var startingDate	= new Date(todayDate.getTime() - dateOffset);
	var endingDate		= todayDate;

	$scope.casesearch = {
		caseCreateStartDate: startingDate,
		caseCreateEndDate: endingDate,
		caseHasPoliceReport: "-1", //set default value to ALL for drop-down list
		caseDistributedTo: "-1", //set default value to ALL for drop-down list
		caseDistributedStatus: "-1" //set default value to ALL for drop-down list
	};
	

	$scope.submitSearch = function(){
		// data massaging
		// format dates
		$scope.casesearch.caseCreateStartDate = formatcaseCreateStartDate();
		$scope.casesearch.caseCreateEndDate = formatcaseCreateEndDate();
		
		//handle null and  convert to string array into comma-separated string
		if ($scope.casesearch.caseHasPoliceReport === null){
			// console.log('assigning -1');
			$scope.casesearch.caseHasPoliceReport = "-1";
		}
		
		if ($scope.casesearch.caseDistributedTo === null){
			// console.log('assigning -1');
			$scope.casesearch.caseDistributedTo = "-1";
		}
		
		if ($scope.casesearch.caseDistributedStatus === null){
			// console.log('assigning -1');
			$scope.casesearch.caseDistributedStatus = "-1";
		}
		$scope.casesearch.caseHasPoliceReport = $scope.casesearch.caseHasPoliceReport.toString();
		$scope.casesearch.caseDistributedTo = $scope.casesearch.caseDistributedTo.toString();
		$scope.casesearch.caseDistributedStatus = $scope.casesearch.caseDistributedStatus.toString(); 
		
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

	$http.get("/rest/caseadmin/lookup?lookupName=frmSrchCasePoliceReport")
		.success( function(result) {
			$scope.caseHasPoliceReportDataSource = result.content;
		});
		 
	$http.get("/rest/caseadmin/lookup?lookupName=frmSrchCaseDistributedStatus")
		.success( function(result) {
			$scope.caseDistributedStatusDataSource = result.content;
	});
	
	$http.get("/rest/caseadmin/lookup?lookupName=frmSrchCaseDistributorTo")
		.success( function(result) {
			$scope.caseDistributedToDataSource = result.content;
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
	
	// GRID ////////////////////////////////////////////////////////////////////
	var result = {};

	// WATCH FOR A DATE RANGE CHANGE
	$scope.$watch('submissionCount', function(newValue, oldValue) {
		// console.log("Calling submissionCount:" + $scope.submissionCount);

		if (newValue === 0){
			return;
		}
		DataFtry.getCasesForIntakeDist($scope.casesearch).then(function(result){
			$scope.mainGridOptions.dataSource.data = result.data.content;

			// console.log(result.data.content.length)
			if(result.data.content.length >= 500){
				$scope.warningClass = "inline-err";
			} else {
				$scope.warningClass = "inline-msg";
			}
			$scope.warning = result.data.messages.CASES_LIST;
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
						refresh: true,
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
						width	: "10%"
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

						field	: "IntlRisk",
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
						width	: "10%"
						},{

						field	: "caseDistributionMehtod",
						title	: "Recip/D Sent/Method",
						width	: "30%",
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

	// PDF WIDOW //////////////////////////////////////////////////

	$scope.PDFPreviewOptions = {
		width: "80%",
		visible: false,
		maxWidth: 1200,
		height: "80%",
		modal: true,
		// title: "Daily Assignment Worksheet",
		// open: getPDF
		// position: {
		// top: 400,
		// left: "center"
		// },
	};

	$scope.getPDF = function(e){


		$scope.PDFPreview.center().open();
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

			detailRow.find(".gridDetail-center").kendoGrid({

				dataSource:{
						data: result.data.content,
							},
				scrollable: false,
				sortable: false,
				pageable: false,
				columns: [
					{ field: "childRecoveryStatus", title: "Recovery Status", width: "12%" },
					{ field: "incidenType", title:"Child Case Type", width: "20%" },
					{ field: "childName", title:"Child Name", width: "20%" },
					{ field: "childAge", title:"Child Age", width: "45px" },
					{ field: "id", title: "Person ID", width: "20%" }
					]
				});
			});
		}

	

	// FILTERING WITH DROPDOWN MENU 
	var victim	= ["1", "2", "3", "4", "5", "6"],
		bool	= ["Yes", "No"],
		status	= ["Active", "Recovered", "Closed"],
		types	= ["ERU", "FA", "NFA", "LIM", "5779", "UHR", "DECC", "RCST", "ATT", "UMR"],
		sources	= ["Call", "Email", "Internet", "WebService", "Online Sighting Form"],
		states	= ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
			
	function typeFilter(element) {
		//element.kendoMultiSelect({
		element.kendoDropDownList({
			dataSource: types,
			//multiple: "multiple",
			optionLabel: "--Select Value--"
		});
	}
		
	function statusFilter(element) {
		element.kendoDropDownList({
			dataSource: status,
			optionLabel: "--Select Value--"
		});
	}
		
	function sourceFilter(element) {
		element.kendoDropDownList({
			dataSource: sources,
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

	function stateFilter(element) {
		element.kendoDropDownList({
			dataSource: states,
			optionLabel: "--Select Value--"
		});
	}
		

}]);

