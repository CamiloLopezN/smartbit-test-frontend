// src/pages/dashboard/monetary/MonetaryFunds.tsx

import {useEffect, useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericTable, {type Action, type Column} from "../../../../../components/ui/GenericTable";
import {type FieldDefinition, GenericModal} from "../../../../../components/ui/GenericModal";
import {
    createMonetaryFund,
    deleteMonetaryFund,
    type FundType,
    getMonetaryFundsByUserId,
    type MonetaryFund,
    updateMonetaryFund,
} from "../../../../../api/monetaryFundServices";

type FormValues = {
    name: string;
    type: FundType;
    initialBalance: number;
    currentBalance?: number;
    notes: string;
};

const columns: Column<MonetaryFund>[] = [
    {id: "name", label: "Name", minWidth: 150},
    {
        id: "type",
        label: "Type",
        minWidth: 120,
        format: (value) => (value === 0 ? "Bank Account" : "Petty Cash"),
    },
    {
        id: "initialBalance",
        label: "Initial Balance",
        minWidth: 120,
        align: "right",
        format: (value: number) =>
            value.toLocaleString("en-US", {style: "currency", currency: "USD"}),
    },
    {
        id: "currentBalance",
        label: "Current Balance",
        minWidth: 120,
        align: "right",
        format: (value: number) =>
            value.toLocaleString("en-US", {style: "currency", currency: "USD"}),
    },
    {id: "notes", label: "Notes", minWidth: 200},
];

export default function MonetaryFunds() {
    const [monetaryFunds, setMonetaryFunds] = useState<MonetaryFund[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFund, setSelectedFund] = useState<MonetaryFund | null>(null);
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    const userId = "bc0b679d-d8f4-4389-a7fb-ef721da10a09";

    const fetchFunds = async () => {
        const funds = await getMonetaryFundsByUserId(userId);
        setMonetaryFunds(funds);
    };

    useEffect(() => {
        fetchFunds();
    }, []);

    const fields: FieldDefinition<FormValues>[] = [
        {name: "name", label: "Name", type: "text", required: true},
        {
            name: "type",
            label: "Type",
            type: "select",
            required: true,
            options: [
                {value: 0, label: "Bank Account"},
                {value: 1, label: "Petty Cash"},
            ],
        },
        {name: "initialBalance", label: "Initial Balance", type: "number", required: true},
        {name: "notes", label: "Notes", type: "text"},
    ];

    const actions: Action<MonetaryFund>[] = [
        {
            icon: <EditIcon fontSize="small"/>,
            title: "Edit",
            onClick: (row) => {
                setSelectedFund(row);
                setIsDeleteMode(false);
                setModalOpen(true);
            },
        },
        {
            icon: <DeleteIcon fontSize="small"/>,
            title: "Delete",
            onClick: (row) => {
                setSelectedFund(row);
                setIsDeleteMode(true);
                setModalOpen(true);
            },
        },
    ];

    const handleCreateClick = () => {
        setSelectedFund(null);
        setIsDeleteMode(false);
        setModalOpen(true);
    };

    const handleSubmit = async (data: FormValues) => {
        if (selectedFund) {
            await updateMonetaryFund({
                id: selectedFund.id,
                name: data.name,
                type: data.type,
                notes: data.notes,
            });
        } else {
            await createMonetaryFund({
                userId,
                name: data.name,
                type: data.type,
                initialBalance: data.initialBalance,
                notes: data.notes,
            });
        }
        setModalOpen(false);
        fetchFunds();
    };

    const handleConfirm = async () => {
        if (selectedFund) {
            await deleteMonetaryFund(selectedFund.id);
            setSelectedFund(null);
            fetchFunds();
        }
        setModalOpen(false);
    };

    const initialData: Partial<FormValues> | undefined = selectedFund
        ? {
            name: selectedFund.name,
            type: selectedFund.type,
            initialBalance: selectedFund.initialBalance,
            notes: selectedFund.notes ?? "",
        }
        : undefined;

    return (
        <>
            <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                gap={2}
                justifyContent="space-between"
                mb={2}
            >
                <Typography variant="body1" width={{xs: "100%", sm: "50%"}}>
                    Configura y gestiona tus fuentes de dinero (cuentas bancarias o caja menor),
                    estableciendo el saldo inicial para controlar ingresos y egresos.
                </Typography>
                <Box width={{xs: "100%", sm: "40%"}}>
                    <Button fullWidth variant="contained" onClick={handleCreateClick}>
                        Crear Fondo Monetario
                    </Button>
                </Box>
            </Box>

            <GenericTable<MonetaryFund>
                columns={columns}
                rows={monetaryFunds}
                actions={actions}
                initialRowsPerPage={5}
                rowsPerPageOptions={[5, 10, 25]}
            />

            <GenericModal<FormValues>
                open={modalOpen}
                title={
                    isDeleteMode
                        ? `Delete Monetary Fund`
                        : selectedFund
                            ? "Edit Monetary Fund"
                            : "Create Monetary Fund"
                }
                fields={isDeleteMode ? [] : fields}
                initialData={isDeleteMode ? undefined : initialData}
                confirmOnly={isDeleteMode}
                confirmMessage={
                    isDeleteMode
                        ? `Are you sure you want to delete "${selectedFund?.name}"?`
                        : undefined
                }
                onClose={() => setModalOpen(false)}
                onSubmit={isDeleteMode ? handleConfirm : handleSubmit}
            />
        </>
    );
}