import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';

export type FieldType = 'text' | 'number' | 'date' | 'select';

export interface SelectOption {
    value: any;
    label: string;
}

export interface FieldDefinition<T> {
    name: keyof T;
    label: string;
    type: FieldType;
    options?: SelectOption[];
    required?: boolean;
}

interface GenericModalProps<T> {
    open: boolean;
    title: string;
    fields?: FieldDefinition<T>[];
    initialData?: Partial<T>;
    onClose: () => void;
    onSubmit: (data?: T) => void;
    confirmOnly?: boolean;
    confirmMessage?: string;
    children?: React.ReactNode; // 🔹 Soporte para contenido adicional
}

export function GenericModal<T extends Record<string, any>>({
                                                                open,
                                                                title,
                                                                fields = [],
                                                                initialData,
                                                                onClose,
                                                                onSubmit,
                                                                confirmOnly = false,
                                                                confirmMessage,
                                                                children,
                                                            }: GenericModalProps<T>) {
    const [formData, setFormData] = useState<Partial<T>>({});
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    useEffect(() => {
        if (!open || confirmOnly) return;

        // Solo inicializar si formData está vacío (previene reinicios)
        const isEmpty = Object.keys(formData).length === 0;

        if (isEmpty) {
            const defaults: Partial<T> = {};
            fields.forEach((f) => {
                if (initialData && initialData[f.name] !== undefined) {
                    defaults[f.name] = initialData[f.name]!;
                } else {
                    defaults[f.name] = f.type === 'number' ? 0 : '';
                }
            });
            setFormData(defaults);
            setErrors({});
        }
    }, [open, confirmOnly, initialData, fields]);


    const handleChange = (fieldName: keyof T, value: string | number | null) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
        setErrors((prev) => {
            const copy = {...prev};
            delete copy[fieldName];
            return copy;
        });
    };

    const handleSubmit = () => {
        if (confirmOnly) {
            onSubmit();
            return;
        }
        const newErrors: Partial<Record<keyof T, string>> = {};
        for (const field of fields) {
            if (field.required) {
                const val = formData[field.name];
                if (
                    val === undefined ||
                    val === '' ||
                    val === null ||
                    (field.type === 'select' && val === '')
                ) {
                    newErrors[field.name] = 'This field is required';
                }
            }
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit(formData as T);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>

            {!confirmOnly && (
                <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 1, overflow: 'visible'}}>
                    {fields.map((field) => {
                        const fieldValue = formData[field.name] ?? '';
                        const errorMsg = errors[field.name];
                        switch (field.type) {
                            case 'text':
                            case 'number':
                            case 'date':
                                return (
                                    <TextField
                                        key={String(field.name)}
                                        label={field.label}
                                        type={field.type}
                                        value={fieldValue}
                                        required={field.required}
                                        error={Boolean(errorMsg)}
                                        helperText={errorMsg}
                                        onChange={(e) => {
                                            const v = field.type === 'number' ? Number(e.target.value) : e.target.value;
                                            handleChange(field.name, v);
                                        }}
                                        fullWidth
                                        InputLabelProps={field.type === 'date' ? {shrink: true} : undefined}
                                    />
                                );
                            case 'select':
                                return (
                                    <FormControl
                                        key={String(field.name)}
                                        fullWidth
                                        required={field.required}
                                        error={Boolean(errorMsg)}
                                    >
                                        <InputLabel>{field.label}</InputLabel>
                                        <Select
                                            label={field.label}
                                            value={fieldValue}
                                            onChange={(e) => handleChange(field.name, e.target.value as any)}
                                        >
                                            {field.options?.map((opt) => (
                                                <MenuItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
                                    </FormControl>
                                );
                            default:
                                return null;
                        }
                    })}

                    {/* 🔹 Renderiza contenido adicional como detalles de gasto */}
                    {children}
                </DialogContent>
            )}

            {confirmOnly && (
                <DialogContent>
                    <Box mt={1} mb={1}>
                        <Typography>{confirmMessage ?? 'Are you sure?'}</Typography>
                    </Box>
                </DialogContent>
            )}

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {confirmOnly ? 'Accept' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
