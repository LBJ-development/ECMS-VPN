'use strict';

// DATE RANGE WIDGET WITH AN ANGULARJS DIRECTIVE ////////////////////////////////////////////////////////
serviceGeneralModule.directive('emailSender', function(DataFtry) {
    return {
        restrict: 'E',
        templateUrl: 'components/shared/emailSender.html',
        controller: ['$rootScope', '$scope', '$http',
            function($rootScope, $scope, $http) {

                $scope.emailWindowOptions = {
                    title: "Please provide email info:",
                    width: 790,
                    height: 630,
                    visible: false,
                    modal: true,
                    scrollable: false,
                };
            }
        ],

        link: function(scope, element, attrs) {

            // console.log("FROM EMAIL SENDER");
            //    	console.log(scope.userId);

            scope.mailMessage = {
                from: scope.userId + "@ncmec.org",
                //to: $rootScope.userId + "@ncmec.org",
                subject: "Attention: RFSes",
                //text: "Please find attached RFS: " + $scope.checkedIds.toString(),
                extraInfo: {
                    entityType: "rfs"
                },
                attachments: [{
                    reportTemplate: "RfsReport",
                    format: "xlsx",
                    //ids: $scope.checkedIds.toString()
                }]
            };

            scope.ccMyself = function() {
                scope.mailMessage.cc = (scope.userId + "@ncmec.org").split(",");
            };

            scope.sendEmail = function() {
                scope.mailMessage.to = scope.mailMessage.to.split(',');

                DataFtry.sendEmail(scope.mailMessage).then(function(result) {

                   if (result.data.status == "SUCCESS" || result.statusText == "OK") alert("Your email has been successfully sent!");
                });
                scope.emailWindow.close();
            };

        /*    $scope.sendEmail = function() {
                $scope.mailMessage.to = $scope.mailMessage.to.split(',');

                DataFtry.sendEmail($scope.mailMessage).then(function(result) {
                    console.log("SENT EMAIL !!!");
                    console.log(result.status);
                    if (result.data.status == "SUCCESS") alert("Your email has been successfully sent!");
                });
                $scope.emailWindow.close();
	};*/

        }
    };
});