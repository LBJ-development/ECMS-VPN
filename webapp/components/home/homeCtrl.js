'use strict';

angular.module('ECMSapp.home', [])

.factory('NotificationFtry', function($rootScope, $http, $q) {

	var getData = function(URL) {	
	
	console.log("FROM GET DATA: "  + URL);

		var $promise = $http.get(URL);
		var deferred = $q.defer();
		
		$promise.then(function(result){
			
			if(result.data.status == 'SUCCESS'){

				//console.log(result.data.content.length);
				$rootScope.numberNotification = result.data.content.length;
				deferred.resolve(result.data.content);
				
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


.controller('HomeCtrl', function($scope, NotificationFtry, StorageService) {

	//var notificationData = generatenotification(13);
	
	var result = {};

		//console.log("FROM WATCH: "  + $scope.urlBase);
		
		var URL = "/rest/notification/user";
		
		NotificationFtry.getData(URL).then(function(result){
			
			$scope.mainGridOptions.dataSource.data = result;
			
			//console.log("FROM POS 1: " + $scope.mainGrid.table);
	
			/*setTimeout(function(){
				
					//console.log("FROM POS 2: " + $scope.mainGrid.table);
				
				// DELAY THE INITIALIZATION FOR THE TABLE CLICK ENVENT (CHECK IF CHECKBOX IS CLICKED)
				$scope.mainGrid.table.on("click", ".checkbox" , selectRow);
				
			}, 1000);*/
	
	});
	
	$scope.mainGridOptions =  {
		 
		dataSource	: {
			data: result,
			    schema: {
					model: {
						fields: {
								// id		: { type: "number" },
								type	: { type: "string" },
								details	: { type: "string" },
								assigner	: { type: "string" },
								markedSeen	: { type: "string" }
								}
							}
						},
					},
		height		: 490,
		sortable: true,
		columns		: [/*{
						field	: "id",
						title	: "ID",
						width	: "50px",
						sortable: false,
						attributes: {
      						style: "text-align: center"
    						}
						},*/{
						field	: "type",
						title	: "Type",
						width	: "15%"
						},{
						field	: "details",
						title	: "Details",
						},{
						field	: "assigner",
						title	: "User",
						width	: "15%"
						},{
						field	: "markedSeen",
						title	: "Seen",
						template: "<input type='checkbox'/>",
						width	: "70px",
						sortable: false,
						attributes: {
      						style: "text-align: center"
    					}
                	}]
				};
			});
	
			