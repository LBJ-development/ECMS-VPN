'use strict';


var globalServicesModule = angular.module('ECMSapp.GlobalServices', []);

globalServicesModule.factory("ECMSGrid", function() {
	var filterField;
	var selectedIds = [];
	var dynamicGridFilters = {};
	
	function nonNullUndefined(value){
		if( 'undefiend' != value && null !== value )
			return true
		else
			return false
	}
	
	function selectItem(item){
		//remove from selection list if unchecked

		if (!item.selected) {
			while ($.inArray(item.id, selectedIds) >=0) {
				//console.log(item.id + "=" + $.inArray(item.id, selectedIds));
				selectedIds.splice($.inArray(item.id, selectedIds),1);
			}
		} else {
			//console.log('adding item:' + item.id )
			if (!($.inArray(item.id, selectedIds) >=0)){
				selectedIds.push(item.id);
			}
			//console.log(selectedIds);
		}
	}
	
	return {
		
		init: function(checkedIds){
					selectedIds = checkedIds;
				},
				
		buildDynamicFilters: function(filterkeys, results) {

			filterkeys.forEach(function(filterKey){
				//console.log("Building result set for: " + filterKey);
				dynamicGridFilters[filterKey] = [];
				
				var tempKey;
				results.forEach(function(result){
						tempKey = result[filterKey];
						if (nonNullUndefined(tempKey)) {	
							if ($.inArray(tempKey, dynamicGridFilters[filterKey]) < 0) {
								//console.log('adding '+ tempKey);
								dynamicGridFilters[filterKey].push(tempKey);
							}
						}
				})
				//console.log(dynamicGridFilters[filterKey]);
			});
			
		},
		
		getDynamicFilter: function (filterKey){
			return dynamicGridFilters[filterKey];
		},
		
		multiSelectFilter: function (element, fieldName, customFilterMessage) {

			var menu = $(element).parent(); 
			menu.find(".k-filter-help-text").text(customFilterMessage);
			menu.find("[data-role=dropdownlist]").remove(); 
			
			element.removeAttr("data-bind");
			var multiSelect = element.kendoMultiSelect({
				dataSource: dynamicGridFilters[fieldName].sort(),
				change: function(e) {
						filterField = fieldName;
						//console.log('filtered with: ' + filterField); //this will fire after filtered.
				}
			}).data("kendoMultiSelect");
			menu.find("[type=submit]").on("click", {widget: multiSelect}, this.filterByMultipleSelections); 
		},
		
		filterByMultipleSelections: function (e){
			//console.log('..........filterByMultipleSelections............');
			//console.log(filterField);
			
			var sources = e.data.widget.value();
			var grid = $("#grid").data("kendoGrid");
			//First remove all 'filterField' filters, then we can add new selection
			grid.clearFilters([filterField]);

			var newFilterCriteria = [];  
			for (var i = 0; i < sources.length; i++)
			{
				//console.log(filterField + ' + ' + sources[i]);
				newFilterCriteria.push({ field: filterField, operator: "eq", value: sources[i] });
			} 

			var newFilter = {logic: 'or', filters: newFilterCriteria};
					
			//console.log('after constructing the new filter ' );
			//console.log(newFilter);
			
			//add old filters
			var currentFilters = grid.dataSource.filter();
			//console.log('current filters' );
			//console.log(currentFilters);
			var combinedFilters = {logic:'and', filters:[]};
			if (currentFilters && currentFilters.filters) {
				//console.log('adding --and-- filter');
				combinedFilters.filters.push( newFilter);
				combinedFilters.filters.push(currentFilters);
			} else {
				combinedFilters = newFilter;
			}
			
			//console.log('after combining old and new filters' );
			//console.log(combinedFilters);

			//add updated currentFilters
			grid.dataSource.filter(combinedFilters);
		},	
		
		////////////////////////////////////////////FILTERs Functionality ENDS here ////////////////////////////////////
		////////////////////////////// Row Select/ Toggle/UnToggle //////////////////////////////		

		caseSelected: function(ev){
						var element =$(ev.currentTarget);
						var checked = element.is(':checked');
						var row = element.closest("tr");
						var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
						var item = grid.dataItem(row);						
						selectItem(item);
						},
		
		toggleSelectAll: function(ev) {
						var dataSource = $(ev.target).closest("[kendo-grid]").data("kendoGrid").dataSource;
						var filters = dataSource.filter();
						var allData = dataSource.data();
						var query = new kendo.data.Query(allData);
						var items = query.filter(filters).data;
						items.forEach(function(item){
							item.selected = ev.target.checked;
							selectItem(item);
							});
						},
				
		reselectItems: function(grid, selectedIds) {
						var dataSource = grid.dataSource;
						var filters = dataSource.filter();
						var allData = dataSource.data();
						var query = new kendo.data.Query(allData);
						var items = query.filter(filters).data;
						items.forEach(function(item){
							for(var i = 0; i < selectedIds.length; i++ ){
								if(selectedIds[i] == item.id) item.selected = true;
								selectItem(item);
							}
						});
		}
	}
});

