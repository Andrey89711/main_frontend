import {
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


function CreateTicketPage() {

    const [description, setDescription] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const getApiError = (err) => {

        const detail = err.response?.data?.detail;

        if (typeof detail === "string") {
            return detail;
        }

        return "Не удалось создать заявку.";
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {

            const token =
                localStorage.getItem("token");

            await api.post(
                "/tickets/",
                {
                    description,
                    category_id: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Заявка создана. Ее уже можно отслеживать в списке.");
            setDescription("");

        } catch (err) {
            console.error(err);
            setError(getApiError(err));
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
                                    Создание заявки
                                </Typography>
                                <Typography color="text.secondary">
                                    Опишите проблему, а адрес будет подтянут из вашего профиля.
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

                            <Stack
                                component="form"
                                spacing={2}
                                onSubmit={handleSubmit}
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={6}
                                    label="Описание проблемы"
                                    placeholder="Например: в подъезде не работает освещение..."
                                    value={description}
                                    required
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                >
                                    {loading ? "Отправляем..." : "Создать заявку"}
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default CreateTicketPage;
