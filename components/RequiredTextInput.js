import { useState } from 'react';

const useRequiredField = (validateFn) => {
  const [error, setError] = useState('');

  const validate = (value) => {
    if (!validateFn(value)) {
      setError('Invalid input.');
    } else {
      setError('');
    }
  };

  return {
    error,
    validate
  };
};

export default useRequiredField;