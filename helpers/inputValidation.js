const inputValidation = async(requiredFields, inputFields) => {
  try{
    const result = {
      isError: false,
      message: ""
    }
    if(!Array.isArray(requiredFields)){
      result.isError = true;
      result.message = 'requiredFields should be an array'
    }
    if(typeof inputFields == 'object' && !Array.isArray(inputFields)){
      for(let x in inputFields){
        if(!requiredFields.includes(x)){
          // console.log('no need property')
          result.isError = true;
          result.message = `Unrequired property: ${x}`
          return result;
        }
      }
      for(let x = 0; x < requiredFields.length; x++){
        if(!Object.prototype.hasOwnProperty.call(inputFields, requiredFields[x])){
          result.isError = true;
          result.message = `Required field: ${requiredFields[x]}`
          return result;
        }
      }
    }else{
      result.isError = false;
      result.message = 'inputFields should be an object'
    }
    return result
  }catch(err){
    return err;
  }
};

module.exports = inputValidation;
