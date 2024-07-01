function validation(values) {
    let errors = {};
  
    // category validation
    if (!values.english_word || values.english_word.trim() === "") {
      errors.english_word = "English word can't be empty";
    } else {
      errors.english_word = "";
    }

    if (!values.thai_word || values.thai_word.trim() === "") {
      errors.thai_word = "Thai word can't be empty";
    } else {
      errors.thai_word = "";
    }

    if (!values.pronunciation || values.pronunciation.trim() === "") {
      errors.pronunciation = "Pronunciation can't be empty";
    } else {
      errors.pronunciation = "";
    }
  
    return errors;
  }
  
  export default validation;