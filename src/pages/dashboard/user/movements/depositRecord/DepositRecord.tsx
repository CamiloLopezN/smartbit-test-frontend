import {Box, Button, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericTable, {type Action, type Column} from "../../../../../components/ui/GenericTable";
import {useEffect, useState} from "react";
import {
    createDeposit,
    deleteDepositById,
    type Deposit,
    getDepositsByUserId,
    updateDeposit,
} from "../../../../../api/depositServices.ts";
import {
    getMonetaryFundsByUserId,
    type MonetaryFund,
    updateMonetaryFund
} from "../../../../../api/monetaryFundServices.ts";
import {type FieldDefinition, GenericModal, type SelectOption,} from "../../../../../components/ui/GenericModal";

const USER_ID = "bc0b679d-d8f4-4389-a7fb-ef721da10a09";

const columns: Column<Deposit & { fundName: string }>[] = [
    {id: "date", label: "Fecha", minWidth: 120},
    {id: "fundName", label: "Fondo Monetario", minWidth: 180},
    {
        id: "amount",
        label: "Monto",
        minWidth: 120,
        align: "right",
        format: (value: number) =>
            value.toLocaleString("es-CO", {style: "currency", currency: "COP"}),
    },
    {id: "description", label: "Descripción", minWidth: 200},
];

type FormValues = {
    date: string;
    monetaryFundId: string;
    amount: number;
    description?: string;
};

export default function DepositRecord() {
    const [deposits, setDeposits] = useState<(Deposit & { fundName: string })[]>([]);
    const [fundOptions, setFundOptions] = useState<SelectOption[]>([]);
    const [monetaryFunds, setMonetaryFunds] = useState<MonetaryFund[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);

    const fetchData = async () => {
        const [deps, funds] = await Promise.all([
            getDepositsByUserId(USER_ID),
            getMonetaryFundsByUserId(USER_ID),
        ]);

        setMonetaryFunds(funds);
        const fundMap = new Map(funds.map((f) => [f.id, f.name]));
        setFundOptions(funds.map((f) => ({value: f.id, label: f.name})));

        const enriched = deps.map((dep) => ({
            ...dep,
            fundName: fundMap.get(dep.monetaryFundId) || "Desconocido",
        }));

        setDeposits(enriched);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fields: FieldDefinition<FormValues>[] = [
        {name: "date", label: "Fecha", type: "date", required: true},
        {
            name: "monetaryFundId",
            label: "Fondo Monetario",
            type: "select",
            options: fundOptions,
            required: true,
        },
        {name: "amount", label: "Monto", type: "number", required: true},
        {name: "description", label: "Descripción", type: "text"},
    ];

    const actions: Action<Deposit & { fundName: string }>[] = [
        {
            icon: <EditIcon fontSize="small"/>,
            title: "Editar",
            onClick: (row) => {
                setSelectedDeposit(row);
                setIsDeleteMode(false);
                setModalOpen(true);
            },
        },
        {
            icon: <DeleteIcon fontSize="small"/>,
            title: "Eliminar",
            onClick: (row) => {
                setSelectedDeposit(row);
                setIsDeleteMode(true);
                setModalOpen(true);
            },
        },
    ];

    const handleCreateClick = () => {
        setSelectedDeposit(null);
        setIsDeleteMode(false);
        setModalOpen(true);
    };

    const handleSubmit = async (data: FormValues) => {
        if (selectedDeposit) {
            await updateDeposit({
                id: selectedDeposit.id,
                date: data.date,
                monetaryFundId: data.monetaryFundId,
                amount: data.amount,
                description: data.description,
            });
        } else {
            await createDeposit({
                userId: USER_ID,
                date: data.date,
                monetaryFundId: data.monetaryFundId,
                amount: data.amount,
                description: data.description,
            });
        }
        setModalOpen(false);
        fetchData();
    };

    const handleDelete = async () => {
        if (selectedDeposit) {
            await deleteDepositById(selectedDeposit.id);
            setSelectedDeposit(null);
            fetchData();
        }
        setModalOpen(false);
    };

    const initialData: Partial<FormValues> | undefined = selectedDeposit
        ? {
            date: selectedDeposit.date.split("T")[0],
            monetaryFundId: selectedDeposit.monetaryFundId,
            amount: selectedDeposit.amount,
            description: selectedDeposit.description ?? "",
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
                    Registra los depósitos realizados a tus fondos (cuentas bancarias o caja menor),
                    indicando fecha, monto y una breve descripción opcional.
                </Typography>
                <Box width={{xs: "100%", sm: "40%"}}>
                    <Button fullWidth variant="contained" onClick={handleCreateClick}>
                        Crear Depósito
                    </Button>
                </Box>
            </Box>

            <GenericTable
                columns={columns}
                rows={deposits}
                actions={actions}
                initialRowsPerPage={5}
                rowsPerPageOptions={[5, 10, 25]}
            />

            <GenericModal<FormValues>
                open={modalOpen}
                title={
                    isDeleteMode
                        ? "Eliminar Depósito"
                        : selectedDeposit
                            ? "Editar Depósito"
                            : "Crear Depósito"
                }
                fields={isDeleteMode ? [] : fields}
                initialData={isDeleteMode ? undefined : initialData}
                confirmOnly={isDeleteMode}
                confirmMessage={
                    isDeleteMode
                        ? `¿Estás seguro de que deseas eliminar el depósito de ${fundOptions.find(item => item.value === selectedDeposit?.monetaryFundId)?.label}
                         del ${selectedDeposit?.date.split("T")[0]}?`
                        : undefined
                }
                onClose={() => {
                    setModalOpen(false);
                    setSelectedDeposit(null);
                }}
                onSubmit={isDeleteMode ? handleDelete : handleSubmit}
            />
        </>
    );
}
