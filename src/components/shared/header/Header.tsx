import * as React from 'react';
import {useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {settings, userPages} from "../../../utils/contants/navigation.ts";
import {useLocation, useNavigate} from "react-router-dom";
import { LightMode } from '@mui/icons-material';

function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [currentPage, setCurrentPage] = React.useState<string | null>(null);
    const pathName = useLocation();
    const navigate = useNavigate();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleClickNavigation = (targetPath: string) => {
        navigate(`/dashboard/user/${targetPath}`);
        handleCloseNavMenu();
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        const current = userPages.find(page => pathName.pathname.includes(page.path))?.label || null;
        setCurrentPage(current);
    }, [pathName]);


    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <LightMode sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{display: {xs: 'block', md: 'none'}}}
                        >
                            {userPages.map((page) => (
                                <MenuItem key={page.path} onClick={() => handleClickNavigation(page.path)}

                                          sx={{backgroundColor: currentPage !== page.label ? 'primary.main' : 'secondary.main'}}>
                                    <Typography variant={'body1'} sx={{textAlign: 'center'}}
                                                color={currentPage !== page.label ? 'secondary' : 'primary'}>{page.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <LightMode sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>

                    <Box sx={{flexGrow: 1, gap: 2, display: {xs: 'none', md: 'flex', justifyContent: 'center'}}}>
                        {userPages.map((page) => (
                            <Button
                                variant={'outlined'}
                                key={page.path}
                                onClick={() => {
                                    handleClickNavigation(page.path)
                                }}
                                color={currentPage !== page.label ? 'secondary' : 'text'}
                                sx={{
                                    my: 2,
                                    display: 'block',
                                    borderRadius: 2
                                }}
                            >
                                {page.label}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography sx={{textAlign: 'center'}}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
