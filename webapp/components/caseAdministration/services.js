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
		console.log("inside getData:" + url)
		var $promise =  $http({
			method: 'GET',
			url: url,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
	
		var deferred = $q.defer();
		
		$promise.then(function(result){
			console.log(result);
			
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
		
	var getCases = function(casesearch) {
	
		//console.log("FROM GET DATA: "  + URL);

		var restservice = "/rest/caseadmin/casesPlus";
		var data = Object.toparams(casesearch);
		console.log("data:" + data);
		console.log(casesearch);

		var $promise =  $http({
			method: 'POST',
			url: restservice,
			data: casesearch,
			headers: {'Content-Type': 'application/json'}
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

	var getCasesForAssignment = function (starDate, endDate){
		
		var casesearch = {
				startDate: starDate,
				endDate: endDate,
				rcType: "5117", //CASES ONLY
				rcSource: "5119", //ACTIVE
				rcStatus: "-1" //set default value to ALL for drop-down list
			};
		return getCases(casesearch);
	};

	var getCasesForIntakeDist = function (starDate, endDate){

		console.log("FROM INTAKEDIST")

		/*var intakeOpt = {
				startDate: starDate,
				endDate: endDate,
				rcType: "5117", //CASES ONLY
				rcSource: "5119", //ACTIVE
				rcStatus: "-1" //set default value to ALL for drop-down list
			};
		return getCases(intakeOpt);*/
	};

	return {
		getData: getData,
		getCases: getCases,
		getCasesForAssignment: getCasesForAssignment,
		assignCaseManager: assignCaseManager
		};
	});