import { ReactElement } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

interface Props {
	setForm?: UseFormReturn<FieldValues, any>
	name: string
	label?: string
	error?: any
  type?: string
	footnote?: string | ReactElement
	[x: string]: any
}

export default function FormInput({ setForm, type = `text`, name, label, error, footnote, ...attrs }: Props) {
	const { register } = setForm

	return (
		<div className="form-input">
			{label &&
			<label htmlFor={name} className="form-input-heading">{label}</label>
			}
			{type &&
				<input
					type={type}
					id={name}
					className="input"
					{...attrs}
					{...register(name)}
				/>
			}
			{error &&
			<p className="form-input-error">{error.message}</p>
			}
		</div>
	)
}