import {useEffect, useState} from "react";
import {Box, Button, IconButton, InputLabel, Select, TextField, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import GenericTable, {type Action, type Column} from "../../../../../components/ui/GenericTable";
import {type FieldDefinition, GenericModal} from "../../../../../components/ui/GenericModal";
import {type ExpenseHeader, getExpensesByUser} from "../../../../../api/expenseServices";
import {
    createExpense,
    deleteExpense,
    getExpensesByUserAndDateRange,
    updateExpense,
} from "../../../../../api/expenseServices";
import {getMonetaryFundsByUserId} from "../../../../../api/monetaryFundServices";
import {getExpenseTypesByUserId} from "../../../../../api/expenseTypesServices";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";

type Detail = {
    expenseTypeId: string;
    amount: number;
};


type FormValues = {
    date: string;
    monetaryFundId: string;
    commerceName: string;
    documentType: "Comprobante" | "Factura" | "Otro";
    observations?: string;
    details: Detail[];
};

const columns: Column<ExpenseHeader>[] = [
    {id: "date", label: "Fecha", minWidth: 120},
    {id: "commerceName", label: "Comercio", minWidth: 180},
    {id: "documentType", label: "Tipo de Doc.", minWidth: 120},
    {
        id: "totalAmount",
        label: "Total Gasto",
        minWidth: 140,
        align: "right",
        format: (value: number) =>
            value.toLocaleString("es-CO", {style: "currency", currency: "COP"}),
    },
];

export default function ExpenseRecord() {
    const userId = "bc0b679d-d8f4-4389-a7fb-ef721da10a09";

    const [expenses, setExpenses] = useState<ExpenseHeader[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<ExpenseHeader | null>(null);
    const [fundOptions, setFundOptions] = useState<{ value: string; label: string }[]>([]);
    const [typeOptions, setTypeOptions] = useState<{ value: string; label: string }[]>([]);
    const [details, setDetails] = useState<Detail[]>([]);

    const fetchExpenses = async () => {
        const data = await getExpensesByUser(userId);
        setExpenses(data);
    };

    const fetchSelectOptions = async () => {
        const [funds, types] = await Promise.all([
            getMonetaryFundsByUserId(userId),
            getExpenseTypesByUserId(userId),
        ]);

        setFundOptions(funds.map(f => ({value: f.id, label: f.name})));
        setTypeOptions(types.map(t => ({value: t.id, label: t.name})));
    };

    useEffect(() => {
        fetchExpenses();
        fetchSelectOptions();
    }, []);

    const handleCreateClick = () => {
        setSelectedExpense(null);
        setDetails([{expenseTypeId: "", amount: 0}]);
        setModalOpen(true);
    };

    const handleAddDetail = () => {
        setDetails([...details, {expenseTypeId: "", amount: 0}]);
    };

    const handleRemoveDetail = (index: number) => {
        const newDetails = [...details];
        newDetails.splice(index, 1);
        setDetails(newDetails);
    };

    const handleEditClick = (row: ExpenseHeader) => {
        setSelectedExpense(row);
        setDetails(row.expenseDetails.map(d => ({
            expenseTypeId: d.expenseTypeId,
            amount: d.amount
        })));
        setModalOpen(true);
    };

    const handleDetailChange = (index: number, field: keyof Detail, value: any) => {
        const updated = [...details];
        updated[index][field] = value;
        setDetails(updated);
    };

    const handleSubmit = async (data: Omit<FormValues, "details">) => {
        if (details.length < 1) {
            alert("Debes incluir al menos un detalle de gasto.");
            return;
        }

        const validDetails = details.filter(d => d.expenseTypeId && d.amount > 0);

        if (validDetails.length === 0) {
            alert("Los detalles deben tener un tipo de gasto válido y monto mayor a 0.");
            return;
        }

        if (selectedExpense) {
            await updateExpense({
                id: selectedExpense.id,
                ...data,
                details: validDetails,
            });
        } else {
            await createExpense({
                userId,
                ...data,
                details: validDetails,
            });
        }

        setModalOpen(false);
        fetchExpenses();
    };

    const handleDelete = async () => {
        if (selectedExpense) {
            await deleteExpense(selectedExpense.id);
            setSelectedExpense(null);
            fetchExpenses();
        }
        setModalOpen(false);
    };

    const fields: FieldDefinition<Omit<FormValues, "details">>[] = [
        {name: "date", label: "Fecha", type: "date", required: true},
        {name: "monetaryFundId", label: "Fondo Monetario", type: "select", required: true, options: fundOptions},
        {name: "commerceName", label: "Comercio", type: "text", required: true},
        {
            name: "documentType",
            label: "Tipo de Documento",
            type: "select",
            required: true,
            options: [
                {value: 0, label: "Comprobante"},
                {value: 1, label: "Factura"},
                {value: 2, label: "Otro"},
            ],
        },
        {name: "observations", label: "Observaciones", type: "text"},
    ];

    const initialData: Partial<FormValues> | undefined = selectedExpense
        ? {
            date: selectedExpense.date.slice(0, 10),
            monetaryFundId: selectedExpense.monetaryFundId,
            commerceName: selectedExpense.commerceName,
            documentType: selectedExpense.documentType,
            observations: selectedExpense.observations ?? "",
        }
        : undefined;


    const renderDetails = () => (
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Typography variant="subtitle1">Detalles de gasto</Typography>
            {details.map((detail, index) => (
                <Box
                    key={index}
                    display="flex"
                    gap={2}
                    alignItems="center"
                    width="100%"
                    flexWrap="wrap"
                >
                    <FormControl fullWidth sx={{flex: 2}} required>
                        <InputLabel>Tipo de Gasto</InputLabel>
                        <Select
                            value={detail.expenseTypeId}
                            label="Tipo de Gasto"
                            onChange={(e) =>
                                handleDetailChange(index, "expenseTypeId", e.target.value)
                            }
                        >
                            {typeOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        type="number"
                        label="Monto"
                        value={detail.amount}
                        onChange={(e) =>
                            handleDetailChange(index, "amount", parseFloat(e.target.value))
                        }
                        fullWidth
                        sx={{flex: 1}}
                        required
                    />

                    {details.length > 1 && (
                        <IconButton
                            onClick={() => handleRemoveDetail(index)}
                            color="error"
                            aria-label="Eliminar detalle"
                            size="large"
                        >
                            <RemoveCircleOutlineIcon/>
                        </IconButton>
                    )}
                </Box>
            ))}

            <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon/>}
                onClick={handleAddDetail}
                sx={{alignSelf: "flex-start", mt: 1}}
            >
                Agregar detalle de gasto
            </Button>
        </Box>
    );

    const actions: Action<ExpenseHeader>[] = [
        {
            icon: <EditIcon fontSize="small"/>,
            title: "Editar",
            onClick: handleEditClick
        },
        {
            icon: <DeleteIcon fontSize="small"/>,
            title: "Eliminar",
            onClick: (row) => {
                setSelectedExpense(row);
                setIsDeleteMode(true);
                setModalOpen(true);
            },
        },
    ];

    return (
        <>
            <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} justifyContent="space-between" mb={2}>
                <Typography variant="body1" width={{xs: "100%", sm: "50%"}}>
                    Registra tus gastos indicando fecha, fondo monetario, comercio, tipo de documento y monto.
                </Typography>
                <Box width={{xs: "100%", sm: "40%"}}>
                    <Button fullWidth variant="contained" onClick={handleCreateClick}>
                        Nuevo Gasto
                    </Button>
                </Box>
            </Box>

            <GenericTable<ExpenseHeader>
                columns={columns}
                rows={expenses}
                actions={actions}
                initialRowsPerPage={5}
                rowsPerPageOptions={[5, 10, 25]}
            />

            <GenericModal<Omit<FormValues, "details">>
                key={selectedExpense?.id ?? 'new'}
                open={modalOpen}
                title={
                    isDeleteMode
                        ? "Eliminar Gasto"
                        : selectedExpense
                            ? "Editar Gasto"
                            : "Nuevo Gasto"
                }
                fields={isDeleteMode ? [] : fields}
                initialData={isDeleteMode ? undefined : initialData}
                confirmOnly={isDeleteMode}
                confirmMessage={
                    isDeleteMode
                        ? `¿Estás seguro de eliminar el gasto en ${selectedExpense?.commerceName}?`
                        : undefined
                }
                onClose={() => setModalOpen(false)}
                onSubmit={isDeleteMode ? handleDelete : handleSubmit}
                children={!isDeleteMode && renderDetails()}
            />
        </>
    );
}
