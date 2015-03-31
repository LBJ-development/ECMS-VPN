'use strict';

angular.module('ECMSapp.intakeDistribution', [])

.controller('IntakeDistributionCtrl', [ '$scope', 'DataFtry',  function( $scope, DataFtry, $q){

	// DISTRIBUTE INTAKESMESSAGES //////////////////////////////////////////////////

	$scope.confirmMessageOptions = {
		width: 380,
		visible: false,
		height: 160,
		modal: true,
		scrollable : false,
		// open: confirmMessage
	};

 	$scope.confirmClearinghouse = function(e) {
		$scope.numCases = "5" + " cases";
		$scope.recipient = "to Clearinghouse.";
		$scope.confirmMessage.center().open();
	}

	 $scope.confirmTeamHope = function(e) {
		$scope.numCases = "5" + " cases";
		$scope.recipient = "to Team Hope.";
		$scope.confirmMessage.center().open();
	}

	// INITIAL DATE RANGE //////////////////////////////////////////////////
	var todayDate		= new Date();
	var dateOffset		= (24*60*60*1000) * 1; //DEFAULT: 2 DAYS 
	var startingDate	= new Date(todayDate.getTime() - dateOffset);
	var endingDate		= todayDate;
	$scope.startingDate	= startingDate;
	$scope.endingDate	= endingDate;
	$scope.submitSearch = 0; //
		
	// WHEN DATE RANGE CHANGES //////////////////////////////////////////////////
	$scope.changeDateRange = function(){
			$scope.submitSearch++;
	};

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
	
	// GRID ////////////////////////////////////////////////////////////////////
	var result = {};

	// WATCH FOR A DATE RANGE CHANGE
	$scope.$watch('submitSearch', function(newValue, oldValue) {
		// console.log("Calling submitSearch:" + $scope.submitSearch);
		DataFtry.getCasesForAssignment(formatStartingDate(), formatEndingDate()).then(function(result){
			$scope.mainGridOptions.dataSource.data = result.data.content;
			if(result.data.messages.CASES_LIST == "More than 500 results found, returning first 500, please adjust the date range"){
				$scope.warningClass = "inline-err";
			} else {
				$scope.warningClass = "inline-msg";
			}
			$scope.warning = result.data.messages.CASES_LIST;
		});
	});
	
	// MAIN GRID SETTINGS //////////////////////////////////////////////////////////////////////////////////////
	$scope.mainGridOptions =  {
		 
		dataSource: {
			data: result,
				schema: {
					model: {
						fields: {
								caseNumber		: { type: "string" },
								intakeDateTime	: { type: "date"	},
								source			: { type: "string" },
								caseTypeAbbr		: { type: "string" },
								caseStatus		: { type: "string" },
								childCount		: { type: "number" },
								state			: { type: "string" },
								PoliceReport		: { type: "string" },
								IntlRisk		: { type: "string" },
								CMAssignedDT	: { type: "string" },
								RecipDateSentMeth	: { type: "date" }

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
						title	: "Case #",
						width	: "10%"
						},{

						field	: "intakeDateTime",
						title	: "Intake D/T",
						format	:"{0:MM/dd/yyyy}",
						width	: "15%",
						},{
							
						field	: "source",
						title	: "Source",
						width	: "5%"
						},{

						field	: "caseTypeAbbr",
						title	: "Case Type",
						width	: "5%",
						filterable: false,
						},{
						
						field	: "caseStatus",
						title	: "Case Status",
						width	: "5%"
						},{

						field	: "childCount",
						title	: "# of Vict.",
						width	: "5%",
						filterable: {
							ui			: statusFilter,
							operators	: {
								string	: {
								eq		: "Equal to",
									}
								}
							}
						},{

						field	: "state",
						title	: "Inci. St",
						width	: "5%"
						},{

						field	: "PoliceReport",
						title	: "Police Report",
						width	: "5%"
						},{

						field	: "IntlRisk",
						title	: "Intl. Risk",
						width	: "5%"
						},{

						field	: "CMAssignedDT",
						title	: "CM Assigned Date/Time",
						width	: "10%"
						},{

						field	: "RecipDateSentMeth",
						title	: "Recip/Date Sent/Method",
						width	: "25%"
						},{

						field	: "View",
						title	: "Intake Report",
						template: "<span><a href=''   class='baseLinkText'>View</a></span>",
						width	: "5%"
						},{

						width	: "5%",
						filterable: false,
						sortable: false,
						template: "<input type='checkbox' ng-model='dataItem.selected' />",
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
                };
			
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
	var status	= ["Active", "Recovered", "Closed"],
		types	= ["ERU", "FA", "NFA", "LIM", "5779", "UHR", "DECC", "RCST", "ATT", "UMR"],
		sources	= ["Call", "Email", "Internet", "WebService", "Online Sighting Form"];
			
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

}]);

