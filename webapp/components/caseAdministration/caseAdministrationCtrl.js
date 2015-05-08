'use strict';

angular.module('ECMSapp.adminMain', [])

.controller('MainCaseAdminCtrl', ['$rootScope', '$scope', 'DataFtry', '$http', function($rootScope, $scope, DataFtry, $http){
	
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

	$http.get("/rest/common/lookup?lookupName=rfsSource")
		.success( function(result) {
			$scope.rfsSourceDataSource = result.content;
		});
			 
	$http.get("/rest/common/lookup?lookupName=rfsPrimaryType")
		.success( function(result) {
			$scope.rfsPrimaryTypeDataSource = result.content;
	});
	
	$http.get("/rest/common/lookup?lookupName=rfsStatus")
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
			$scope.warning = result.data.messages.RESULTS_LIST;
			$scope.caseNum = 0; // KEEP TRACK OF THE NUMBER OF SELECTED CASES
			$scope.disabled = true;
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
						template: "<input type='checkbox' ng-model='dataItem.selected' ng-click='caseSelected($event)' />",
						title: "<input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)'/>",
						attributes: {
							style: "text-align: center"
							}
						}]
				};
	$scope.toggleSelectAll = function(ev) {

		var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
		var items = grid.dataSource.data();
			items.forEach(function(item){
			item.selected = ev.target.checked;
		});
		ev.currentTarget.checked ? $scope.caseNum = grid.dataSource.total() : $scope.caseNum = 0; 
		console.log($scope.caseNum);
	};

	var checkedIds = {};
	
	$scope.caseSelected = function(ev){

		!ev.currentTarget.checked ?  $scope.caseNum -- :$scope.caseNum ++; 

		var element =$(ev.currentTarget);
        var checked = element.is(':checked');
        var row = element.closest("tr");
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var dataItem = grid.dataItem(row);
		
		//remove from selection list if unchecked
		if (!checked) {
			 $scope.checkedIds.splice($.inArray(dataItem.rfsNumber, $scope.checkedIds),1);
		} else {
			$scope.checkedIds.push(dataItem.rfsNumber);
		}
	};

	// DISABLE/ENABLE BUTTON WHEN CASE ARE SELECTED /////////////
	$scope.buttonDisabledClass = "linkButtonDisabled"

	$scope.$watch('caseNum', function() {

		$scope.caseNum == 0? $scope.buttonDisabledClass = "linkButtonDisabled" : $scope.buttonDisabledClass = ""


	});
	
	
	// ON DATABOUND EVENT (WHEN PAGING) RESTORE PREVIOUSLY SELECTED ROWS
	function onDataBound(e) {

		var view = this.dataSource.view();
		for(var i = 0; i < view.length;i++){
			if(checkedIds[view[i].rfsNumber]){
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
		scrollable : false
	};

	$scope.openEmailWindowWithPreparation = function() {
		var emailTemplateName = "RFSes";
		var attachment = {
                "template": "RFSes",
                "mediaType": "application/pdf"
              };
		
		DataFtry.prepareEmail(templateName,$scope.checkedIds.toString()).then(function(result){
			console.log("Prepare Email output");
			console.log(result.data.content);
			$scope.mailMessage = result.data.content;
		});

		$scope.emailWindow.center().open();
	};

	$scope.openEmailWindow = function() {
		$scope.mailMessage = {
			from:  $rootScope.userId + "@ncmec.org",
			replyTo:null,
			to: $rootScope.userId + "@ncmec.org",
			cc: [],
			bcc: null,
			subject: "Attention: New RFSes",
			text: "Please find attached RFS Cases: " + $scope.checkedIds.toString(),
			emailMetadata: {
				template: "RFSes",
				subject: $scope.checkedIds.toString()
			},
			attachments : [
				{
					template: "RFSes",
					mediaType: "application/pdf",
					rfses: $scope.checkedIds.toString()
				
				}
			]
		};
		$scope.attachmentFileName = "RFSes.pdf";
			
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
	
	$scope.exportRFSes = function() {
		var exportRFsURL = "/rest/document/export/rfses?fileName=rfses.xlsx&rfsNumbers=" + $scope.checkedIds.toString();
		//var exportRFsURL = "http://reportsdevapp1.ncmecad.net:8080/rest_v2/reports/ncmec/sandbox/RfsReport.pdf?rfsNumbers=" + $scope.checkedIds.toString();
	
		$http({
			method: 'GET',
			url: exportRFsURL,
			//headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/pdf' }, 
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'plain/text' }, 
			responseType: 'arraybuffer' 
			}).success(function (response) {
				//var file_pdf = new Blob([response], {type: 'application/pdf'});
				var blob_xls = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
				//var file_txt = new Blob([response], {type: 'plain/text'});
				saveAs(file_pdf, 'RFSesExport' + '.xls');
			});
	}

}]);
