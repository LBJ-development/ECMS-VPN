'use strict';

angular.module('ECMSapp.assignCM', [])

.controller('AssignCMCtrl', [ '$scope', 'DataFtry',  function( $scope, DataFtry, $q){


	// DAILY ASSIGNMENT WORKSHEET WINDOW //////////////////////////////////////////////////

	$scope.dawsOptions = {
		width: "80%",
		visible: false,
		maxWidth: 1200,
		height: "80%",
		modal: true,
		// title: "Daily Assignment Worksheet",
		open: getDAWSdata
		// position: {
		// top: 400,
		// left: "center"
		// },
	};

	$scope.todayDate = formatDate();

	function getDAWSdata(){

		var url = "/rest/casemanager/worksheet/current";

		DataFtry.getData(url).then(function(result){

			$scope.dawsGridOptions.dataSource.data = result.data.content;
		});
	};

	$scope.dawsGridOptions =  { 
		dataSource: {
			data: result,
				schema: {
					model: {
						fields: {
								name		: { type: "string" , editable: false},
								location	: { type: "string",  editable: false},
								cmGroup	: { type: "string" , editable: false},
								otherGroup	: { type: "string",  editable: false },
								faRegion	: { type: "string",  editable: false },
								foreignLang	: { type: "string",  editable: false },
								ooo		: { type: "string" },
								onCall		: { type: "string" },
								shift		: { type: "string" },
								telecommute	: { type: "string" }
								},
							}
						},
					},
		sortable	: true,
		scrollable	: true,
		height 		: "83%",
		editable	: true,
		columns		: [{
						field	: "name",
						title	: "Name",
						width	: "15%",
					},{
						field	: "location",
						title	: "Loc.",
						width	: "6%"
					},{	
						field	: "cmGroup",
						title	: "CM Grp.",
						width	: "7%"
					},{
						field	: "otherGroup",
						title	: "Other",
						width	: "6%"
					},{
						field	: "faRegion",
						title	: "FA Region",
						width	: "10%"
					},{
						field	: "foreignLang",
						title	: "Language(s)",
						width	: "10%"
					},{
						field	: "ooo",
						title	: "OOO",
						width	: "6%",
						editor: categoryDropDownEditor,
					},{
						field	: "onCall",
						title	: "On-call",
						width	: "6%",
						editor: categoryDropDownEditor,
					},{
						field	: "shift",
						title	: "Shift hrs",
						width	: "17%"
					},{
						field	: "telecommute",
						title	:"Telecom.",
						width	: "7%",
						editor: categoryDropDownEditor,
					

					} ]
				};

	function categoryDropDownEditor(container, options) {
		 $('<input required data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"/>')
		.appendTo(container)
		.kendoDropDownList({
			autoBind: false,
			dataSource: {
				data :  [
					{ text: "Yes", value: "Yes" },
					{ text: "No", value: "No" }
					],
				}
			});
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
		console.log("Calling submitSearch:" + $scope.submitSearch);
		DataFtry.getCasesForAssignment(formatStartingDate(), formatEndingDate()).then(function(result){
			$scope.mainGridOptions.dataSource.data = result.data.content;
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
								caseNumber		: { type: "string"	},
								dateReceived	: { type: "date"	},
								incidentDate	: { type: "date"	},
								source			: { type: "string"	},
								caseTypeAbbr	: { type: "string"	},
								childCount		: { type: "number"	},
								alerts			: { type: "string"	},
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
	function detailIExpand(e) {

		// console.log("FROM EXPAND ");
		// console.log(e);

	}
	function detailInit(e) {
/*var grid = e.detailRow.find("[data-role=grid]").data("kendoGrid");
		grid.dataSource.read();*/

		 console.log("FROM INIT");
		 console.log(e);

		var detailRow = e.detailRow;
			kendo.bind(detailRow, e.data);
			// console.log(grid.tbody.find("tr.k-master-row").first());
			// console.log(e.data.caseNumber);

		var caseNumber = e.data.caseNumber;

		$scope.urlDetail = "/rest/caseadmin/incidentDetails?caseNumber=" + caseNumber;

		DataFtry.getData($scope.urlDetail).then(function(result){

			getNarrative(e, caseNumber);

			detailRow.find(".gridDetail").kendoGrid({

				dataSource:{
						data: result.data.content,	
							},
				scrollable: false,
				sortable: false,
				pageable: false,
				columns: [
					{ field: "childRecoveryStatus", title: "Recovery Status", width: "12%" },
					{ field: "incidentType", title: "Child Case Type", width: "17%" },
					{ field: "incidentState", title: "Inc. State", width: "45px" },
					{ field: "parentRelationship", title: "P/G Relationship", width: "15%" },
					{ field: "foreignLanguage", title: "Foreign Language", width: "12%" },
					{ field: "childFirstName", title:"Child First Name", width: "14%" },
					{ field: "childLastName", title:"Child Last Name", width: "14%" },
					{ field: "childAge", title:"Child Age", width: "45px" },
					{ field: "criticalEndangerements", title: "Endangerments", width: "20%" }
					]
				});
			});
		}

	function getNarrative(e, caseNumber){

		// $Scope.dataItem = detailRow.data;

		var detailRow = e.detailRow;
			kendo.bind(detailRow, e.data);

		$scope.urlNarrative = "/rest/caseadmin/narratives?caseNumber=" + caseNumber;

		var grid = {};

		DataFtry.getData($scope.urlNarrative).then(function(result){

			var data = result.data.content;

			grid = detailRow.find(".gridNarrative").kendoGrid({

				dataSource:{
						data: data,
						pageSize: 1
						}, 
				scrollable: true,
				sortable: false,
				pageable: true,
				height	: 300,
				dataBound: changeNarrative,
				// toolbar: kendo.template($("#toolbar-template").html()),
				columns: [
					{ field: "narrativeText", width: "100%" ,

					headerAttributes: {
						style: "display: none"
						}
						},
					]
				});

			var index =1;

			function changeNarrative(evt){

				index = evt.sender.dataSource._page  -1;

				// $('#narrativeType').replaceWith("Narrative Type: " + data[ index  ].narrativeType);
				// $('#narrativeAuthor').replaceWith("Author: " + data[ index  ].narrativeAuthor);
				// $('#narrativeDate').replaceWith("Narrative Date: " + data[ index ].narrativeDate);
			}

			$scope.narrativeType = data[index -1].narrativeType;
			$scope.narrativeAuthor = data[index -1].narrativeAuthor;
			$scope.narrativeDate = data[index -1].narrativeDate;
			// $scope.narrativeText = data[index -1].narrativeText;

			getCaseManager();
		});
	}

	function getCaseManager(){

		$scope.urlCM = "/rest/casemanager/list/all";

		DataFtry.getData($scope.urlCM).then(function(result){

			console.log(result);

			$("#caseManagers").kendoDropDownList({
				dataTextField: "name",
				dataValueField: "id",
				dataSource: result.data.content
			});

			$("#caseGroups").kendoDropDownList({

				select: function(e) {
   					 var item = e.item;
    					var text = item.text();
    					console.log(text);
    // Use the selected item or its text
					  }
				});

			
			// console.log (result.data.content);

			/*$("#testDrop").kendoDropDownList({
				dataTextField: "text",
				dataValueField: "value",
				dataSource: data,
				index: 0
			});*/
/*
			$scope.dataCaseGroup  = {
				dataTextField: "name",
				dataValueField: "id",
				dataSource:  result.data.content
			};*/

			/*var caseGroups = $("#caseGroups").data("kendoDropDownList");

			caseGroups.select(function(dataItem) {

				console.log(dataItem);
				return dataItem;
			});*/
		});

	}
	
	$scope.detailGridOptions = function($scope, dataItem) {


			// console.log("FROM DETAILGRIDOPTIONS");
			// console.log(dataItem);


		// console.log("DETAIL GRID OPTION");
		/*var data = {};

				return  {

					dataSource:{
						data: data,
						schema:{
								model: {
									fields:{
										childAge			: { type: "string"	},
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
					};*/
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
/*	var checkedIds = {};
	
	function selectRow(){
		var checked		= this.checked,
			row			= $(this).closest("tr"),
			grid		= $("#grid").data("kendoGrid"),
			dataItem	= grid.dataItem(row);

			checkedIds[dataItem.caseNumber] = checked;

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
		*/
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



}])

.directive ('detailRow', function () {
	return {
	restrict: 'E',
	// scope :{},
	controller: 'AssignCMCtrl',
	templateUrl: 'components/caseAdministration/detailRow.html',
	link: function (scope, element, attrs){
        }
    };
});



