var UI = function(){
  
  this.setPeerCount = function(count){
    $('#peer_count').html(count);        
  }
  
  this.setInitialCollectionCount = function(count){
    $('#initial_collection_count').html(count);        
  }

  this.setBiggestNumberFound = function(count){
    $('#biggest_number_found').html(count);        
  }
  
  this.setProcessedByCurrentWorker = function(count){
    $('#processed_by_current_worker').html(count);        
  }
  
  this.setProcessedByAllWorkers = function(count){
    $('#processed_by_all_workers').html(count);        
  }
  
  this.enableUI = function(count){
    $('#waiting-ui').css({"display" : "none"});
    $('#activity-ui').css({"display" : "block"});
  }
  

  this.displayMessage = function(msg){
    $('#status_message').html(msg);
  }
}