'use strict';

angular.module('ECMSapp.services', [])

.factory('DataFtry', function($http, $q) {
	
	Object.toparams = function ObjecttoParams(obj) {
		var p = [];
		for (var key in obj) {
		p.push(key + '=' + encodeURIComponent(obj[key]));
		}
		return p.join('&');
	};
			
	var getData = function(url){
		// console.log("inside getData:" + url)
		var $promise =  $http({
			method: 'GET',
			url: url,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
	
		var deferred = $q.defer();
		
		$promise.then(function(result){
			if(result.data.status == 'SUCCESS'){
				deferred.resolve(result);
				
			} else {
				alert("Something better is coming!");
			}
		});
		return deferred.promise;
	};
	
	var assignCaseManager = function(caseid, managerid) {

		var $promise =  $http({
			method: 'POST',
			url: "/rest/case/assignmanager/",
			data: Object.toparams({
				caseId: caseid,
				managerId: managerid
				}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
			
		var deferred = $q.defer();
		
		$promise.then(function(result){
			
			if(result.data.status == 'SUCCESS'){
				deferred.resolve(result);
			} else {	
				alert("Something better is coming!");
			}
		});
		return deferred.promise;
	};
		
	function executeHttpJSONPost(restservice, dataobject) {	
		var $promise =  $http({
			method: 'POST',
			url: restservice,
                data: dataobject,
			headers: {'Content-Type': 'application/json'}
		});
		var deferred = $q.defer();
		
		$promise.then(function(result){
			if(result.data.status == 'SUCCESS'){
				//console.log(result.data.status);
				deferred.resolve(result);
			} else {
				alert("Something better is coming!");
			}
		});
		return deferred.promise;
	};

	var submitUpdatedSchedules = function(updatedSchedules) {
        return executeHttpJSONPost("/rest/casemanager/worksheet/edit", updatedSchedules);
	};		
		
	var getRFSes = function(searchCriteria) {
        return executeHttpJSONPost("/rest/caseadmin/rfsSearch", searchCriteria);
	};
	
	var getCasesForAssignment = function (starDate, endDate, isUnAssignedCases){
		
		var casesearch = {
				caseCreateStartDate: starDate,
				caseCreateEndDate: endDate,
				isUnassignedCases : isUnAssignedCases
			};
		console.log("search criteria");
		console.log(casesearch);
		return executeHttpJSONPost("/rest/caseadmin/caseSearch", casesearch);
	}
	
	var getCasesForIntakeDist = function (casesearch){
		console.log("search criteria");
		console.log(casesearch);
		return executeHttpJSONPost("/rest/caseadmin/activeCaseSearch", casesearch);
	};

	return {
		getData: getData,
		getRFSes: getRFSes,
		getCasesForAssignment: getCasesForAssignment,
		getCasesForIntakeDist: getCasesForIntakeDist,
		assignCaseManager: assignCaseManager,
		submitUpdatedSchedules: submitUpdatedSchedules
		};
});