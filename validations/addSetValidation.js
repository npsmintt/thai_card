function validation(setName) {
    let errors = {};
  
    // category validation
    if (!setName || setName.trim() === "") {
      errors.setName = "Set name can't be empty";
    } else {
      errors.setName = "";
    }
  
    return errors;
  }
  
  export default validation;