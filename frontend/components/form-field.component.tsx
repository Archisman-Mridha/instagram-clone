"use client"

import { Input } from "@nextui-org/react"
import { Fragment, HTMLInputTypeAttribute } from "react"
import { Controller, FieldValues, useFormContext } from "react-hook-form"

interface FormFieldProps<T extends FieldValues> {
	name: keyof T
	label: string
	type?: HTMLInputTypeAttribute
}

export function FormField<T extends FieldValues>({
	name,
	label,
	type = "text"
}: FormFieldProps<T>) {
	const { control } = useFormContext()

	return (
		<Fragment>
			<Controller
				name={name as never}
				control={control}
				render={({ field, fieldState: { error, invalid } }) => (
					<Input
						label={label}
						{...field}
						isClearable
						isInvalid={invalid}
						errorMessage={error?.message}
						type={type}
					/>
				)}
			/>
		</Fragment>
	)
}
