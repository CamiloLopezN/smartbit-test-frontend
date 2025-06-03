// src/pages/dashboard/monetary/ExpenseTypes.tsx

import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericTable, { type Action, type Column } from "../../../../../components/ui/GenericTable";
import { GenericModal, type FieldDefinition } from "../../../../../components/ui/GenericModal";
import {
    getExpenseTypesByUserId,
    createExpenseType,
    updateExpenseType,
    deleteExpenseType,
} from "../../../../../api/expenseTypesServices";
import type { IExpenseType } from "../../../../../utils/types/expenseTypes";

type FormValues = {
    name: string;
    description: string;
};

const columns: Column<IExpenseType>[] = [
    { id: "code", label: "Code", minWidth: 100 },
    { id: "name", label: "Name", minWidth: 150 },
    { id: "description", label: "Description", minWidth: 200 },
];

export default function ExpenseTypes() {
    const [expenseTypes, setExpenseTypes] = useState<IExpenseType[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedType, setSelectedType] = useState<IExpenseType | null>(null);

    const userId = "bc0b679d-d8f4-4389-a7fb-ef721da10a09";

    const fetchExpenseTypes = async () => {
        const types = await getExpenseTypesByUserId(userId);
        setExpenseTypes(types);
    };

    useEffect(() => {
        fetchExpenseTypes();
    }, []);

    const fields: FieldDefinition<FormValues>[] = [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "description", label: "Description", type: "text" },
    ];

    const actions: Action<IExpenseType>[] = [
        {
            icon: <EditIcon fontSize="small" />,
            title: "Edit",
            onClick: (row) => {
                setSelectedType(row);
                setIsDeleteMode(false);
                setModalOpen(true);
            },
        },
        {
            icon: <DeleteIcon fontSize="small" />,
            title: "Delete",
            onClick: (row) => {
                setSelectedType(row);
                setIsDeleteMode(true);
                setModalOpen(true);
            },
        },
    ];

    const handleCreateClick = () => {
        setSelectedType(null);
        setIsDeleteMode(false);
        setModalOpen(true);
    };

    const handleSubmit = async (data: FormValues) => {
        if (selectedType) {
            await updateExpenseType({
                id: selectedType.id,
                name: data.name,
                description: data.description,
            });
        } else {
            await createExpenseType({
                userId,
                name: data.name,
                description: data.description,
            });
        }
        setModalOpen(false);
        fetchExpenseTypes();
    };

    const handleDelete = async () => {
        if (selectedType) {
            await deleteExpenseType(selectedType.id);
            setSelectedType(null);
            fetchExpenseTypes();
        }
        setModalOpen(false);
    };

    const initialData: Partial<FormValues> | undefined = selectedType
        ? {
            name: selectedType.name,
            description: selectedType.description ?? "",
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
                <Typography variant="body1" width={{ xs: "100%", sm: "50%" }}>
                    Define y administra las categorías de tus egresos (alimentación, transporte, servicios, etc.),
                    generando automáticamente un código único para cada una.
                </Typography>
                <Box width={{ xs: "100%", sm: "40%" }}>
                    <Button fullWidth variant="contained" onClick={handleCreateClick}>
                        Crear Tipo de Gasto
                    </Button>
                </Box>
            </Box>

            <GenericTable<IExpenseType>
                columns={columns}
                rows={expenseTypes}
                actions={actions}
                initialRowsPerPage={5}
                rowsPerPageOptions={[5, 10, 25]}
            />

            <GenericModal<FormValues>
                key={selectedType?.id ?? 'new'}
                open={modalOpen}
                title={
                    isDeleteMode
                        ? "Delete Expense Type"
                        : selectedType
                            ? "Edit Expense Type"
                            : "Create Expense Type"
                }
                fields={isDeleteMode ? [] : fields}
                initialData={isDeleteMode ? undefined : initialData}
                confirmOnly={isDeleteMode}
                confirmMessage={
                    isDeleteMode
                        ? `Are you sure you want to delete "${selectedType?.name}"?`
                        : undefined
                }
                onClose={() => setModalOpen(false)}
                onSubmit={isDeleteMode ? handleDelete : handleSubmit}
            />
        </>
    );
}
