var DateRange = function(htmlElement, startingDate, endingDate) {

	this.htmlElement = $(htmlElement);
	this.startingDate = startingDate;
	this.endingDate = endingDate;

	var htmlContent;

	htmlContent =	'<li style="padding-right: 10px">';
	htmlContent +=	'<label >From:</label>';
	htmlContent +=	'<input id="startingDate" kendo-date-picker k-max={{today}} k-on-change="enableSumbitBtn()" k-ng-model="startingDate" k-rebind="startingDate" k-ng-delay="startingDate" style="width: 180px"/>';
	htmlContent +=	'</li>';
	htmlContent +=	'<li style="padding-right: 10px">';
	htmlContent +=	'<label>To:</label>';
	htmlContent +=	'<input id="endingDate"  kendo-date-picker k-max={{today}}  k-on-change="enableSumbitBtn()"  k-ng-model="endingDate"  k-rebind="startingDate" k-ng-delay="startingDate"  style="width: 180px"/>';
	htmlContent +=	'</li>';

	//htmlContent = '<input id="datepicker" value="10/10/2011" style="width:200px;" />'

	this.htmlElement.html(htmlContent);

	$("#startingDate").kendoDatePicker();
	$("#endingDate").kendoDatePicker({
			value: new Date()
		});

	// CREATE HTML ////////////////////////////////////////

};

DateRange.prototype = {

	initStartingDate : function(){
		
	},

	initEndingDate : function(){
		
	},

	formatStartingDate : function(){
		var stDate	= $scope.startDate.getDate();
		var stMonth = $scope.startDate.getMonth() + 1;
		var stYear	= $scope.startDate.getFullYear();
		return stYear + "-" + stMonth  + "-" + stDate;
	},

	formatEndingDate : function(){
		var enDate	= $scope.endDate.getDate();
		var enMonth = $scope.endDate.getMonth() + 1;
		var enYear	= $scope.endDate.getFullYear();
		return enYear + "-" + enMonth  + "-" + enDate;
	}
};

