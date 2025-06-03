import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {useEffect, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {getBudgetVsExecuted, getMovements} from '../../../../api/reportsServices';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {format} from 'date-fns';

function ReportsPage() {
    const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState<Dayjs>(dayjs().endOf('month'));
    const [movements, setMovements] = useState<any[]>([]);
    const [budgetChart, setBudgetChart] = useState<any[]>([]);

    const userId = "bc0b679d-d8f4-4389-a7fb-ef721da10a09";

    const loadReports = async () => {
        const [movementsData, budgetData] = await Promise.all([
            getMovements(userId, startDate.toISOString(), endDate.toISOString()),
            getBudgetVsExecuted(userId, startDate.toISOString(), endDate.toISOString()),
        ]);

        const deposits = movementsData?.deposits || [];
        const expenses = movementsData?.expenses || [];

        const parsedDeposits = deposits.map((d: any) => ({
            date: d.date,
            type: 'Depósito',
            description: d.description,
            amount: d.amount,
        }));

        const parsedExpenses = expenses.map((e: any) => ({
            date: e.date,
            type: 'Gasto',
            description: e.observations,
            amount: e.totalAmount,
        }));

        setMovements([...parsedDeposits, ...parsedExpenses]);
        setBudgetChart(budgetData || []);
    };

    useEffect(() => {
        loadReports();
    }, []);

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Reportes
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box display="flex" gap={2} mb={2}>
                    <DatePicker
                        label="Desde"
                        value={startDate}
                        onChange={(newValue) => newValue && setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="Hasta"
                        value={endDate}
                        onChange={(newValue) => newValue && setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <Button variant="contained" onClick={loadReports}>
                        Consultar
                    </Button>
                </Box>
            </LocalizationProvider>

            <Box mt={4}>
                <Typography variant="h6">Movimientos (Gastos y Depósitos)</Typography>
                <TableContainer component={Paper} sx={{mt: 2}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Monto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {movements.map((m, index) => (
                                <TableRow key={index}>
                                    <TableCell>{format(new Date(m.date), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{m.type}</TableCell>
                                    <TableCell>{m.description}</TableCell>
                                    <TableCell>${m.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box mt={6}>
                <Typography variant="h6">Presupuesto vs Ejecución</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetChart}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="expenseTypeId"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="budgeted" fill="#8884d8" name="Presupuestado"/>
                        <Bar dataKey="executed" fill="#82ca9d" name="Ejecutado"/>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}

export default ReportsPage;
