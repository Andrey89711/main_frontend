import {
    useEffect,
    useState
} from "react";

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
import Navbar from "../components/Navbar";


function ProfilePage() {

    const [form, setForm] =
        useState({
            full_name: "",
            email: "",
            phone: "",
            street: "",
            house: "",
            apartment: "",
            password: ""
        });

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const res =
                await api.get(
                    "/users/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

            setForm({
                ...res.data,
                password: ""
            });

        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить профиль.");
        }
    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const saveProfile = async () => {

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const token =
                localStorage.getItem("token");

            await api.put(
                "/users/me",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Профиль обновлен.");

        } catch (err) {
            console.error(err);
            setError("Не удалось сохранить профиль.");
        } finally {
            setLoading(false);
        }
    };

    return (

        <Box sx={{ minHeight: "100vh" }}>
            <Navbar />

            <Container
                maxWidth="md"
                sx={{ py: 4 }}
            >
                <Card>
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Личный кабинет
                                </Typography>
                                <Typography color="text.secondary">
                                    Контактные данные и адрес проживания.
                                </Typography>
                            </Box>

                            {message && (
                                <Alert severity="success">
                                    {message}
                                </Alert>
                            )}

                            {error && (
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            )}

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
                                    fullWidth
                                    label="ФИО"
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                />

                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />

                                <TextField
                                    fullWidth
                                    label="Телефон"
                                    name="phone"
                                    value={form.phone || ""}
                                    onChange={handleChange}
                                />

                                <TextField
                                    fullWidth
                                    label="Новый пароль"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                />

                                <TextField
                                    fullWidth
                                    label="Улица"
                                    name="street"
                                    value={form.street || ""}
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
                                        fullWidth
                                        label="Дом"
                                        name="house"
                                        value={form.house || ""}
                                        onChange={handleChange}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Квартира"
                                        name="apartment"
                                        value={form.apartment || ""}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                onClick={saveProfile}
                            >
                                {loading ? "Сохраняем..." : "Сохранить изменения"}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default ProfilePage;
