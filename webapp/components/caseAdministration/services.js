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

		console.log("FROM EXECUTE POST: " + restservice + dataobject);
	
		$promise.then(function(result){
			if(result.data.status == 'SUCCESS'){
				//console.log(result.data.status);
				deferred.resolve(result);
			} else {
				alert("Something better is coming!");
			}
		});
		return deferred.promise;
	}

	function executeHttpJSONGet(restservice, dataobject) {
		var $promise =  $http({
			method: 'GET',
			url: restservice,
			data: dataobject,
			headers: {'Content-Type': 'application/json'}
		});
		var deferred = $q.defer();

		console.log("FROM EXECUTE GET: " + restservice + dataobject);
	
		$promise.then(function(result){
			if(result.data.status == 'SUCCESS'){
				console.log(result.data.status);
				deferred.resolve(result);
			} else {
				//alert("Something better is coming!");
			}
		});
		return deferred.promise;
	}

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
	};
	
	var getCasesForIntakeDist = function (casesearch){
		console.log("search criteria");
		console.log(casesearch);
		return executeHttpJSONPost("/rest/caseadmin/intakeDistCaseSearch", casesearch);
	};
	

	var getCasesForMediaCertDist = function (casesearch){
		console.log("search criteria");
		console.log(casesearch);
		return executeHttpJSONPost("/rest/caseadmin/mediaDistCaseSearch", casesearch);
	};
	
	// Email Functionality (Will be refactored into Email Global Services) 
	var prepareEmail = function (emailTemplateName, checkedIds, attachments) {
		var requestPayload = {
			emailMetadata : {
				template: emailTemplateName,
				subject: checkedIds
			},
			attachments : {}
		};
		
		if ( "undefined"!=typeof attachments && attachments !== null) {
			requestPayload.attachments = attachments;
		}
		
		console.log("preparing email for :" + emailTemplateName + " with " + checkedIds);
		console.log(requestPayload.attachements);
		return executeHttpJSONPost("/rest/email/preparemail", requestPayload);
	};
		
	var exportDocument = function(exportURL,targetFormat, fileName){
		
		var headers = {};
		var blobType = {};
		
		switch (targetFormat){
			case '.pdf':
					headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/pdf' };
					blobType = {'type': 'application/pdf'};
					break;
			case '.xlsx':
					headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
					blobType = {'type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
					break;
			case '.docx':
					headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/octet-stream' };
					blobType = {'type': 'application/octet-stream'};
					break;
			default:
					headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'plain/text' };
					blobType = {'type': 'plain/text'};
		}
						
		$http({
			method: 'GET',
			url: exportURL,
			headers: headers,
			responseType: 'arraybuffer'
			}).success(function (response) {
				var blobFile = new Blob([response], blobType);
				saveAs(blobFile, fileName + targetFormat);
			}).error(function(response) {
				console.log(response);
			});
		return ;
	};
	
	var printRFSes = function (rfsesToPrint) {
		return executeHttpJSONGet(rfsesToPrint);
	};

	var sendEmail = function (mailMessage) {
		console.log("sending email criteria");
		console.log(mailMessage);
		return executeHttpJSONPost("/rest/email/sendmail", mailMessage);
	};

	return {
		getData: getData,
		getRFSes: getRFSes,
		getCasesForAssignment: getCasesForAssignment,
		getCasesForIntakeDist: getCasesForIntakeDist,
		assignCaseManager: assignCaseManager,
		submitUpdatedSchedules: submitUpdatedSchedules,
		getCasesForMediaCertDist: getCasesForMediaCertDist,
		prepareEmail: prepareEmail,
		sendEmail: sendEmail,
		exportDocument: exportDocument,
		printRFSes: printRFSes
		};
});