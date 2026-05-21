import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import api from "../api/api";


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

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getApiError = (err) => {

        const detail = err.response?.data?.detail;

        if (Array.isArray(detail)) {

            const passwordError = detail.find((item) =>
                item.loc?.includes("password")
            );

            if (passwordError) {
                return "Пароль должен содержать минимум 5 символов.";
            }

            return "Проверьте корректность заполненных полей.";
        }

        if (detail === "Email already exists") {
            return "Пользователь с таким email уже существует.";
        }

        return "Не удалось зарегистрироваться. Проверьте данные.";
    };

    const handleRegister = async (e) => {

        e.preventDefault();
        setError("");

        if (formData.password.length < 5) {
            setError("Пароль должен содержать минимум 5 символов.");
            return;
        }

        setLoading(true);

        try {

            await api.post(
                "/auth/register",
                {
                    ...formData,
                    role: "resident"
                }
            );

            navigate("/");

        } catch (err) {
            console.error(err);
            setError(getApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                py: 6
            }}
        >
            <Container maxWidth="md">
                <Card>
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Регистрация жильца
                                </Typography>
                                <Typography color="text.secondary">
                                    Укажите контакты и адрес, чтобы заявки автоматически привязывались к квартире.
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            )}

                            <Stack
                                component="form"
                                spacing={2}
                                onSubmit={handleRegister}
                            >
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr"
                                        },
                                        gap: 2
                                    }}
                                >
                                    <TextField
                                        label="ФИО"
                                        name="full_name"
                                        value={formData.full_name}
                                        required
                                        fullWidth
                                        onChange={handleChange}
                                    />

                                    <TextField
                                        label="Телефон"
                                        name="phone"
                                        value={formData.phone}
                                        required
                                        fullWidth
                                        onChange={handleChange}
                                    />

                                    <TextField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        required
                                        fullWidth
                                        onChange={handleChange}
                                    />

                                    <TextField
                                        label="Пароль"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        required
                                        fullWidth
                                        helperText="Минимум 5 символов"
                                        onChange={handleChange}
                                    />

                                    <TextField
                                        label="Улица"
                                        name="street"
                                        value={formData.street}
                                        required
                                        fullWidth
                                        onChange={handleChange}
                                    />

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: 2
                                        }}
                                    >
                                        <TextField
                                            label="Дом"
                                            name="house"
                                            value={formData.house}
                                            required
                                            fullWidth
                                            onChange={handleChange}
                                        />

                                        <TextField
                                            label="Квартира"
                                            name="apartment"
                                            value={formData.apartment}
                                            required
                                            fullWidth
                                            onChange={handleChange}
                                        />
                                    </Box>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                    size="large"
                                    disabled={loading}
                                >
                                    {loading ? "Создаем аккаунт..." : "Зарегистрироваться"}
                                </Button>
                            </Stack>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Уже есть аккаунт?{" "}
                                <Typography
                                    component={Link}
                                    to="/"
                                    color="primary"
                                    fontWeight={700}
                                >
                                    Войти
                                </Typography>
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default RegisterPage;
