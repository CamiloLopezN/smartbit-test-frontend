import {Search} from "@mui/icons-material";
import {Box, Button, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import SelectField from "../../../../components/ui/SelectField.tsx";

function MovementsPage() {
    return (
        <>
            <Box>
                <Typography variant={'h3'}>
                    Movements
                </Typography>
                <Typography>View and manage your financial transactions.</Typography>
            </Box>

            <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} gap={2}>
                <TextField
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            ),
                        },
                    }} id="outlined-basic" label="Buscar transacciones"
                    placeholder={'Buscar transacciones'} variant="outlined"/>
                <Button variant={'contained'}>Crear un nuevo movimiento</Button>
            </Box>

            <Grid width={{xs: '100%', md: '100%'}} container columns={{xs: 4, md: 12}}
                  spacing={{xs: 2, md: 2}}>

                <Grid size={{xs: 2, sm: 2, md: 2.5}}>
                    <SelectField label={"Rango de tiempo"}/>
                </Grid>
                <Grid size={{xs: 2, sm: 2, md: 2.5}}>
                    <SelectField label={"Tipo de gasto"}/>
                </Grid>
                <Grid size={{xs: 2, sm: 2, md: 2.5}}>
                    <SelectField label={"Fondo monetario"}/>
                </Grid>
                <Grid size={{xs: 2, sm: 2, md: 2.5}}>
                    <SelectField label={"Tipo de movimiento"}/>
                </Grid>
            </Grid>

            <Grid>
                {/*<GenericTable/>*/}
            </Grid>

        </>
    );
}

export default MovementsPage;