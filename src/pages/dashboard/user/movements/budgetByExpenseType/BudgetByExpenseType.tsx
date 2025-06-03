// src/pages/dashboard/user/budget/BudgetByExpenseType.tsx

import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericTable, { type Action, type Column } from "../../../../../components/ui/GenericTable";
import { GenericModal, type FieldDefinition, type SelectOption } from "../../../../../components/ui/GenericModal";
import { getBudgetsByUserId, createBudget, updateBudget, deleteBudget } from "../../../../../api/badgetServices";
import { getExpenseTypesByUserId } from "../../../../../api/expenseTypesServices";
import type { Budget } from "../../../../../api/badgetServices";

const USER_ID = "bc0b679d-d8f4-4389-a7fb-ef721da10a09";

const monthOptions: SelectOption[] = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
];

const yearOptions: SelectOption[] = ["2024", "2025", "2026", "2027"].map(y => ({ value: y, label: y }));

type EnrichedBudget = Budget & { expenseTypeName: string };

export default function BudgetByExpenseType() {
    const [budgets, setBudgets] = useState<EnrichedBudget[]>([]);
    const [expenseTypeOptions, setExpenseTypeOptions] = useState<SelectOption[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<EnrichedBudget | null>(null);

    const fetchData = async () => {
        const [budgetsRaw, types] = await Promise.all([
            getBudgetsByUserId(USER_ID),
            getExpenseTypesByUserId(USER_ID),
        ]);

        const map = new Map(types.map(t => [t.id, t.name]));
        setExpenseTypeOptions(types.map(t => ({ value: t.id, label: t.name })));

        const enriched = budgetsRaw.map(b => ({
            ...b,
            expenseTypeName: map.get(b.expenseTypeId) ?? "Desconocido",
        }));

        setBudgets(enriched);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns: Column<EnrichedBudget>[] = [
        {
            id: "month",
            label: "Mes/Año",
            minWidth: 120,
            format: (month: number, row) =>
                `${monthOptions.find(m => m.value === month.toString())?.label ?? month} ${row.year}`,
        },
        { id: "expenseTypeName", label: "Tipo de Gasto", minWidth: 150 },
        {
            id: "amount",
            label: "Monto Presupuestado",
            minWidth: 150,
            align: "right",
            format: (value: number) =>
                value.toLocaleString("es-CO", { style: "currency", currency: "COP" }),
        },
    ];

    const fields: FieldDefinition<Omit<Budget, "id" | "userId">>[] = [
        { name: "month", label: "Mes", type: "select", options: monthOptions, required: true },
        { name: "year", label: "Año", type: "select", options: yearOptions, required: true },
        { name: "expenseTypeId", label: "Tipo de Gasto", type: "select", options: expenseTypeOptions, required: true },
        { name: "amount", label: "Monto", type: "number", required: true },
    ];

    const actions: Action<EnrichedBudget>[] = [
        {
            icon: <EditIcon fontSize="small" />,
            title: "Editar",
            onClick: (row) => {
                setSelectedBudget(row);
                setIsDeleteMode(false);
                setModalOpen(true);
            },
        },
        {
            icon: <DeleteIcon fontSize="small" />,
            title: "Eliminar",
            onClick: (row) => {
                setSelectedBudget(row);
                setIsDeleteMode(true);
                setModalOpen(true);
            },
        },
    ];

    const handleCreate = () => {
        setSelectedBudget(null);
        setIsDeleteMode(false);
        setModalOpen(true);
    };

    const handleSubmit = async (data: any) => {
        if (selectedBudget) {
            await updateBudget({ ...data, id: selectedBudget.id });
        } else {
            await createBudget({ ...data, userId: USER_ID });
        }
        setModalOpen(false);
        fetchData();
    };

    const handleDelete = async () => {
        if (selectedBudget) {
            await deleteBudget(selectedBudget.id);
        }
        setModalOpen(false);
        fetchData();
    };

    const initialData = selectedBudget
        ? {
            month: selectedBudget.month.toString(),
            year: selectedBudget.year.toString(),
            amount: selectedBudget.amount,
            expenseTypeId: selectedBudget.expenseTypeId,
        }
        : undefined;

    return (
        <>
            <Box display="flex" flexWrap="wrap" gap={2} justifyContent="space-between" mb={2}>
                <Typography variant="body1" width={{ xs: "100%", sm: "50%" }}>
                    Asigna un monto mensual para cada categoría de gasto; cada presupuesto se aplica al mes seleccionado.
                </Typography>
                <Box width={{ xs: "100%", sm: "40%" }}>
                    <Button fullWidth variant="contained" onClick={handleCreate}>
                        Crear Presupuesto
                    </Button>
                </Box>
            </Box>

            <GenericTable
                columns={columns}
                rows={budgets}
                actions={actions}
                initialRowsPerPage={5}
                rowsPerPageOptions={[5, 10, 25]}
            />

            <GenericModal
                open={modalOpen}
                title={
                    isDeleteMode
                        ? "Eliminar Presupuesto"
                        : selectedBudget
                            ? "Editar Presupuesto"
                            : "Crear Presupuesto"
                }
                fields={isDeleteMode ? [] : fields}
                initialData={isDeleteMode ? undefined : initialData}
                confirmOnly={isDeleteMode}
                confirmMessage={
                    isDeleteMode
                        ? `¿Estás seguro de eliminar el presupuesto para ${selectedBudget?.expenseTypeName}?`
                        : undefined
                }
                onClose={() => setModalOpen(false)}
                onSubmit={isDeleteMode ? handleDelete : handleSubmit}
            />
        </>
    );
}
