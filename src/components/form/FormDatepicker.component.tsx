import { parseDate } from "@utils/date"
import { ReactElement } from "react"
import ReactDatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import { UseFormReturn, FieldValues, Controller } from "react-hook-form"

interface Props {
	setForm?: UseFormReturn<FieldValues, any>
	name: string
	dateFormat?: string
	valueType?: string
	label?: string
	placeholder?: string
	footnote?: string | ReactElement
	error?: any
	[x: string]: any
}

export default function FormDatepicker({ setForm, name, dateFormat, valueType = `date`, label, placeholder, error, ...attrs }: Props) {
	const { control } = setForm

	return (
		<div className="form-input">
			{label &&
			<label htmlFor={name} className="form-input-heading">{label}</label>
			}
			{control &&
				<Controller
					control={control}
					name={name}
					render={({ field: { onChange, onBlur, value } }) => (
						value ? (
							<ReactDatePicker
								id={name}
								className="input"
								dateFormat={dateFormat}
								onChange={onChange}
								onBlur={onBlur}
								selected={valueType === `string` ? parseDate(value) : value}
								placeholderText={placeholder}
								showYearDropdown
								{...attrs}
							/>
						) : (
							<ReactDatePicker
								id={name}
								className="input"
								dateFormat={dateFormat}
								onChange={onChange}
								onBlur={onBlur}
								placeholderText={placeholder}
								showYearDropdown
								{...attrs}
							/>
						)
					)
					}
				/>
			}
			{error &&
			<p className="form-input-error">{error.message}</p>
			}
		</div>
	)
}