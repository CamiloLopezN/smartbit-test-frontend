import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import {Grid} from "@mui/material";
import {useEffect, useState} from "react";
import {getSummaryReport, type SummaryReport} from "../../api/reportsServices.ts";


function Summary() {
    const [summary, setSummary] = useState<SummaryReport>();
    const cards = [
        {
            id: 1,
            title: 'Total de Ingresos',
            description: summary?.totalIncome.toLocaleString("en-US", {style: "currency", currency: "USD"}),
        },
        {
            id: 2,
            title: 'Total de Gastos',
            description: summary?.totalExpenses.toLocaleString("en-US", {style: "currency", currency: "USD"}),
        },
        {
            id: 3,
            title: 'Balance Neto',
            description: summary?.netBalance.toLocaleString("en-US", {style: "currency", currency: "USD"}),
        },
    ];
    useEffect(() => {
        getSummaryReport("bc0b679d-d8f4-4389-a7fb-ef721da10a09").then((response) => {
            setSummary(response);
        })
    }, []);
    return (
        <Grid container columns={12} spacing={2} sx={{width: '100%'}} justifyContent={'center'}>
            {cards.map((card, index) => (
                <Grid size={{xs: 12, sm: 4, md: 3}} key={index} component={Card}>
                    <CardActionArea
                        sx={{
                            cursor: 'default',
                            height: '100%',
                            '&[data-active]': {
                                backgroundColor: 'action.selected',
                                '&:hover': {
                                    backgroundColor: 'action.selectedHover',
                                },
                            },
                        }}
                    >
                        <CardContent sx={{height: '100%'}}>
                            <Typography variant="h5" component="div">
                                {card.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {card.description}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Grid>
            ))}
        </Grid>
    );
}

export default Summary;
