
function acmDetailRow(div, narrativeText, narrativeType, author, narrativeDate){
	
	this.detailRow = $(div); // MAKE THE LINK WITH THE ACTUAL "<div>" IN THE HTML


	this.narrativeText	= narrativeText;
	this.narrativeType	= narrativeType;
	this.author		= author;
	this.narrativeDate	= narrativeDate;

	var baseThis=this;


	this.testDetail = $('<div class="backInfo"/>').appendTo(this.detailRow );

	this.testMethod();

	// this.html();	
}

acmDetailRow.prototype.testMethod = function() {

	this.testDetail.html(this.author)

	console.log(this.testDetail )
}

acmDetailRow.prototype.html = function() {

	var htmlContent;
	
	htmlContent	= '<ul>'
	htmlContent	+= '<li>Narrative Type: <span>'
	htmlContent	+= this.narrativeType
	htmlContent	+= '</li>'

	htmlContent	+= '<li>Author: <span>'
	htmlContent	+= this.author
	htmlContent	+= '</li>'

	htmlContent	+= '<li>Narrative Date: <span>'
	htmlContent	+= this.narrativeDate
	htmlContent	+= '</li>'
	htmlContent	+= '</ul>'
	
	this.detailRow.html(htmlContent);
	
	return htmlContent	
};