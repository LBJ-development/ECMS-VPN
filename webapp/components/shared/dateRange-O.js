var DateRange = function(htmlElement, dateRange) {

	this.htmlElement = $(htmlElement);
	this.dateRange = dateRange;

	// BUILD HTML //////////////////////////////////////////
	var htmlContent;
	htmlContent =	'<li style="padding-right: 10px">';
	htmlContent +=	'<label >From:</label>';
	htmlContent +=	'<input id="startingDate" kendo-date-picker k-max={{today}} k-on-change="enableSumbitBtn()" k-ng-model="startingDate" k-rebind="startingDate" k-ng-delay="startingDate" style="width: 180px"/>';
	htmlContent +=	'</li>';
	htmlContent +=	'<li style="padding-right: 10px">';
	htmlContent +=	'<label>To:</label>';
	htmlContent +=	'<input id="endingDate"  kendo-date-picker k-max={{today}}  k-on-change="enableSumbitBtn()"  k-ng-model="endingDate"  k-rebind="startingDate" k-ng-delay="startingDate"  style="width: 180px"/>';
	htmlContent +=	'</li>';
	this.htmlElement.html(htmlContent);

	// INITIAL DATA RANGE ///////////////////////////////////
	var todayDate			= new Date();
	var dateOffset			= (24*60*60*1000) * this.dateRange; //DEFAULT: 1 DAYS 
	var initStartingDate	= new Date(todayDate.getTime() - dateOffset);
	var initEndingDate		= todayDate;

	this.startingDateValue = $("#startingDate").kendoDatePicker({
		value: initStartingDate,
		change: onDateChange,
		max: new Date()
	}).data("kendoDatePicker");
	
	this.endingDateValue = $("#endingDate").kendoDatePicker({
		value: initEndingDate,
		change: onDateChange,
		max: new Date()
	}).data("kendoDatePicker");

	var that = this;

	function onDateChange(){
		that.checkDateFormating();
		var startingDate	= that.formatStartingDate();
		var endingDate		= that.formatEndingDate();
		$(that).trigger('dateRangeHasChanged', [startingDate , endingDate]);
	}
};

DateRange.prototype = {

	enable : function(val){
		this.startingDateValue.enable(val);
		this.endingDateValue.enable(val);
	},

	formatStartingDate : function(){
		var stDate	= this.startingDateValue.value().getDate();
		var stMonth = this.startingDateValue.value().getMonth() + 1;
		var stYear	= this.startingDateValue.value().getFullYear();
		return stYear + "-" + stMonth  + "-" + stDate;
	},

	formatEndingDate : function(){
		var enDate	= this.endingDateValue.value().getDate();
		var enMonth = this.endingDateValue.value().getMonth() + 1;
		var enYear	= this.endingDateValue.value().getFullYear();
		return enYear + "-" + enMonth  + "-" + enDate;
	},

	checkDateFormating : function(){
		//console.log("FROM CHECK DATE FORMATING!")
		if (!(this.startingDateValue.value() instanceof Date)){
			alert("Error: Enter correct Start Date(mm/dd/yyyy) OR  Pick a date from DatePicker widget.");
			return;
		}
		if (!(this.endingDateValue.value() instanceof Date)){
			alert("Error: Enter correct End Date(mm/dd/yyyy) OR  Pick a date from DatePicker widget.");
			return;
		}
		if (this.startingDateValue.value() > this.endingDateValue.value()) {
			alert("Start Date can't be after End Date");
			return;
		}
		return;
	}
};

