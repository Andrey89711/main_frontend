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
    Chip,
    Container,
    Stack,
    Typography
} from "@mui/material";

import api from "../api/api";
import Navbar from "../components/Navbar";


const statusLabels = {
    new: "Новая",
    in_progress: "В работе",
    completed: "Завершена"
};

const statusColors = {
    new: "error",
    in_progress: "warning",
    completed: "success"
};


function formatAddress(address) {

    return `${address.street}, д. ${address.house}, кв. ${address.apartment}`;
}


function DispatcherPage() {

    const [tickets, setTickets] =
        useState([]);

    const [pendingAddresses, setPendingAddresses] =
        useState([]);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        fetchTickets();
        fetchPendingAddresses();
    }, []);

    const getAuthHeaders = () => {

        const token =
            localStorage.getItem("token");

        return {
            Authorization: `Bearer ${token}`
        };
    };

    const fetchTickets = async () => {

        try {

            const response =
                await api.get(
                    "/tickets/all",
                    {
                        headers: getAuthHeaders()
                    }
                );

            setTickets(response.data);

        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить заявки. Проверьте права диспетчера.");
        }
    };

    const fetchPendingAddresses = async () => {

        try {

            const response =
                await api.get(
                    "/addresses/pending",
                    {
                        headers: getAuthHeaders()
                    }
                );

            setPendingAddresses(response.data);

        } catch (err) {
            console.error(err);
        }
    };

    const verifyAddress = async (addressLinkId) => {

        setError("");
        setMessage("");

        try {

            await api.patch(
                `/addresses/${addressLinkId}/verify`,
                {},
                {
                    headers: getAuthHeaders()
                }
            );

            setMessage("Адрес подтвержден.");
            fetchPendingAddresses();

        } catch (err) {
            console.error(err);
            setError("Не удалось подтвердить адрес.");
        }
    };

    const updateStatus = async (
        ticketId,
        newStatus
    ) => {

        try {

            await api.patch(
                `/tickets/${ticketId}/status?new_status=${newStatus}`,
                {},
                {
                    headers: getAuthHeaders()
                }
            );

            fetchTickets();

        } catch (err) {
            console.error(err);
            setError("Не удалось обновить статус заявки.");
        }
    };

    return (

        <Box sx={{ minHeight: "100vh" }}>
            <Navbar />

            <Container
                maxWidth="lg"
                sx={{ py: 4 }}
            >
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Панель диспетчера
                        </Typography>
                        <Typography color="text.secondary">
                            Обрабатывайте заявки и подтверждайте адреса жильцов.
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

                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="h5">
                                    Адреса на подтверждение
                                </Typography>

                                {pendingAddresses.length === 0 && (
                                    <Typography color="text.secondary">
                                        Неподтвержденных адресов нет.
                                    </Typography>
                                )}

                                {pendingAddresses.map((address) => (
                                    <Card key={address.id}>
                                        <CardContent>
                                            <Stack
                                                direction={{ xs: "column", md: "row" }}
                                                spacing={2}
                                                justifyContent="space-between"
                                            >
                                                <Box>
                                                    <Typography variant="h6">
                                                        {formatAddress(address)}
                                                    </Typography>
                                                    <Typography color="text.secondary">
                                                        Лицевой счет: {address.personal_account}
                                                    </Typography>
                                                    <Typography color="text.secondary">
                                                        Пользователь: {address.user?.full_name} ({address.user?.email})
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    variant="contained"
                                                    onClick={() =>
                                                        verifyAddress(address.id)
                                                    }
                                                >
                                                    Подтвердить
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>

                    <Stack spacing={2}>
                        {tickets.length === 0 && !error && (
                            <Card>
                                <CardContent sx={{ py: 5, textAlign: "center" }}>
                                    <Typography variant="h6" gutterBottom>
                                        Активных заявок нет
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Новые обращения появятся в этом списке.
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {tickets.map((ticket) => (
                            <Card key={ticket.id}>
                                <CardContent>
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={2}
                                        justifyContent="space-between"
                                    >
                                        <Stack spacing={1.5}>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                sx={{ flexWrap: "wrap", rowGap: 1 }}
                                            >
                                                <Typography variant="h6">
                                                    Заявка #{ticket.id}
                                                </Typography>
                                                <Chip
                                                    label={statusLabels[ticket.status] || ticket.status}
                                                    color={statusColors[ticket.status] || "default"}
                                                />
                                            </Stack>

                                            <Typography color="text.secondary">
                                                {ticket.description}
                                            </Typography>

                                            <Typography variant="body2">
                                                Адрес:{" "}
                                                {ticket.address
                                                    ? formatAddress(ticket.address)
                                                    : "не указан"}
                                            </Typography>
                                        </Stack>

                                        <Stack
                                            direction={{ xs: "column", sm: "row" }}
                                            spacing={1}
                                            alignItems={{ xs: "stretch", sm: "center" }}
                                        >
                                            <Button
                                                variant="outlined"
                                                disabled={ticket.status === "in_progress"}
                                                onClick={() =>
                                                    updateStatus(
                                                        ticket.id,
                                                        "in_progress"
                                                    )
                                                }
                                            >
                                                В работу
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="success"
                                                disabled={ticket.status === "completed"}
                                                onClick={() =>
                                                    updateStatus(
                                                        ticket.id,
                                                        "completed"
                                                    )
                                                }
                                            >
                                                Завершить
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}

export default DispatcherPage;
