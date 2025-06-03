import {Box} from "@mui/material";
import Header from "../../components/shared/header/Header";
import {Outlet} from "react-router-dom";
import BasicBreadcrumbs from "../../components/ui/BasicBreadcrumbs.tsx";

function DashboardPage() {
    return (
        <Box justifyContent={'center'} alignItems={'start'} height={'100vh'}>
            <Header/>
            <Box display={'flex'} flexDirection={'column'} flex={1} p={3} gap={3} width={'100%'}>
                <BasicBreadcrumbs/>
                <Outlet/>
            </Box>
        </Box>
    );
}

export default DashboardPage;