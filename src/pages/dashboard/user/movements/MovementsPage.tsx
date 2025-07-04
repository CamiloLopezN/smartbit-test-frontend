import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import BudgetByExpenseType from "./budgetByExpenseType/BudgetByExpenseType.tsx";
import ExpenseRecord from "./expenseRecord/ExpenseRecord.tsx";
import DepositRecord from "./depositRecord/DepositRecord.tsx";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box display={'flex'} flexDirection={'column'} sx={{p: 3}} gap={3}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function MovementsPage() {
    const [value, setValue] = React.useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Presupuesto por tipo de gasto" {...a11yProps(0)} />
                    <Tab label="Registro de gastos" {...a11yProps(1)} />
                    <Tab label="Registro de depósitos" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <BudgetByExpenseType/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <ExpenseRecord/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <DepositRecord/>
            </CustomTabPanel>
        </Box>
    );
}
