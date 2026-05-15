type ValidationError = {
  issues: Array<{
    message: string;
  }>;
};

export function getFirstValidationMessage(error: ValidationError) {
  return error.issues[0]?.message ?? 'Check your input and try again.';
}
