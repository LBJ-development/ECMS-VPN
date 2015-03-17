'use strict';

angular.module('ECMSapp.services', [])

.factory('DataFtry', function($http, $q) {
	
	var getData = function(URL) {	
	
	//console.log("FROM GET DATA: "  + URL);

		var $promise = $http.get(URL);
		var deferred = $q.defer();
		
		$promise.then(function(result){
			
			if(result.data.status == 'SUCCESS'){
				/*
				if(result.data.messages.CASES_LIST == 'No results found, please adjust the date range'){
					alert(result.data.messages.CASES_LIST);
				
				} else if(result.data.messages.CASES_LIST == 'More than 500 results found, returning first 500, please adjust the date range') {
					alert(result.data.messages.CASES_LIST);
				}
				*/
				//console.log(result.data.status);
				deferred.resolve(result);
				
			} else {
				
				alert("Something better is coming!");
			}
		})
		return deferred.promise;
	};
    return {
		getData: getData
    };
})