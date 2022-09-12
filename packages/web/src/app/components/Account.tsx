import React from "react"

import { Field, Form } from "react-final-form"
import { useDispatch } from "react-redux"

import { safeMint } from "../features/nft/nft.actions"
import useAuthenticatedRoute from "../hooks/useAuthenticatedRoute"
import { AppDispatch } from "../store"

const Account = () => {
  useAuthenticatedRoute()
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = async (values: { tokenId: number }) => {
    dispatch(safeMint(values.tokenId))
  }

  const minValue = (min: number) => (value: number) =>
    isNaN(value) || value >= min ? undefined : `Should be greater than ${min} `
  const maxValue = (max: number) => (value: number) =>
    isNaN(value) || value <= max ? undefined : `Should be less than ${max} `
  const composeValidators =
    (...validators: any[]) =>
    (value: any) =>
      validators.reduce((error, validator) => error || validator(value), undefined)

  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, form, submitting, pristine, hasValidationErrors }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Token id</label>
            <Field
              name="tokenId"
              component="input"
              type="number"
              validate={composeValidators(minValue(0), maxValue(1024))}
            >
              {({ input, meta }) => (
                <>
                  <input
                    className="input w-full max-w-xs input-bordered"
                    type="text"
                    min={0}
                    max={1024}
                    {...input}
                    placeholder="TokenId"
                  />
                  {meta.touched && meta.error && <span>{meta.error}</span>}
                </>
              )}
            </Field>
          </div>
          <div className="buttons">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || pristine || hasValidationErrors}
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </Form>
  )
}

export default Account
