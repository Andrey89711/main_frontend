import {
    useState
} from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import api from "../api/api";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button
} from "@mui/material";


function RegisterPage() {

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({
            full_name: "",
            email: "",
            phone: "",
            password: "",
            street: "",
            house: "",
            apartment: ""
        });


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };


    const handleRegister = async (
        e
    ) => {

        e.preventDefault();

        try {

            await api.post(
                "/auth/register",
                {
                    ...formData,
                    role: "resident"
                }
            );

            alert(
                "Регистрация успешна"
            );

            navigate("/");

        } catch (error) {

            console.error(error);

            alert(
                "Ошибка регистрации"
            );
        }
    };


    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                    "#f4f6f8"
            }}
        >

            <Card
                sx={{
                    width: 450,
                    borderRadius: 4,
                    boxShadow: 4
                }}
            >

                <CardContent>

                    <Typography
                        variant="h4"
                        gutterBottom
                        fontWeight="bold"
                    >
                        Регистрация
                    </Typography>

                    <form
                        onSubmit={
                            handleRegister
                        }
                    >

                        <TextField
                            fullWidth
                            label="ФИО"
                            name="full_name"
                            margin="normal"
                            onChange={
                                handleChange
                            }
                        />

                        <TextField
                            fullWidth
                            label="Почта"
                            name="email"
                            margin="normal"
                            onChange={
                                handleChange
                            }
                        />

                        <TextField
                            fullWidth
                            label="Телефон"
                            name="phone"
                            margin="normal"
                            onChange={
                                handleChange
                            }
                        />

                        <TextField
                            fullWidth
                            label="Улица"
                            name="street"
                            margin="normal"
                            onChange={
                                handleChange
                            }
                        />

                        <TextField
                            fullWidth
                            label="Дом"
                            name="house"
                            margin="normal"
                            onChange={
                                handleChange
                            }
                        />

                        <TextField
                            fullWidth
                            label="Квартира"
                            name="apartment"
                            margin="normal"
                            onChange={
                                handleChange
                            }
                        />

                        <TextField
                            fullWidth
                            label="Пароль"
                            type="password"
                            name="password"
                            margin="normal"
                            onChange={
                                handleChange
                            }
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{
                                mt: 2,
                                borderRadius: 3
                            }}
                        >
                            Зарегистрироваться
                        </Button>

                    </form>

                    <br />

                    <Link to="/">
                        Назад ко входу
                    </Link>

                </CardContent>

            </Card>

        </Box>
    );
}

export default RegisterPage;