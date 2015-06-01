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
		$scope.today = new Date()
		// data massaging
		console.log("startDate valid:" + ($scope.startDate instanceof Date));
		console.log("endDate valid:" + ($scope.endDate instanceof Date));
		
		//Reset everytime search is submitted
		$scope.checkedIds =[];
		
		if (!($scope.startDate instanceof Date)){
			alert("Error: Enter correct Start Date(mm/dd/yyyy) OR  Pick a date from DatePicker widget.");
			return;
		}
		
		if (!($scope.endDate instanceof Date)){
			alert("Error: Enter correct End Date(mm/dd/yyyy) OR  Pick a date from DatePicker widget.");
			return;
		}
		
		if ($scope.startDate > $scope.endDate) {
			alert("Start Date can't be after End Date");
			return;
		}

		
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
		
	//Initial Load
	$scope.submitSearch();
	
	// GRID ////////////////////////////////////////////////////////////////////
	// WATCH FOR A Search Submission
	$scope.$watch('submissionCount', function(newValue, oldValue) {
		
		//console.log("FROM WATCH: submissionCount ="  + $scope.submissionCount);
		if (newValue === 0){
			return;
		}

		$scope.filterSourcesList = [];
		$scope.filterRFSTypeList = [];
		$scope.filterRFSIncidentStateList= [];
		$scope.filterRFSStatusList = [];
		$scope.filterCaseManagerList = [];
		
		var tempSource = "";
		var tempRFSType= "";
		var tempIncidentState= "";
		var tempRFSStatus = "";
		var tempCaseManager = "";
		DataFtry.getRFSes($scope.searchCriteria).then(function(result){
			$scope.mainGridOptions.dataSource.data = result.data.content;
			//console.log(result.data.content);
			$.each(result.data.content, function(idx, rfs){ 
				
					//rfs source filter
					tempSource 	= rfs['rfsSource'];
					if (nonNullUndefined(tempSource)) {	
						//console.log('adding '+ tempSource);
						if ($.inArray(tempSource, $scope.filterSourcesList) < 0) {
							$scope.filterSourcesList.push(tempSource);
						}
					}
					
					//rfstype filter
					tempRFSType	= rfs['rfsTypeDisplay'];
					if (nonNullUndefined(tempRFSType) )	{
						//console.log('adding '+ tempRFSType);
						if ($.inArray(tempRFSType, $scope.filterRFSTypeList) < 0) {
							$scope.filterRFSTypeList.push(tempRFSType);
						}
					}
					
					//rfstate filter
					tempIncidentState	= rfs['rfsIncidentState'];
					if (nonNullUndefined(tempIncidentState) )	{
						//console.log('adding '+ tempIncidentState);
						if ($.inArray(tempIncidentState, $scope.filterRFSIncidentStateList) < 0) {
							$scope.filterRFSIncidentStateList.push(tempIncidentState);
						}
					}
					
					//rfs status
					tempRFSStatus	= rfs['rfsStatus'];
					if (nonNullUndefined(tempRFSStatus) )	{
						//console.log('adding '+ tempRFSStatus);
						if ($.inArray(tempRFSStatus, $scope.filterRFSStatusList) < 0) {
							$scope.filterRFSStatusList.push(tempRFSStatus);
						}
					}
					
					//rfs assignee list caseManager=(null)
					tempCaseManager	= rfs['caseManager'];
					if (nonNullUndefined(tempCaseManager) )	{
						if ($.inArray(tempCaseManager, $scope.filterCaseManagerList) < 0) {
							$scope.filterCaseManagerList.push(tempCaseManager);
						}
					}
				
			});
			//console.log($scope.filterSourcesList);
			//console.log($scope.filterRFSTypeList);
			//console.log($scope.filterRFSIncidentStateList);
			
			if(result.data.content.length >= 500){
				$scope.warningClass = "inline-err";
			} else {
				$scope.warningClass = "inline-msg";
			}
			$scope.warning = result.data.messages.RESULTS_LIST;
			$scope.caseNum = 0; // KEEP TRACK OF THE NUMBER OF SELECTED CASES
			$scope.disabled = true;
			setTimeout(function(){
				// DELAY THE INITIALIZATION FOR THE TABLE CLICK ENVENT (CHECK IF CHECKBOX IS CLICKED)
				//$scope.mainGrid.table.on("click", ".checkbox" , selectRow);
			}, 1000);
		});
	});
	
	var  nonNullUndefined = function (value){
		if( 'undefiend' != value && null !== value )
			return true
		else
			return false
	}
	
	$scope.enableSumbitBtn = function() {
		$scope.disabled = false;
	};
	
	// MAKE THE CHECK BOX PERSISTING
	$scope.checkedIds =[];
	$scope.selectItem = function(item){
		//remove from selection list if unchecked
		if (!item.selected) {
			while ($.inArray(item.rfsNumber, $scope.checkedIds) >=0) {
				console.log(item.rfsNumber + "=" + $.inArray(item.rfsNumber, $scope.checkedIds));
				$scope.checkedIds.splice($.inArray(item.rfsNumber, $scope.checkedIds),1);
			}
		} else {
			if (!($.inArray(item.rfsNumber, $scope.checkedIds) >=0)){
				$scope.checkedIds.push(item.rfsNumber);
			}
		}
        
	}
	
	$scope.caseSelected = function(ev){
		var element =$(ev.currentTarget);
        var checked = element.is(':checked');
        var row = element.closest("tr");
        var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        var item = grid.dataItem(row);
		
		$scope.selectItem(item);

	};
	
	$scope.toggleSelectAll = function(ev) {
        //var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
        //var items = grid.dataSource.view(); //This gets only current page view
		
		//select only filtered data
		var dataSource = $(ev.target).closest("[kendo-grid]").data("kendoGrid").dataSource;
        var filters = dataSource.filter();
        var allData = dataSource.data();
        var query = new kendo.data.Query(allData);
        var items = query.filter(filters).data;
		console.log(items);
		
        items.forEach(function(item){
			item.selected = ev.target.checked;
			$scope.selectItem(item);
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
						refresh: false,
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
						width	: "6%"
						,
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
						width	: "14%",
						filterable: {
							ui			: caseManagerFilter,
							operators	: {
								string	: {
								eq		: "Equal to"
									}
								}
							}
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
		

	
	// ON DATABOUND EVENT (WHEN PAGING) RESTORE PREVIOUSLY SELECTED ROWS
	function onDataBound(e) {

		var view = this.dataSource.view();
		for(var i = 0; i < view.length;i++){
			if($scope.checkedIds[view[i].rfsNumber]){
				this.tbody.find("tr[data-uid='" + view[i].uid + "']")
				//.addClass("k-state-selected")
                .find(".checkbox")
                .attr("checked","checked");
            }
        }
	}
		
	// FILTERING WITH DROPDOWN MENU 
	var victim	= ["1", "2", "3", "4", "5", "6"],
		bool	= ["Yes", "No"];
			

	function typeFilter(element) {
		multiSelectFilter (element, 'rfsTypeDisplay', 'Select RFS Type(s) you want to filter on:', $scope.filterRFSTypeList);
	}
	
	function sourceFilter(element) {
		multiSelectFilter (element, 'rfsSource', 'Select RFS Source(s) you want to filter on:', $scope.filterSourcesList);
	}
	
	function stateFilter(element) {
		multiSelectFilter (element, 'rfsIncidentState', 'Select Incident State(s) you want to filter on:', $scope.filterRFSIncidentStateList);
	}
	
	function caseManagerFilter(element) {
		multiSelectFilter (element, 'caseManager', 'Select Case Managers(s) you want to filter on:', $scope.filterCaseManagerList);
	}
	  
	function statusFilter(element) {
		element.kendoDropDownList({
			dataSource: $scope.filterRFSStatusList.sort(),
			optionLabel: "--Select Value--"
		});
	}
	function boolFilter(element) {
		element.kendoDropDownList({
			dataSource: bool,
			optionLabel: "--Select Value--"
		});
	}

	////////////////////////////// MULTI SELECT FILTER FUNCTIONALITY //////////////////////////////
	function multiSelectFilter(element, fieldName, customFilterMessage, dataSource) {
		var menu = $(element).parent(); 
        menu.find(".k-filter-help-text").text(customFilterMessage);
        menu.find("[data-role=dropdownlist]").remove(); 
        
        element.removeAttr("data-bind");
        var multiSelect = element.kendoMultiSelect({
			dataSource: dataSource.sort(),
			change: function(e) {
					$scope.filterField = fieldName;
					console.log('filtered with' + $scope.filterField); //this will fire after filtered.
			}
        }).data("kendoMultiSelect");
        menu.find("[type=submit]").on("click", {widget: multiSelect}, filterByMultipleSelections); 
	}
	
	function filterByMultipleSelections(e){
		//console.log('..........filterByMultipleSelections............');
		//console.log($scope.filterField);
		//console.log($scope);
		
        var sources = e.data.widget.value();
		var grid = $("#grid").data("kendoGrid");
		//First remove all 'filterField' filters, then we can add new selection
		grid.clearFilters([$scope.filterField]);

		var newFilterCriteria = [];  
		for (var i = 0; i < sources.length; i++)
        {
			console.log($scope.filterField + ' + ' + sources[i]);
			newFilterCriteria.push({ field: $scope.filterField, operator: "eq", value: sources[i] });
        } 

		var newFilter = {logic: 'or', filters: newFilterCriteria};
				
		//console.log('after constructing the new filter ' );
		//console.log(newFilter);
		
		//add old filters
		var currentFilters = grid.dataSource.filter();
		console.log('current filters' );
		console.log(currentFilters);
		var combinedFilters = {logic:'and', filters:[]};
		if (currentFilters && currentFilters.filters) {
			console.log('adding --and-- filter');
			combinedFilters.filters.push( newFilter);
			combinedFilters.filters.push(currentFilters);
		} else {
			combinedFilters = newFilter;
		}
		
		//console.log('after combining old and new filters' );
		//console.log(combinedFilters);

		//add updated currentFilters
        grid.dataSource.filter(combinedFilters);
    }
	
	kendo.ui.Grid.prototype.clearFilters = function(args){
		// get dataSource of grid and columns of grid
		var fields = [], filter = this.dataSource.filter(), col = this.columns;
		if( $.isEmptyObject(filter) || $.isEmptyObject(filter)) return;

		// Create array of Fields to remove from filter
		for(var i = 0, l = col.length; i < l; i++){
			if(col[i].hasOwnProperty('field')){
				if(args.indexOf(col[i].field)>=0){
					fields.push(col[i].field)
				}
			}
		}

		if($.isEmptyObject(fields)) return;

		// call "private" method
		var newFilter = this._eraseFiltersField(fields, filter)

		// set new filter
		this.dataSource.filter(newFilter);
	}
	
	kendo.ui.Grid.prototype._eraseFiltersField = function(fields, filter){
				for (var i = 0; i < filter.filters.length; i++) {

					// For combination 'and' and 'or', kendo use nested filters so here is recursion
					if(filter.filters[i].hasOwnProperty('filters')){
						filter.filters[i] = this._eraseFiltersField(fields, filter.filters[i]);
						if($.isEmptyObject(filter.filters[i])){
							filter.filters.splice(i, 1);
							i--;
							continue;
						}
					}

					// Remove filters
					if(filter.filters[i].hasOwnProperty('field')){
						if( fields.indexOf(filter.filters[i].field) > -1){
							filter.filters.splice(i, 1);
							i--;
							continue;
						}
					}
				}

				if(filter.filters.length === 0){
					filter = {};
				}

			return filter;
	}
	//////////////////////////////////////////// MULTI SELECT FILTER Functionality ENDS here ////////////////////////////////////



	// CUSTOM EMAIL WINDOW //////////////////////////////////////////////////
	$scope.emailWindowOptions = {
		title: "Please provide email info:",
		width: 790,
		height:600,
		visible: false,	
		modal: true,
		scrollable : false
	};

	$scope.openEmailWindow = function() {
		$scope.mailMessage = {
			from:  $rootScope.userId + "@ncmec.org",
			//to: $rootScope.userId + "@ncmec.org",
			subject: "Attention: New RFSes",
			text: "Please find attached RFS Cases: " + $scope.checkedIds.toString(),
			extraInfo: 
					{
						entityType: "rfs"
					},
			attachments : [
				{
					reportTemplate: "RfsReport",
					format: "xlsx",
					ids: $scope.checkedIds.toString()
				}
			]
		};
		$scope.attachmentFileName = "RfsReport.xls";
			
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
			if(result.data.status == "SUCCESS")	alert("Your email has been successfully sent!");
		});
		$scope.emailWindow.close();
		
	};

	//PRINT RFSs ////////////////////////////////
		// CUSTOM EMAIL WINDOW //////////////////////////////////////////////////
	$scope.printWindowOptions = {
		title: "Print Preview",
		width: 1200,
		height:700,
		visible: false,	
		modal: true,
		scrollable : true
	};

	$scope.printRFSes = function() {

		console.log("FROM PRINT RFSES");
		if ($scope.checkedIds.length <= 0) {
			alert ('Please select one or more RFSes before printing..');
			return;
		} else {
			//$scope.printWindow.center().open();
			
			var HTMLcontent = DataFtry.printRFSes("http://ecms-devapp1.ncmecad.net:8080/ecms-services.nightly/rest/document/export/rfses?reportFileName=RfsReport.html&ids=" + $scope.checkedIds.toString());
			console.log(HTMLcontent)
			//var w = window.open();
			//w.document.write(HTMLcontent);


			//w.focus();
			//w.print();
		}
	};
	
	//EXPORT RFSs ////////////////////////////////
	$scope.exportRFSes = function() {
		if ($scope.checkedIds.length <= 0)
		{
			alert ('Please select one or more RFSes before exporting..');
			return;
		} else {
			//console.log("FROM EXPORT RFSES");
			var exportURL = '/rest/document/export/rfses?reportFileName=RfsReport.xlsx&ids=' +$scope.checkedIds.toString()
			DataFtry.exportDocument(exportURL, '.xlsx', 'SelectedRFSes.xlsx');
		}
	};

}]);
