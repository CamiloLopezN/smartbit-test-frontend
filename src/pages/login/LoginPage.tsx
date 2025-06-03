import LoginForm from "./loginForm/LoginForm.tsx";
import {Box, Button, Divider, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {login} from "../../api/userService.ts";

function LoginPage() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        login({userName, password}).then((response) => {
            if (response && response.id) {
                localStorage.setItem("userId", response.id);
                localStorage.setItem("userName", response.userName);
                navigate('/dashboard/user');
            }
        })
    }

    const handleRegister = () => {

    }

    const handleForgotPassword = () => {

    }

    return (
        <Grid container justifyContent={'center'} alignItems={'center'} height={'100vh'}>
            <Grid size={{xs: 12, sm: 7, md: 5}} padding={5} gap={3}
                  container direction={'column'} borderRadius={'1rem'}
                  sx={{boxShadow: 3}}
                  bgcolor={theme => theme.palette.background.paper}>
                <Typography variant={'h4'} component={'h1'} textAlign={'center'} gutterBottom>
                    Iniciar sesión
                </Typography>
                <LoginForm password={password} setPassword={setPassword} userName={userName} setUserName={setUserName}
                           handleLogin={handleLogin}/>
                <Button variant={'text'} color={'secondary'}
                        onClick={handleForgotPassword}>
                    He olvidado mi contraseña
                </Button>
                <Divider/>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={2}>
                    <Typography>
                        ¿No tienes cuenta?
                    </Typography>
                    <Button variant={'text'} color={'secondary'}
                            onClick={handleRegister}>Registrate
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
}

export default LoginPage;