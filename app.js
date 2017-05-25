var app = angular.module('app', ['ngTouch','ngAnimate', 'ui.grid','ui.grid.edit', 'ui.grid.cellNav','ui.grid.selection']);

app.controller('MainCtrl', ['$scope','uiGridConstants','$timeout', function ($scope,uiGridConstants,$timeout) {

$scope.hideAdd = true;
$scope.hideEdit = true;
$scope.hideRemove = true;
$scope.myData = [];
$scope.col = {};
$scope.selectedData = [];
$scope.disableCol = true;
$scope.disableRow = true;
$scope.rows = [];
$scope.columns = [

{ field: 'columnName',displayName: 'Column Name', },
{ field: 'columnType',displayName: 'Column Type' },
{ field: 'editable',displayName: 'Editable', type: 'boolean' },

]

$scope.gridOptions = {
    
   enableRowSelection: true,
   multiSelect : false,
   enableFullRowSelection : true,

    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $scope.disableCol =  !row.isSelected;
      //  console.log(msg);
       // $log.log(msg);
      });

      $scope.gridApi.selection.clearSelectedRows();
       $scope.gridOptions.isRowSelectable = function(row){
   	 
   	  switch(row.entity.editable){
   	  
   	  	 case false:
   	 	  return false;
   	  	 break;
   	  	 case true:
   	 	 return true;
   	  	 break;
   	  	
   	  }
       
      }
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    },
    columnDefs: $scope.columns,


}



// this is for second table

$scope.columns2 = [];

$scope.gridOptions2 = {
    
   enableRowSelection: true,
   multiSelect : false,
   enableFullRowSelection : true,
  onRegisterApi: function(gridApi){
      $scope.gridApi2 = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $scope.disableRow =  !row.isSelected;
      //  console.log(msg);
       // $log.log(msg);
      });

    },

    columnDefs: $scope.columns2,


}





//$scope.summaryTableColName = $scope.gridOptions.data;

$scope.addColumn = function(){
      $scope.col = {};

    $scope.hideAdd = false;
     $scope.hideEdit = true;
    $scope.hideRemove = true;
}

$scope.cancel = function(){
    $scope.hideAdd = true; 
    $scope.hideEdit = true;
    $scope.hideremove = true;
     $scope.col = {};
     $scope.addColForm.$setUntouched();
}


$scope.add = function(){
   
    $scope.hideAdd = true; 
    
    switch($scope.col.editable){
    		case 'false':
    		$scope.col.editable = false;
    		 break;
    		 case 'true':
    		 $scope.col.editable = true;
    		 break;


    	}

    $scope.myData.push({
        
        columnName: $scope.col.name,
        columnType : $scope.col.type,
        editable : $scope.col.editable
    });
    	
  $scope.columns2.push({ field: $scope.col.name, type:$scope.col.type,enableCellEdit : $scope.col.editable});
    		

    

    $scope.col = {}; 
   $scope.addColForm.$setUntouched();
 
//$scope.gridApi.selection.clearSelectedRows();
  
  

$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );

 
   
}


$scope.editColumn = function(){

  $scope.hideEdit = false;
      $scope.hideAdd = true; 
    $scope.hideRemove = true;
    $scope.selectedRows = $scope.gridApi.selection.getSelectedRows();
    var index = $scope.gridOptions.data.indexOf($scope.selectedRows[0]);
    $scope.columns2edit={};
    $scope.column2edit={field:$scope.selectedRows[0].columnName,type:$scope.selectedRows[0].columnType,enableCellEdit:$scope.selectedRows[0].editable};
var pos = $scope.columns2.map(function(e) {
 return e.field; }).indexOf($scope.selectedRows[0].columnName);
//console.log("e "+e.field + " row selected "+$scope.selectedRows[0].columnName);


  


     
     
    //console.log("id "+  $scope.gridOptions.data.indexOf($scope.selectedRows[0]));
    if(index != -1) {
      $scope.col.id = index;
      $scope.col.pos= pos;

         $scope.col.name =  $scope.selectedRows[0].columnName ;
        $scope.col.oldName =  $scope.selectedRows[0].columnName ;
          $scope.col.type =  $scope.selectedRows[0].columnType ;
           $scope.col.editable =  $scope.selectedRows[0].editable ;
        
    
  }
}



$scope.Edit = function(){
  $scope.columns2edit={};
    $scope.column2edit={field:$scope.col.name,type:$scope.col.type,enableCellEdit:$scope.col.editable};

   if($scope.editColForm.$dirty)
   {
        //console.log($scope.columns2[$scope.col.pos]);
        $scope.columns2[$scope.col.pos]=$scope.column2edit;
        $scope.gridOptions2.columnDefs = $scope.columns2;
       // console.log($scope.columns2[$scope.col.pos]);
     //  console.log($scope.rows ,$scope.rows.length);

       var myJsonString = JSON.stringify($scope.rows);
      // console.log(""+oldName+"","\""+$scope.col.name+"\"");
      console.log("before ",myJsonString );
      
      for(var i=0;i<$scope.rows.length;i++){
       myJsonString =myJsonString.replace("\$\$hashKey","_");
   }


       var oldName = "\""+$scope.col.oldName+"\":";
       
			var re = new RegExp(oldName, 'g');
       
       myJsonString =myJsonString.replace(re,"\""+$scope.col.name+"\":");
  	
       
       console.log("After ",myJsonString );
      // $scope.rows.length = 0;
      $scope.gridOptions2.data.length = 0;

       $scope.rows = $scope.rows.splice(0,$scope.rows.length);
       console.log("After splice " ,$scope.rows.length);
      var arr  = $.parseJSON(myJsonString);
      for(var k in arr){
      if (arr.hasOwnProperty(k)){
      	console.log(arr[k]);
      	$scope.rows.push(arr[k]);
      }
      }
     
     $scope.gridOptions2.data = $scope.rows;
      //$scope.gridOptions2.data = arr;
      console.log($scope.rows);

      $scope.gridApi2.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
     //  $scope.$apply();

}

   
   //console.log($scope.editColForm.$dirty);

  
     $scope.gridOptions.data.splice( $scope.col.id, 1);

 switch($scope.col.editable){
    		case 'false':
    		$scope.col.editable = false;
    		 break;
    		 case 'true':
    		 $scope.col.editable = true;
    		 break;


    	}
//console.log($scope.disableCol);
$scope.disableCol=true;

    $scope.myData.push({
        columnName: $scope.col.name,
        columnType : $scope.col.type,
        editable : $scope.col.editable
    });



     $scope.hideEdit = true; 
     $scope.col = {};
   $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
}



$scope.removeColumn = function(){

  $scope.hideEdit = true;
      $scope.hideAdd = true; 
    $scope.hideRemove = false;
    $scope.selectedRows = $scope.gridApi.selection.getSelectedRows();
    var index = $scope.gridOptions.data.indexOf($scope.selectedRows[0]);
    //console.log("id "+  $scope.gridOptions.data.indexOf($scope.selectedRows[0]));
    if(index != -1) {
      $scope.col.id = index;
         $scope.col.name=$scope.selectedRows[0].columnName;
    
  }
}


$scope.Remove = function(){
   
   
   $scope.gridOptions.data.splice( $scope.col.id, 1);
    $scope.columns2 = $.grep($scope.columns2,
  function(col,i) { 
   
  return col.field === $scope.col.name; },
  true);

  $scope.gridOptions2.columnDefs = $scope.columns2;

    $scope.hideRemove = true; 
    $scope.col={};
   $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
}


$scope.gridOptions.data = $scope.myData;



/**
  	Second Table Code Comes here onward
**/



$scope.rowData = {};

$scope.hideAddRow = true;
$scope.hideRemoveRow = true;








$scope.addRow = function() {
$scope.hideAddRow = false;
}




$scope.iscolEmpty = function(){

	
	switch($scope.myData.length) {
		case 0:
		
		iscolEmpty = true;
		return true;
		break;

		default:
		iscolEmpty = false;
		return false;
		break;

	}

	
}

$scope.rowCancel = function(){
	$scope.hideAddRow = true;
  $scope.hideRemoveRow = true;
}

//console.log(rows);
$scope.RowAddFinal = function(){
	
	
	$scope.rows.push($scope.rowData);
	
	$scope.gridOptions2.data = $scope.rows;
	$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
	 $scope.rowData = {}
	$scope.hideAddRow = true; 

   
} 

$scope.RemoveRow = function(){

   
    $scope.hideRemoveRow = false;
    $scope.selectedRowsTable = $scope.gridApi2.selection.getSelectedRows();
    var index = $scope.gridOptions2.data.indexOf($scope.selectedRowsTable[0]);
    //console.log("id "+  $scope.gridOptions.data.indexOf($scope.selectedRows[0]));
    if(index != -1) {
      $scope.gridOptions2.data.splice( index, 1)
    };
    
    $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
  }

$scope.expotJson = function(){
	var len = $scope.rows.length;


	if(len >0 ){
	var toJsonPrint = '[\n';
	for(i=0;i<len;i++){
		toJsonPrint += angular.toJson($scope.rows[i],true);
		if(i<len-1){
			toJsonPrint += ',\n';
		}else{
			toJsonPrint += '\n';
		}
	}
	toJsonPrint += ']';
	alert("Here is your data in Json Format "+ toJsonPrint);
}
else{
	alert("No Data to export ");
}
	
}




$scope.gridOptions2.data = $scope.rows;








}]);







