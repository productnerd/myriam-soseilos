import React from "react";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form/Form";
import { Input } from "@/components/ui/form/Input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./AuthFormSchema";

interface AuthFormFieldProps {
	form: UseFormReturn<FormValues>;
	name: keyof FormValues;
	label?: string;
	placeholder?: string;
	type?: string;
	validateOnBlur?: boolean;
	validateOnChange?: boolean;
}

const AuthFormField: React.FC<AuthFormFieldProps> = ({
	form,
	name,
	label,
	placeholder,
	type = "text",
	validateOnBlur = true,
	validateOnChange = true,
}) => {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<Input
							placeholder={placeholder}
							type={type}
							{...field}
							name={String(field.name)}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default AuthFormField;
