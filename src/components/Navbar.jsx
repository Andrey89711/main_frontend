import {
    Link,
    useLocation,
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
    Box,
    Container,
    Stack
} from "@mui/material";


function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const token =
        localStorage.getItem("token");

    let role = null;

    try {

        if (token) {
            role = jwtDecode(token).role;
        }

    } catch (error) {
        console.error(error);
    }

    const navItems = [
        {
            label: "Главная",
            to: "/dashboard"
        },
        {
            label: "Создать заявку",
            to: "/create-ticket"
        },
        ...(role === "dispatcher"
            ? [{
                label: "Диспетчер",
                to: "/dispatcher"
            }]
            : []),
        {
            label: "Профиль",
            to: "/profile"
        }
    ];

    const handleLogout = () => {

        localStorage.removeItem("token");
        navigate("/");
    };

    return (

        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: "rgba(255,255,255,0.92)",
                color: "text.primary",
                borderBottom: "1px solid",
                borderColor: "divider",
                backdropFilter: "blur(12px)"
            }}
        >
            <Container maxWidth="lg">
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: 72,
                        gap: 2,
                        flexWrap: "wrap",
                        py: { xs: 1.5, md: 0 }
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{ lineHeight: 1.1 }}
                        >
                            ТСЖ Сервис
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Заявки жильцов и диспетчерская
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            flexWrap: "wrap",
                            rowGap: 1,
                            justifyContent: { xs: "flex-start", md: "flex-end" }
                        }}
                    >
                        {navItems.map((item) => {

                            const active =
                                location.pathname === item.to;

                            return (
                                <Button
                                    key={item.to}
                                    component={Link}
                                    to={item.to}
                                    variant={active ? "contained" : "text"}
                                    color={active ? "primary" : "inherit"}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}

                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleLogout}
                        >
                            Выйти
                        </Button>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
