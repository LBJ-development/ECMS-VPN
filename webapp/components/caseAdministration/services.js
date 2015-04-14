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
			// console.log(result);
			
			if(result.data.status == 'SUCCESS'){
				deferred.resolve(result);
				
			} else {
				alert("Something better is coming!");
			}
		});
		return deferred.promise;
	};
	
	var assignCaseManager = function(caseid, managerid) {

		// console.log(caseid + "/" + managerid);

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
		
	var getCases = function(casesearch) {
        return executeHttpJSONPost("/rest/caseadmin/casesPlus", casesearch);
	};
	
	var getCasesForAssignment = function (starDate, endDate){
		
		var casesearch = {
				startDate: starDate,
				endDate: endDate,
				rcType: "5118", //CASES ONLY
				// rcSource: "5119", //ACTIVE
				rcSource: "-1", //ALL
				rcStatus: "-1" //set default value to ALL for drop-down list
			};
		return getCases(casesearch);
	}
	
	var getCasesForIntakeDist = function (casesearch){
		
		var data = Object.toparams(casesearch);
		// console.log("FROM GETCASESFORINTAKEDIST" +  data);

		var intakeOpt = {
				startDate: casesearch.startDate,
				endDate: casesearch.endDate,
				rcType: "-1", //CASES ONLY
				rcSource: "-1", //ALL
				rcStatus: "-1" //ACTIVE ONLY
			};
		return getCases(intakeOpt);
	};

	return {
		getData: getData,
		getCases: getCases,
		getCasesForAssignment: getCasesForAssignment,
		getCasesForIntakeDist: getCasesForIntakeDist,
		assignCaseManager: assignCaseManager,
		submitUpdatedSchedules: submitUpdatedSchedules
		};
	}
	
	);