import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { TextFieldProps } from "@mui/material";

type FormInputProps = TextFieldProps & {
    name: string;
    control: any;
    setValue?: any;
}

export const FormInputText = ({ name, control, label, ...props }: FormInputProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, value },
                fieldState: { error },
                // formState,
            }) => (
                <TextField
                    {...props}
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label={label}
                    variant="outlined"
                />
            )}
        />
    );
};