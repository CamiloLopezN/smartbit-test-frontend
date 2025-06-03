import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {useLocation, useNavigate} from "react-router-dom";
import {userPages} from "../../utils/contants/navigation.ts";
import Link from '@mui/material/Link';


export default function BasicBreadcrumbs() {
    const navigate = useNavigate();
    const pathName = useLocation();
    const currentPage = userPages.find(page => pathName.pathname.includes(page.path))?.label || null

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        navigate('/dashboard/user');
    }

    return (
        <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="text.primary">
                    Dashboard
                </Typography>
                <Link underline="hover"
                      color="inherit"
                      sx={{cursor: 'pointer'}}
                      onClick={handleClick}>
                    User
                </Link>
                {currentPage && (
                    <Typography sx={{color: 'text.primary'}}>
                        {currentPage}
                    </Typography>
                )}
            </Breadcrumbs>
        </div>
    );
}
