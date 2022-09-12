/* eslint-disable @typescript-eslint/no-explicit-any */
export const composeValidators =
  (...validators: any[]) =>
  (value: any) =>
    validators.reduce((error, validator) => error || validator(value), undefined)
/* eslint-enable */
