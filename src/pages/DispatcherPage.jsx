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


function DispatcherPage() {

    const [tickets, setTickets] =
        useState([]);

    const [error, setError] =
        useState("");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await api.get(
                    "/tickets/all",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

            setTickets(response.data);

        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить заявки. Проверьте права диспетчера.");
        }
    };

    const updateStatus = async (
        ticketId,
        newStatus
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            await api.patch(
                `/tickets/${ticketId}/status?new_status=${newStatus}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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
                            Обрабатывайте обращения жильцов и обновляйте статусы.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

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
                                                    ? `${ticket.address.street}, д. ${ticket.address.house}, кв. ${ticket.address.apartment}`
                                                    : "не указан"}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Приоритет: {ticket.priority}
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
