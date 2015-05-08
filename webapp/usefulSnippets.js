// MAKE THE CHECK BOX PERSISTING IN A GRID /////////////////////////////////////////////////////	
var checkedIds = {};
	
function selectRow(){
	var checked		= this.checked,
		row			= $(this).closest("tr"),
		grid		= $("#grid").data("kendoGrid"),
		dataItem	= grid.dataItem(row);

		checkedIds[dataItem.caseNumber] = checked;
	}

// ON DATABOUND EVENT (WHEN PAGING) RESTORE PREVIOUSLY SELECTED ROWS//////////////////	
function onDataBound(e) {

	var view = this.dataSource.view();
		for(var i = 0; i < view.length;i++){
			if(checkedIds[view[i].caseNumber]){
				this.tbody.find("tr[data-uid='" + view[i].uid + "']")
				//.addClass("k-state-selected")
				.find(".checkbox")
				.attr("checked","checked");
            }
        }
    }

	// REMOVING SPACES AND RETURNS FROM A TEXT WITH REGULAR EXPRESSIONS
	for (var i in result.data.content){
		result.data.content[i].narrativeText = result.data.content[i].narrativeText.replace(/(\n\r|\r\n|\f|\xxx|↵)/gi, '<br/>');
}

// SET TIME OUT /////////////////////////////////////////////////////		
setTimeout(function(){
	// DO SOMETHING...
}, 1000);

// FIND AN OBJECT //////////////////
 $("#mainMenu").find(".head-menu")

 // CHECK IF IT HAS A CLASS //////////////////
$(event.item).hasClass("sub-menu")