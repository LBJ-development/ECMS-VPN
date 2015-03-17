'use strict';

angular.module('ECMSapp.assignCM', [])

.controller('AssignCMCtrl', ['$scope', 'DataFtry',  function($scope, DataFtry, $q){
	
	// INITIAL DATE RANGE //////////////////////////////////////////////////
		var todayDate 		= new Date();
		var dateOffset 		= (24*60*60*1000) * 1; //DEFAULT: 2 DAYS 
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
								
		console.log("FROM INITIAL DATE RANGE: "  + $scope.urlBase);
		
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
	};
	function formatEndingDate(){		
		var enDate 	= $scope.endingDate.getDate() ;
		var enMonth = $scope.endingDate.getMonth() + 1;
		var enYear 	= $scope.endingDate.getFullYear();
		return enYear + "-" + enMonth  + "-" + enDate;
	};
	
	// GRID ////////////////////////////////////////////////////////////////////
	
	var result = {};

	// WATCH FOR A DATE RANGE CHANGE
	$scope.$watch('urlBase', function(newValue, oldValue) {
		
		//console.log("FROM WATCH: "  + $scope.urlBase);

		DataFtry.getData($scope.urlBase).then(function(result){
			
			$scope.mainGridOptions.dataSource.data = result.data.content;
			
			//console.log("FROM POS 1: " + $scope.mainGrid.table);
	
			//setTimeout(function(){
				
				//console.log("FROM POS 2: " + $scope.mainGrid.table);
				
				// DELAY THE INITIALIZATION FOR THE TABLE CLICK ENVENT (CHECK IF CHECKBOX IS CLICKED)
				//$scope.mainGrid.table.on("click", ".checkbox" , selectRow);
				
			//}, 1000);
		})
	});
	// MAIN GRID SETTINGS //////////////////////////////////////////////////////////////////////////////////////
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
								childCount		: { type: "number"	},
								alerts			: { type: "string" 	},
								state			: { type: "string"	},
								caseManager		: { type: "string"	},
								selectedID		: {editable: false, nullable: true	}
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
						
		detailTemplate: kendo.template($("#detail-template").html()),
    	detailInit: function(e) {
			// without this line, detail template bindings will not work
			kendo.bind(e.detailRow, e.data);
		},
						
      //dataBound: function() {
                           // this.expandRow(this.tbody.find("tr.k-master-row").first());
                        //},

		columns		: [{
						field	: "alerts",
						title	: "Alerts",
						width	: "10%"
						},{
						field	: "source",
						title	: "Source",
						width	: "15%",
						filterable: {
                        	ui			: sourceFilter,
							operators	: {
      							string	: {
        						eq		: "Equal to",
      								}
                         		}
							}
						},{
							
						field	: "caseNumber",
						title	: "RFS/Case",
						width	: "15%"
						},{
						field	: "dateReceived",
						title	: "Date Rcvd.",
            			format	:"{0:MM/dd/yyyy}" ,
						width	: "15%",
						filterable: false,
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
						field	: "incidentDate",
						title	: "Incid. Date",
						format	:"{0:MM/dd/yyyy}" ,
						width	: "15%"
						},{
						field	: "caseManager",
						title	: "Assignee",
						width	: "20%"
						}]
				};
				
	// GRID DETAIL SETTINGS /////////////////////////////////////////////////////////////////////////////////////
	
	$scope.detailGridOptions = function($scope, dataItem) {

		var data = {};
		
		$scope.urlBase = "/rest/caseadmin/incidentDetails?caseNumber=1245289";
			   
			DataFtry.getData($scope.urlBase).then(function(result){

				$scope.detailGridOptions.dataSource.data = result.data.content;

				console.log("FROM DETAIL GRID OPTIONS");
				console.log(result);
			});
				
				return  {

					dataSource:{
						data: data,
						schema:{
								model: {
									fields:{
										childAge			: { type: "string" 	},
										childFirstName		: { type: "string"	},
										childLastName		: { type: "string"	},
										childRecoveryStatus	: { type: "string"	}
										}
									}
								}
							},
                    scrollable: false,
                    sortable: false,
                    pageable: false,
					columns: [
                   		{ field: "childAge", title:"Child age", width: "56px" },
                    	{ field: "childFirstName", title:"Child first name", width: "110px" },
                    	{ field: "childLastName", title:"Child last name" },
                   		{ field: "childRecoveryStatus", title: "Recovery status", width: "190px" }
                    	]
					}
				
				
			};
	
	/*var detailData = {};*/
	 
/*	$scope.detailGridOptions =  {

					//dataSource: result,

                    scrollable: false,
                    sortable: false,
                    pageable: false,
					columns: [
                    { field: "childAge", title:"Child age", width: "56px" },
                    { field: "childFirstName", title:"Child first name", width: "110px" },
                    { field: "childLastName", title:"Child last name" },
                    { field: "childRecoveryStatus", title: "Recovery status", width: "190px" }
                    ]
		
		
	};*/
			
// PREVIOUS GRID DETAIL ///////////////////////////////////////////////////////////			
/*	$scope.detailGridOptions = function($scope, dataItem) {
		return {
			dataSource: {
                        type: "odata",
                        transport: {
                            read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
                        },
                        serverPaging: true,
                        serverSorting: true,
                        serverFiltering: true,
                        pageSize: 5
                    },
                    scrollable: false,
                    sortable: false,
                    pageable: true,
                    columns: [
                    { field: "OrderID", title:"ID", width: "56px" },
                    { field: "ShipCountry", title:"Ship Country", width: "110px" },
                    { field: "ShipAddress", title:"Ship Address" },
                    { field: "ShipName", title: "Ship Name", width: "190px" }
                    ]
                };	
            };*/
       
				
	// MAKE THE CHECK BOX PERSISTING
 	var checkedIds = {};
	
	function selectRow(){
		var checked		= this.checked,
        	row			= $(this).closest("tr"),
        	grid		= $("#grid").data("kendoGrid"),
        	dataItem	= grid.dataItem(row);

       	 checkedIds[dataItem.caseNumber] = checked;
		 //console.log(dataItem.caseNumber)	
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
