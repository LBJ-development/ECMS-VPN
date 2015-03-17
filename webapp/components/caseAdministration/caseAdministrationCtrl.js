'use strict';

angular.module('ECMSapp.adminMain', [])

.controller('MainCaseAdminCtrl', ['$scope', 'DataFtry',  function($scope, DataFtry){

	// INITIAL DATE RANGE //////////////////////////////////////////////////
	var todayDate 		= new Date();
	var dateOffset 		= (24*60*60*1000) * 1; //DEFAULT: 1 DAY 
	var startingDate 	= new Date(todayDate.getTime() - dateOffset);
	var endingDate 		= todayDate;
	$scope.startingDate	= startingDate;
	$scope.endingDate	= endingDate;
		
	$scope.urlBase =	//"http://cc-devapp1.ncmecad.net:8080/ecms-staging/rest/caseadmin/cases?startDate=" +
								"/rest/caseadmin/cases?startDate=" +  
								formatStartingDate() + 
								//"2015-02-15" +
								"&endDate=" + 
								formatEndingDate();
								//"2015-02-17";
								
	//console.log("FROM INITIAL DATE RANGE: "  + $scope.urlBase);
		
	// WHEN DATE RANGE CHANGES //////////////////////////////////////////////////
	$scope.changeDateRange = function(){

		$scope.urlBase =	//"http://cc-devapp1.ncmecad.net:8080/ecms-staging/rest/caseadmin/cases?startDate=" + 
									"/rest/caseadmin/cases?startDate=" + 
									formatStartingDate() + 
									"&endDate=" + 
									formatEndingDate();
									
	   //console.log("FROM CHANGE DATE RANGE: "  + $scope.urlBase);
	   };

	function formatStartingDate(){		
		var stDate 	= $scope.startingDate.getDate() ;
		var stMonth = $scope.startingDate.getMonth() + 1;
		var stYear 	= $scope.startingDate.getFullYear();
		return stYear + "-" + stMonth  + "-" + stDate;
	}

	function formatEndingDate(){		
		var enDate 	= $scope.endingDate.getDate() ;
		var enMonth = $scope.endingDate.getMonth() + 1;
		  var enYear 	= $scope.endingDate.getFullYear();
		return enYear + "-" + enMonth  + "-" + enDate;
	}

	// QUERY OPTIONS ///////////////////////////////////////////////////////////////////////
	$scope.RFSCase = {
        placeholder: "RFS/Case",
        dataTextField: "text",
        dataValueField: "value",
        valuePrimitive: true,
        autoBind: false,
        dataSource: [
            { text: "RFS", value: "1" },
            { text: "Case", value: "2" }
            ]
        };
    $scope.selectedRFSCase = [ 1, 2 ];


    $scope.sourceType = {
        placeholder: "Select sources",
        dataTextField: "text",
        dataValueField: "value",
        valuePrimitive: true,
        autoBind: false,
        dataSource: [
            { text: "Call", value: "1" },
            { text: "Email", value: "2" },
            { text: "Internet", value: "3" },
            { text: "Fax", value: "4" },
            { text: "Electronic", value: "5" },
            { text: "Online Sighting Form", value: "6" },
            { text: "Hague App", value: "7" },
            { text: "NCIC", value: "8" },
            { text: "NamUs", value: "9" }
            ]
        };
    $scope.selectedSources = [ 1, 2 ];

    $scope.RCType = {
        placeholder: "Select R/C Type",
        dataTextField: "text",
        dataValueField: "value",
        valuePrimitive: true,
        autoBind: false,
        dataSource: [
            { text: "Intake", value: "1" },
            { text: "Lead", value: "2" },
            { text: "TA", value: "3" },
            { text: "Cybertip", value: "4" },
            { text: "ERU", value: "5" },
            { text: "FA", value: "6" },
            { text: "NFA", value: "7" },
            { text: "LIM", value: "8" },
            { text: "5779", value: "9" },
            { text: "UHR", value: "10" },
            { text: "DECC", value: "11" },
            { text: "UMR", value: "12" },
            { text: "RCST", value: "13" },
            { text: "ATT", value: "14" }
            ]
        };
    $scope.selectedType = [ 1, 2, 3 ];

    $scope.RCStatus = {
        placeholder: "Select R/C Status",
        dataTextField: "text",
        dataValueField: "value",
        valuePrimitive: true,
        autoBind: false,
        dataSource: [
            { text: "Active", value: "1" },
            { text: "Recovered", value: "2" },
            { text: "Close", value: "3" }
            ]
        };
    $scope.selectedStatus = [ 1, 3 ]
	
	// GRID ////////////////////////////////////////////////////////////////////
	
	var result = {};

	// WATCH FOR A DATE RANGE CHANGE
	$scope.$watch('urlBase', function(newValue, oldValue) {
		
		//console.log("FROM WATCH: "  + $scope.urlBase);

		DataFtry.getData($scope.urlBase).then(function(result){

			//console.log(result);
			$scope.mainGridOptions.dataSource.data = result.data.content;
			$scope.warning = result.data.messages.CASES_LIST;
			$scope.disabled = true;
			
			//console.log("FROM POS 1: " + $scope.mainGrid.table);
	
			setTimeout(function(){
				
					//console.log("FROM POS 2: " + $scope.mainGrid.table);
				
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
