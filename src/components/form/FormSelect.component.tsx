import { Controller, UseFormReturn, FieldValues } from "react-hook-form"
import ReactSelect from "react-select"

interface Option {
	value: string
	label: string
}
interface Props {
	setForm?: UseFormReturn<FieldValues, any>
	name: string
	options: Option[]
	label?: string
	required?: string
	error?: any
	[x: string]: any
}

export default function FormSelect({ setForm, name, options, label, required, error, ...attrs }: Props) {
	const { control } = setForm

	return (
		<div className="form-input">
			{label &&
			<label htmlFor={name} className="form-input-heading">{label}</label>
			}
			<Controller
				control={control}
				name={name}
				rules={{ required }}
				render={({ field: { onChange, value, ...restField } }) =>
					<ReactSelect
						id={name}
						instanceId={name}
						className="input react-select"
						classNamePrefix="react-select"
						options={options}
						onChange={val =>
							Array.isArray(val) ?
								onChange(val.map(option => option.value))
								:
								onChange(val.value)
						}
						menuPlacement="auto"
						// menuPortalTarget={document.body}
						styles={{ menuPortal: base => ({ ...base, zIndex: 999 }) }}
						value={options?.filter(option =>
							Array.isArray(value) ?
								value.includes(option.value)
								:
								option.value === value
						)}
						{...restField}
						{...attrs}
					/>
				}
			/>
			{error &&
			<p className="form-input-error">{error.message}</p>
			}
		</div>
	)
}