import {Box, Button, InputAdornment, TextField} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';

interface ILoginForm {
    handleLogin: () => void;
}

function LoginForm({handleLogin}: ILoginForm) {
    return (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={3}>
            <TextField
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon/>
                            </InputAdornment>
                        ),
                    },
                }} id="outlined-basic" label="Nombre de usuario"
                placeholder={'Nombre de usuario'} variant="outlined"/>
            <TextField
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <PasswordIcon/>
                            </InputAdornment>
                        ),
                    },
                }} type={'password'} id="outlined-basic" label="Contraseña"
                placeholder={'Contraseña'} variant="outlined"/>
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Iniciar sesión
            </Button>
        </Box>
    );
}

export default LoginForm;