'use strict';

angular.module('ECMSapp.assignCM', [])

.controller('AssignCMCtrl', [ '$scope', 'DataFtry',  function( $scope, DataFtry, $q){

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
		
		pageable	: {
						pageSize: 15
                        },
		// detailTemplate: kendo.template($("#detail-template").html()),
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
							width	: "15%"
						},{	
							field	: "caseNumber",
							title	: "RFS/Case",
							width	: "15%"
						},{
							field	: "dateReceived",
							title	: "Date Rcvd.",
							format	:"{0:MM/dd/yyyy}" ,
							width	: "15%"
						},{
							field	: "caseTypeAbbr",
							title	: "Type",
							width	: "5%"
						},{
							field	: "childCount",
							title	: "# of Vict.",
							width	: "5%",
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

		var detailRow = e.detailRow;
			kendo.bind(detailRow, e.data);

		var caseNumber = e.data.caseNumber;

		$scope.urlDetail = "/rest/caseadmin/incidentDetails?caseNumber=" + caseNumber;

		DataFtry.getData($scope.urlDetail).then(function(result){

			getNarrative(e, caseNumber);

			console.log(detailRow.find(".gridDetail"));

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
					{ field: "narrativeText", width: "50%" },
					{ field: "narrativeAuthor", width: "50%" },
				
			]
				});

			var index =1;

			function changeNarrative(evt){

				index = evt.sender.dataSource._page  -1;

				// $('#narrativeType').replaceWith("Narrative Type: " + data[ index  ].narrativeType);
				// $('#narrativeAuthor').replaceWith("Author: " + data[ index  ].narrativeAuthor);
				// $('#narrativeDate').replaceWith("Narrative Date: " + data[ index ].narrativeDate);
			}

		/*	var div			= $('#detailRowTest');
			var narrativeText	= data[ index  -1 ].narrativeText;
			var narrativeType	= data[ index  -1 ].narrativeType;
			var author		= data[ index  -1 ].narrativeAuthor;
			var narrativeDate	= data[ index  -1 ].narrativeDate;

			new  acmDetailRow( div, narrativeText, narrativeType, author, narrativeDate)*/

			$scope.narrativeType = data[index -1].narrativeType;
			$scope.narrativeAuthor = data[index -1].narrativeAuthor;
			$scope.narrativeDate = data[index -1].narrativeDate;
			// $scope.narrativeText = data[index -1].narrativeText;

		});
	}

/*
	$scope.detailGridOptions = function($scope, dataItem) {

		var data = {};

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
					};
			};*/
	 
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
       

}]);
