import { DetailedHTMLProps, TextareaHTMLAttributes } from "react"
import { UseFormReturn, FieldValues } from "react-hook-form"

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
	setForm?: UseFormReturn<FieldValues, any>
	name: string
	label?: string
	error?: any
	[x: string]: any
}

export default function FormTextarea({ setForm, name, label, error, ...attrs }: Props) {
	const { register } = setForm

	return (
		<div className="form-input">
			{label &&
			<label htmlFor={name} className="form-input-heading">{label}</label>
			}
			<textarea id={name} className="input input-textarea" {...attrs} {...register(name)}></textarea>
			{error &&
			<p className="form-input-error">{error.message}</p>
			}
		</div>
	)
}