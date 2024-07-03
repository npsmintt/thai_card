function validation(categoryName) {
    let errors = {};
  
    // category validation
    if (!categoryName || categoryName.trim() === "") {
      errors.categoryName = "Category name can't be empty";
    } else {
      errors.categoryName = "";
    }
  
    return errors;
  }
  
  export default validation;