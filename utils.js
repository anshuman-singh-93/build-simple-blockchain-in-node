const getType =  (elem) => {

  return Object.prototype.toString.call(elem).slice(8, -1);
  // '' - String
  // null - null
  // 
};

module.exports.normalizeError = (err) => {
    "use strict";
  
  
    if(getType(err) === 'Error'){
      return err.message;
    }
    if(getType(err) === 'String'){
      return err;
    }
    if(getType(err) === 'Object'){
      if (err.response) {
        return err.response.data;
    
      } else if (err.request) {
        return err.request;
    }
    else if(err.message){
      return err.message;
    }
  }
  
  if(getType(err) === 'Array'){
    return err[0].message || 'Something went wrong';
  
  }
  
    
   
  }