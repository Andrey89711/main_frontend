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
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import api from "../api/api";
import Navbar from "../components/Navbar";


function formatAddress(address) {

    return `${address.street}, д. ${address.house}, кв. ${address.apartment}`;
}


function CreateTicketPage() {

    const [description, setDescription] =
        useState("");

    const [addresses, setAddresses] =
        useState([]);

    const [addressId, setAddressId] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {
        loadAddresses();
    }, []);

    const getAuthHeaders = () => {

        const token =
            localStorage.getItem("token");

        return {
            Authorization: `Bearer ${token}`
        };
    };

    const loadAddresses = async () => {

        try {

            const response =
                await api.get(
                    "/addresses/my/verified",
                    {
                        headers: getAuthHeaders()
                    }
                );

            setAddresses(response.data);

            if (response.data.length === 1) {
                setAddressId(response.data[0].address_id);
            }

        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить подтвержденные адреса.");
        }
    };

    const getApiError = (err) => {

        const detail = err.response?.data?.detail;

        if (detail === "Address is not verified or not linked to current user") {
            return "Нельзя создать заявку по неподтвержденному или чужому адресу.";
        }

        if (typeof detail === "string") {
            return detail;
        }

        return "Не удалось создать заявку.";
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setMessage("");
        setError("");

        if (!addressId) {
            setError("Выберите подтвержденный адрес.");
            return;
        }

        setLoading(true);

        try {

            await api.post(
                "/tickets/",
                {
                    description,
                    category_id: 1,
                    address_id: Number(addressId)
                },
                {
                    headers: getAuthHeaders()
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

    const hasNoVerifiedAddresses =
        addresses.length === 0;

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
                                    Выберите подтвержденный адрес и опишите проблему.
                                </Typography>
                            </Box>

                            {hasNoVerifiedAddresses && (
                                <Alert severity="warning">
                                    У вас нет подтвержденных адресов. Добавьте адрес в профиле и дождитесь подтверждения.
                                </Alert>
                            )}

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
                                {addresses.length === 1 && (
                                    <TextField
                                        label="Адрес"
                                        value={formatAddress(addresses[0])}
                                        disabled
                                        fullWidth
                                    />
                                )}

                                {addresses.length > 1 && (
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            Адрес
                                        </InputLabel>
                                        <Select
                                            label="Адрес"
                                            value={addressId}
                                            required
                                            onChange={(event) =>
                                                setAddressId(event.target.value)
                                            }
                                        >
                                            {addresses.map((address) => (
                                                <MenuItem
                                                    key={address.id}
                                                    value={address.address_id}
                                                >
                                                    {formatAddress(address)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={6}
                                    label="Описание проблемы"
                                    placeholder="Например: в подъезде не работает освещение..."
                                    value={description}
                                    required
                                    disabled={hasNoVerifiedAddresses}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading || hasNoVerifiedAddresses}
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
