/*'use strict';

angular.module('ECMSapp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'components/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', function($scope) {

	// prepare the data
	var data = generatenotification(13);

	var source =
		{
		localdata: data,
		datafields:
			[
				{ name: 'id', type: 'number'},
				{ name: 'events', type: 'string' },
				{ name: 'objects', type: 'string' },
				{ name: 'details', type: 'string' },
				{ name: 'users', type: 'string' },
				{ name: 'seen', type: 'bool' }
			],
		datatype: "array"
		};
	var columns = 
		[
			{ text: 'ID', datafield: 'id', width: '5%', cellsAlign: 'center', align: 'center'},
			{ text: 'Object/Event', datafield: 'events', width: '20%', align: 'center'},
			{ text: 'Object ID', datafield: 'objects', width: '20%', align: 'center'},
			{ text: 'Details', datafield: 'details', width: '35%', align: 'center'},
			{ text: 'User', datafield: 'users', width: '15%', cellsFormat: 'c2', align: 'center' },
			{ text: 'Seen', datafield: 'seen', width: '5%', columntype: 'checkbox', cellsAlign: 'center', align: 'center',  cellsformat: 'c2' }
		];
      
	$scope.gridSettings =
		{
			width: '100%',
			autoheight: true,
			source: source,                
			columns: columns,
			editable: true,
            enabletooltips: true

		};
});*/