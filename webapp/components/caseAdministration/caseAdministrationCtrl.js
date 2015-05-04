'use strict';

angular.module('ECMSapp.adminMain', [])

.controller('MainCaseAdminCtrl', ['$scope', 'DataFtry', '$http', function($scope, DataFtry, $http){
	
	$scope.searchCriteria = {
		startDate: null,
		endDate: null,
		rfsPrimaryType: "-1", //set default value to ALL for drop-down list
		rfsSource: "-1", //set default value to ALL for drop-down list
		rfsStatus: "-1" //set default value to ALL for drop-down list
	};

	$scope.submitSearch = function(){
		// data massaging
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

	$http.get("/rest/caseadmin/lookup?lookupName=rfsSource")
		.success( function(result) {
			$scope.rfsSourceDataSource = result.content;
		});
			 
	$http.get("/rest/caseadmin/lookup?lookupName=rfsPrimaryType")
		.success( function(result) {
			$scope.rfsPrimaryTypeDataSource = result.content;
	});
	
	$http.get("/rest/caseadmin/lookup?lookupName=rfsStatus")
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
	$scope.selectedCasesCount=0;
	
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
			$scope.mainGridOptions.dataSource.data = result.data.content;
			if(result.data.content.length >= 500){
				$scope.warningClass = "inline-err";
			} else {
				$scope.warningClass = "inline-msg";
			}
			$scope.warning = result.data.messages.CASES_LIST;
			$scope.disabled = true;
			setTimeout(function(){
				// DELAY THE INITIALIZATION FOR THE TABLE CLICK ENVENT (CHECK IF CHECKBOX IS CLICKED)
				//$scope.mainGrid.table.on("click", ".checkbox" , selectRow);
			}, 1000);
		});
	});
	
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
				
	/*$scope.displaySelectedItems = function(){
		var items = $("#gridId").data("kendoGrid").dataSource().data();
		var selectedItems = '';
		items.forEach(function(item){
			if (item.selected){
				selectedItems += item.caseNumber; 
			}
		});
		alert(seletedItems);
	}*/
	
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
						field	: "rfsNumberDisplay",
						title	: "RFS",
						width	: "8%"
						},{
						field	: "caseNumberDisplay",
						title	: "Case",
						width	: "8%"
						},{
						field	: "rfsSource",
						title	: "Source",
						width	: "6%",
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
						width	: "14%"
						},{
						width	: "2%",
						filterable: false,
						sortable: false,
						template: "<input type='checkbox' class='checkbox' ng-click='caseSelected($event)' />",
						title: "<input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)'/>",
						attributes: {
							style: "text-align: center"
							}
						}]
				};
	// MAKE THE CHECK BOX PERSISTING
	var checkedIds = {};
	
	$scope.caseSelected = function(ev){
		console.log("Select Event");
		console.log(ev);
		//console.log($scope.dataItem.selected);
		var element =$(ev.currentTarget);
        var checked = element.is(':checked');
		console.log('checked or not');
        console.log(checked);
		
        var row = element.closest("tr");
		console.log('row');
		console.log(row);
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
		console.log('grid');
		console.log(grid);
        var dataItem = grid.dataItem(row);
		
		//remove from selection list if unchecked
		if (!checked) {
			 $scope.checkedIds.splice($.inArray(dataItem.caseNumber, $scope.checkedIds),1);
		} else {
			$scope.checkedIds.push(dataItem.caseNumber);
		}
		
		console.log("checkedIds");
		console.log($scope.checkedIds);
        
        if (checked) {
            row.addClass("k-state-selected");
        } else {
            row.removeClass("k-state-selected");
        }

		!ev.currentTarget.checked ?  $scope.selectedCasesCount -- :$scope.selectedCasesCount ++; 
	};
	
	function selectRow(){
		var checked		= this.checked,
			row			= $(this).closest("tr"),
			grid		= $("#grid").data("kendoGrid"),
			dataItem	= grid.dataItem(row);

			checkedIds[dataItem.caseNumber] = checked;
			//console.log(dataItem.caseNumber)	
	}

	// ON DATABOUND EVENT (WHEN PAGING) RESTORE PREVIOUSLY SELECTED ROWS
	function onDataBound(e) {

		var view = this.dataSource.view();
		for(var i = 0; i < view.length;i++){
			if(checkedIds[view[i].caseNumber]){
				this.tbody.find("tr[data-uid='" + view[i].uid + "']")
				//.addClass("k-state-selected")
                .find(".checkbox")
                .attr("checked","checked");
            }
        }
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

	// CUSTOM EMAIL WINDOW //////////////////////////////////////////////////

	$scope.emailWindowOptions = {
		width: 690,
		height:550,
		visible: false,	
		modal: true,
		scrollable : false,
		// title: "Daily Assignment Worksheet",
		// open: getDAWSdata
		// position: {
		// top: 400,
		// left: "center"
		// },
	};

	$scope.openEmailWindow = function(templateName) {

		var prepareEmailURL = "/rest/email/preparemail?templateName=" + templateName + "&caseNumbers=" + $scope.checkedIds.toString();
		DataFtry.getData(prepareEmailURL).then(function(result){
			console.log("Prepare Email output");
			console.log(result.data.content);
			$scope.mailMessage = result.data.content;
		});

		$scope.emailWindow.center().open();
	};

	
	$scope.exportRFSes = function() {
		var exportRFsURL = "/rest/document/export?fileName=clearingHouse_test.xls&caseNumbers="+$scope.checkedIds.toString();
	
		$http({
			method: 'GET',
			url: exportRFsURL,
			//headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/pdf' }, 
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'plain/text' }, 
			responseType: 'arraybuffer' 
			}).success(function (response) {
				//var file_pdf = new Blob([response], {type: 'application/pdf'});
				//var blob_xls = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				var file_txt = new Blob([response], {type: 'plain/text'});
				saveAs(file_txt, 'RFSesExport' + '.txt');
			});
	}
	
	$scope.sendEmail = function(){
		DataFtry.sendEmail($scope.mailMessage).then(function(result){
			console.log("SENT EMAIL !!!");
			console.log(result);
		});
		$scope.emailWindow.close();
		
	};

}]);
