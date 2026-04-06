"use client"

import { Button } from "@base-ui/react/button"
import { Field } from "@base-ui/react/field"
import { Form } from "@base-ui/react/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserArgsValidator } from "@instagram-clone/lib/validators/validators"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { FunctionComponent } from "react"
import { Controller } from "react-hook-form"
import { signupAction } from "./action"

export const SignupForm: FunctionComponent = () => {
  const {
    form: { control },
    handleSubmitWithAction,
    action: { result, isPending }
  } = useHookFormAction(signupAction, zodResolver(createUserArgsValidator))

  return (
    <Form onSubmit={handleSubmitWithAction}>
      <Controller
        name="name"
        control={control}
        render={({
          field: { ref, name, value, onBlur, onChange },
          fieldState: { invalid, isTouched, isDirty, error }
        }) => (
          <Field.Root name={name} invalid={invalid} touched={isTouched} dirty={isDirty}>
            <Field.Label>Name</Field.Label>
            <Field.Control
              ref={ref}
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              placeholder="e.g. Andrey Markov"
            />
            <Field.Error match={!!error}>{error?.message}</Field.Error>
          </Field.Root>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({
          field: { ref, name, value, onBlur, onChange },
          fieldState: { invalid, isTouched, isDirty, error }
        }) => (
          <Field.Root name={name} invalid={invalid} touched={isTouched} dirty={isDirty}>
            <Field.Label>Email</Field.Label>
            <Field.Control
              type="email"
              ref={ref}
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              placeholder="e.g. andrey.markov@openmail.com"
            />
            <Field.Error match={!!error}>{error?.message}</Field.Error>
          </Field.Root>
        )}
      />

      <Controller
        name="username"
        control={control}
        render={({
          field: { ref, name, value, onBlur, onChange },
          fieldState: { invalid, isTouched, isDirty, error }
        }) => (
          <Field.Root name={name} invalid={invalid} touched={isTouched} dirty={isDirty}>
            <Field.Label>Username</Field.Label>
            <Field.Control
              ref={ref}
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              placeholder="e.g. andrey.markov"
            />
            <Field.Error match={!!error}>{error?.message}</Field.Error>
          </Field.Root>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({
          field: { ref, name, value, onBlur, onChange },
          fieldState: { invalid, isTouched, isDirty, error }
        }) => (
          <Field.Root name={name} invalid={invalid} touched={isTouched} dirty={isDirty}>
            <Field.Label>Password</Field.Label>
            <Field.Control
              type="password"
              ref={ref}
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              placeholder="e.g. hackmeifyoucan"
            />
            <Field.Error match={!!error}>{error?.message}</Field.Error>
          </Field.Root>
        )}
      />

      {result.serverError && <p>{result.serverError}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting" : "Submit"}
      </Button>
    </Form>
  )
}
