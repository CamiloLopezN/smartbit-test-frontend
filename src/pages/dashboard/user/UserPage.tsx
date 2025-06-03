import {Box, Button, Grid, Typography} from "@mui/material";
import {userPages} from "../../../utils/contants/navigation";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import Summary from "../../../components/ui/Summary.tsx";

function UserPage() {
    const navigate = useNavigate();
    const pathName = useLocation();
    const currentPage = userPages.find(page => pathName.pathname.includes(page.path))?.label || null


    return (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={3} flex={1}
             overflow={'auto'}>

            <Box display={"flex"} flexDirection={'column'} width={'100%'} height={'100%'} gap={3}>
                <Summary/>
                {!currentPage && (
                    <Grid container gap={3} justifyContent={'center'}>
                        {userPages.map((page, index) => (
                            <Grid key={index} container size={{xs: 4, sm: 3, md: 2}} justifyContent={'center'}
                                  spacing={2}>
                                <Button fullWidth onClick={() => {
                                    navigate(`${page.path}`)
                                }} sx={{borderRadius: 2, padding: 2, aspectRatio: '1/1'}}
                                        variant="contained"
                                        color={pathName.pathname.includes(page.path) ? 'primary' : 'secondary'}>
                                    {page.icon && <page.icon sx={{fontSize: '6rem'}}/>}
                                </Button>
                                <Typography variant={'body2'} textAlign={'center'}>{page.label}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                )}
                {currentPage && (
                    <Outlet/>
                )}
            </Box>
        </Box>
    );
}

export default UserPage;