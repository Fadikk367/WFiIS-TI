const errorMessageTemplate = document.getElementsByTagName('template')[0];

class Constraint {
  constructor(inputName, constraintOption) {
    const { isRequired, pattern, minLength, maxLength } = constraintOption;
    this.inputName = inputName;
    this.isRequired = isRequired;
    this.pattern = pattern ? new RegExp(pattern) : null;
    this.minLength = minLength;
    this.maxLength = maxLength;
  }

  validate(inputValue) {
    if (this.isRequired && !inputValue) {
      return { isValid: false, message: `${this.inputName} is required!`};
    }

    if (this.minLength && inputValue.length < this.minLength) {
      return { isValid: false, message: `${this.inputName} too short (${this.minLength} letters minimum)`};
    }

    if (this.maxLength && inputValue.length > this.maxLength) {
      return { isValid: false, message: `${this.inputName} too long - (${this.maxLength} letters maximum)`};
    }

    if (this.pattern && !this.pattern.test(inputValue)) {
      return { isValid: false, message: `Invalid ${this.inputName} format`};
    }

    return { isValid: true, message: '' };
  }
}


class FormValidator {
  constructor(form, validationConstraints) {
    this.form = form;
    this.validationConstraints = validationConstraints;
  }

  validateInputs() {
    const formInputs = this.form.querySelectorAll('[name]');
    const validationResult = new ValidationResult();

    formInputs.forEach(formInput => {
      const inputName = formInput.name;
      const inputValue = formInput.value;

      if (this.validationConstraints.has(inputName)) {
        const constraint = this.validationConstraints.get(inputName);
        const result = constraint.validate(inputValue);

        if (!result.isValid) {
          validationResult.addError(inputName, result.message);
        }
      }
    });

    return validationResult;
  }

  displayValidationErrors(validationResult) {
    const formInputs = this.form.querySelectorAll('[name]');
    const validationErrors = validationResult.getErrors();

    formInputs.forEach(formInput => {
      const inputName = formInput.name;

      if (validationErrors.has(inputName)) {
        const validationError = validationErrors.get(inputName);

        const errorMessageBox = errorMessageTemplate.content.cloneNode(true);
        errorMessageBox.querySelector('span.error-message').textContent = validationError;

        formInput.parentNode.insertBefore(errorMessageBox, formInput.nextSibling);
      }
    });
  }

  clearValidationErrorBoxes() {
    const errorBoxes = this.form.querySelectorAll('.error-message-box');

    errorBoxes.forEach(errorBox => {
      this.form.removeChild(errorBox);
    })
  }
}


class ValidationResult {
  constructor() {
    this.errorsByInputNames = new Map();
  }

  addError(inputName, error) {
    this.errorsByInputNames.set(inputName, error);
  }

  getErrors() {
    return this.errorsByInputNames;
  }

  isValid() {
    return this.errorsByInputNames.size === 0 ? true : false;
  }
}

// 
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const validationConstraints = new Map();
validationConstraints.set('name', new Constraint('name', { isRequired: true, minLength: 3, maxLength: 15}));
validationConstraints.set('surname', new Constraint('surname', { isRequired: true, minLength: 3, maxLength: 15}));
validationConstraints.set('email', new Constraint('email', { isRequired: true, pattern: emailPattern }));


const validateForm = e => {
  const formValidator = new FormValidator(e.target, validationConstraints);

  formValidator.clearValidationErrorBoxes();
  const validationResult = formValidator.validateInputs();

  if (!validationResult.isValid()) {
    e.preventDefault();
    formValidator.displayValidationErrors(validationResult);
  }

  return validationResult.isValid();
}


const form = document.querySelector('form');
form.addEventListener('submit', validateForm);