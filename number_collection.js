var NumberCollection = function(initial_list){

  number_list = initial_list ? initial_list : [];  
  max_searches = number_list ? number_list.legnth : 1;
  number_of_searches = 0;
  current_biggest = 0;
  
  // limit how much computation can be done per peer
  max_searches = number_list.length * 2;
  
  this.getCurrentBiggestNumber = function(){    
    return current_biggest;
  }


  this.setBiggestNumber = function(num){    
    if (num > current_biggest){
      current_biggest = num;
      return true;    
    }
    else{
      return false;
    }
  }
  
  this.getRandomNumber = function(){        
    number_of_searches = number_of_searches + 1; 
    var random_index = Math.floor(Math.random()*number_list.length);
    return number_list[random_index];
  }
  
  this.hasMaxedOutSearches = function(){   
    return number_of_searches >= max_searches;
  }
  
  this.getSearchCount = function(){   
    return number_of_searches;
  }
    
}
  