/* eslint-disable @next/next/no-img-element */
import IconTimes from 'public/icons/icon-times.svg'
import { useEffect, useRef, useState } from 'react'
import { Controller, FieldError, FieldValues, UseFormReturn } from 'react-hook-form'

interface Props {
	setForm?: UseFormReturn<FieldValues, any>
	name: string
	type?: `file` | `image`
	size?: `icon` | `small` | `medium` | `large` | `full`
	aspectRatio?: string
	title?: string
	error?: FieldError
	defaultValue?: string
	label?: string
	footnote?: string
	required?: boolean
	styleNoButton?: boolean
	styleNoPlaceholder?: boolean
	styleBackgroundColor?: `black` | `white`
}

const FormFile = ({ setForm, name, type = `file`, size = `medium`, aspectRatio = `1`, title, error, defaultValue, label, footnote, required, styleNoButton, styleNoPlaceholder, styleBackgroundColor }: Props) => {
	const { control, watch } = setForm
	const [ selectedFile, setSelectedFile ] = useState<any>()
	const [ fileName, setFileName ] = useState()
	const [ preview, setPreview ] = useState(``)
	const inputRef = useRef<HTMLInputElement>(null)

	function removeValue(ev, onChange) {
		ev.preventDefault()
		inputRef.current.value = ``
		setSelectedFile(undefined)
		onChange(null)
	}

	function onSelectFile(onChange) {
		if (!inputRef.current.files || inputRef.current.files.length === 0) {
			setSelectedFile(undefined)
			onChange(``)
			return
		}

		setSelectedFile(inputRef.current.files[0])
		onChange(inputRef.current.files[0])
	}

	useEffect(() => {
		if (!watch(name)) {
			setFileName(undefined)
			setPreview(undefined)
		}
	}, [ watch(name) ])

	useEffect(() => {
		if (!selectedFile) {
			setFileName(undefined)
			setPreview(undefined)
			return
		}

		const objectName = selectedFile.name
		const objectUrl = URL.createObjectURL(selectedFile)

		setFileName(objectName)
		setPreview(objectUrl)

		return () => URL.revokeObjectURL(objectUrl)
	}, [ selectedFile ])

	return (
		<div className="form-file">
			{label &&
			<label className="form-file-heading">{label}</label>
			}
			<Controller
				control={control}
				name={name}
				defaultValue={defaultValue}
				rules={{ required }}
				render={({ field: { onChange, value } }) => (
					<>
						{type === `image` &&
						<label
							className={`form-file-preview ${styleNoButton && styleNoPlaceholder ? `form-file-preview-compact` : ``}`}
							style={{ aspectRatio, backgroundColor: styleBackgroundColor ? styleBackgroundColor : `transparent` }}
							htmlFor={name}
							title={title}
						>
							{(preview || value) &&
							<img className="preview" src={preview || (value instanceof File ? URL.createObjectURL(value) : value)} alt="Upload Preview" />
							}
							{(preview || value) &&
							<button type="button" onClick={(ev) => removeValue(ev, onChange)} className="button-file-cancel" id="buttonFileCancel"><i className="icon" role="img"><IconTimes className="svg" /></i></button>
							}
						</label>
						}
						<div className="form-file-input">
							<label className={`label ${styleNoPlaceholder ? `no-placeholder` : ``}`} htmlFor={name}>
								<input ref={inputRef} type="file" onChange={() => onSelectFile(onChange)} id={name} className="button-file button-dark-gray" hidden accept="image/*" name="image" />
								<label htmlFor={name}>Browse File</label>
								<span className="placeholder">{fileName ? fileName : `No file selected…`}</span>
								{!styleNoPlaceholder && fileName &&
								<button type="button" onClick={(ev) => removeValue(ev, onChange)} className="button-file-cancel" id="buttonFileCancel">x</button>
								}
							</label>
							{footnote &&
							<p className="footnote">{footnote}</p>
							}
							{error &&
							<p className="error">{error.message}</p>
							}
						</div>
					</>
				)}
			/>
		</div>
	)
}

export default FormFile