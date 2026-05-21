import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    jwtDecode
} from "jwt-decode";

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
} from "@mui/material";


function Navbar() {

    const navigate = useNavigate();

    const token =
        localStorage.getItem(
            "token"
        );

    let role = null;

    try {

        if (token) {

            const decoded =
                jwtDecode(token);

            role = decoded.role;
        }

    } catch (error) {

        console.error(error);
    }

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        navigate("/");
    };

    return (

        <AppBar position="static">

            <Toolbar>

                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1
                    }}
                >
                    ТСЖ система
                </Typography>

                <Box>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/dashboard"
                    >
                        Главная
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/create-ticket"
                    >
                        Создать заявку
                    </Button>

                    {role ===
                        "dispatcher" && (

                        <Button
                            color="inherit"
                            component={Link}
                            to="/dispatcher"
                        >
                            Панель диспетчера
                        </Button>
                    )}
					
                        <Button
                            color="inherit"
                            component={Link}
                            to="/profile"
                        >
                            Профиль
                        </Button>					

                    <Button
                        color="inherit"
                        onClick={
                            handleLogout
                        }
                    >
                        Выход
                    </Button>

                </Box>

            </Toolbar>

        </AppBar>
    );
}

export default Navbar;