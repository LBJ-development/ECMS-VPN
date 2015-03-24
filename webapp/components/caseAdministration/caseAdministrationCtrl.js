'use strict';

angular.module('ECMSapp.adminMain', [])

.controller('MainCaseAdminCtrl', ['$scope', 'DataFtry', '$http', 'ConfigService',  function($scope, DataFtry, $http, ConfigService){
	
	$scope.casesearch = {
		startDate: null,
		endDate: null,
		rcType: "-1", //set default value to ALL for drop-down list
		rcSource: "-1", //set default value to ALL for drop-down list
		rcStatus: "-1" //set default value to ALL for drop-down list
	};

	$scope.submitSearch = function(){
		// data massaging
		// format dates
		$scope.casesearch.startDate = formatstartDate();
		$scope.casesearch.endDate = formatendDate();
		
		//handle null and  convert to string array into comma-separated string
		if ($scope.casesearch.rcType === null){
			console.log('assigning -1');
			$scope.casesearch.rcType = "-1";
		}
		
		if ($scope.casesearch.rcSource === null){
			console.log('assigning -1');
			$scope.casesearch.rcSource = "-1";
		}
		
		if ($scope.casesearch.rcStatus === null){
			console.log('assigning -1');
			$scope.casesearch.rcStatus = "-1";
		}
		$scope.casesearch.rcType = $scope.casesearch.rcType.toString();
		$scope.casesearch.rcSource = $scope.casesearch.rcSource.toString();
		$scope.casesearch.rcStatus = $scope.casesearch.rcStatus.toString(); 
		
		$scope.submissionCount ++;
	};

	function formatstartDate(){		
		var stDate 	= $scope.startDate.getDate() ;
		var stMonth = $scope.startDate.getMonth() + 1;
		var stYear 	= $scope.startDate.getFullYear();
		return stYear + "-" + stMonth  + "-" + stDate;
	}

	function formatendDate(){		
		var enDate 	= $scope.endDate.getDate() ;
		var enMonth = $scope.endDate.getMonth() + 1;
		var enYear 	= $scope.endDate.getFullYear();
		
		return enYear + "-" + enMonth  + "-" + enDate;
	}

	$http.get("/rest/caseadmin/lookup?lookupName=lt_rcsource")
		 .success( function(result) {
			 $scope.rcSourceDataSource = result.content;
		 });
		 
	$http.get("/rest/caseadmin/lookup?lookupName=lt_rctype")
		 .success( function(result) {
			 $scope.rcTypeDataSource = result.content;
	});
	
	$http.get("/rest/caseadmin/lookup?lookupName=lt_rcstatus")
		 .success( function(result) {
			 $scope.rcStatusDataSource = result.content;
	});
		
	var result = {};
	// QUERY OPTIONS ///////////////////////////////////////////////////////////////////////
	// INITIAL DATE RANGE //////////////////////////////////////////////////
	var todayDate 		= new Date();
	var dateOffset 		= (24*60*60*1000) * 1; //DEFAULT: 1 DAY 
	$scope.startDate 	= new Date(todayDate.getTime() - dateOffset);
	$scope.endDate 		= todayDate;
	
	$scope.casesearch.startDate = formatstartDate();
	$scope.casesearch.endDate = formatendDate();
	$scope.submissionCount = 0;
	
	//Initial Load
	$scope.submitSearch();
	
	// GRID ////////////////////////////////////////////////////////////////////
	// WATCH FOR A Search Submission
	$scope.$watch('submissionCount', function(newValue, oldValue) {
		
		console.log("FROM WATCH: submissionCount ="  + $scope.submissionCount);
		if (newValue == 0){
			return;
		}

		DataFtry.getCases($scope.casesearch).then(function(result){
			$scope.mainGridOptions.dataSource.data = result.data.content;
			$scope.warning = result.data.messages.CASES_LIST;
			$scope.disabled = true;
			setTimeout(function(){
				// DELAY THE INITIALIZATION FOR THE TABLE CLICK ENVENT (CHECK IF CHECKBOX IS CLICKED)
				//$scope.mainGrid.table.on("click", ".checkbox" , selectRow);
			}, 1000);
		})
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
								caseNumber		: { type: "string" 	},
								dateReceived	: { type: "date"	},
								incidentDate	: { type: "date"	},
								source			: { type: "string"	},
								caseTypeAbbr	: { type: "string" 	},
								caseStatus		: { type: "string"	},
								alerts			: { type: "string" 	},
								state			: { type: "string"	},
								caseManager		: { type: "string"	}
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
						field	: "alerts",
						title	: "Alerts",
						width	: "8%"
						},{
						field	: "dateReceived",
						title	: "Date Rcvd.",
            			format	:"{0:MM/dd/yyyy}" ,
						width	: "9%",
						filterable: false,
						},{
						field	: "caseNumber",
						title	: "RFS/Case",
						width	: "8%"
						},{
						field	: "source",
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
						field	: "caseTypeAbbr",
						title	: "Type",
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
						field	: "caseStatus",
						title	: "Status",
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
						field	: "state",
						title	: "State",
						width	: "5%",
						filterable: {
							operators	: {
      								string	: {
        							eq		: "Equal to",
      										}
                         				}
									}
						},{
						field	: "incidentDate",
						title	: "Incid. Date",
						format	:"{0:MM/dd/yyyy}" ,
						width	: "9%"
						},{
						field	: "caseManager",
						title	: "Assignee",
						width	: "14%"
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
	// MAKE THE CHECK BOX PERSISTING
 	var checkedIds = {};
	
	function selectRow(){
		var checked		= this.checked,
        	row			= $(this).closest("tr"),
        	grid		= $("#grid").data("kendoGrid"),
        	dataItem	= grid.dataItem(row);

       	 checkedIds[dataItem.caseNumber] = checked;
		 console.log(dataItem.caseNumber)	
	};

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
    };
		
	// FILTERING WITH DROPDOWN MENU 
	var status 	= ["Active", "Recovered", "Closed"],
		types 	= ["ERU", "FA", "NFA", "LIM", "5779", "UHR", "DECC", "RCST", "ATT", "UMR"],
		sources = ["Call", "Email", "Internet", "WebService", "Online Sighting Form"];
			
	function typeFilter(element) {
		//element.kendoMultiSelect({
		element.kendoDropDownList({
			dataSource: types,
			//multiple: "multiple",
			optionLabel: "--Select Value--"
		});
	};
		
	function statusFilter(element) {
		element.kendoDropDownList({
			dataSource: status,
			optionLabel: "--Select Value--"
		});
	};
		
	function sourceFilter(element) {
		element.kendoDropDownList({
			dataSource: sources,
			optionLabel: "--Select Value--"
		});
	};
}])
