import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import api from "../api/api";
import Navbar from "../components/Navbar";


const statusLabels = {
    new: "Новая",
    in_progress: "В работе",
    completed: "Завершена",
    closed: "Закрыта",
    archived: "Архивирована"
};


function TicketDetailsPage() {

    const { id } = useParams();

    const [ticket, setTicket] =
        useState(null);

    const [comments, setComments] =
        useState([]);

    const [text, setText] =
        useState("");

    const [error, setError] =
        useState("");

    useEffect(() => {
        fetchTicket();
        fetchComments();
    }, [id]);

    const getAuthHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`
    });

    const fetchTicket = async () => {

        try {

            const response = await api.get(
                `/tickets/${id}`,
                {
                    headers: getAuthHeaders()
                }
            );

            setTicket(response.data);

        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить заявку.");
        }
    };

    const fetchComments = async () => {

        try {

            const response = await api.get(
                `/tickets/${id}/comments`,
                {
                    headers: getAuthHeaders()
                }
            );

            setComments(response.data);

        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить комментарии.");
        }
    };

    const addComment = async () => {

        if (!text.trim()) {
            return;
        }

        try {

            await api.post(
                `/tickets/${id}/comments`,
                { text },
                {
                    headers: getAuthHeaders()
                }
            );

            setText("");
            fetchComments();

        } catch (err) {
            console.error(err);
            setError("Не удалось добавить комментарий.");
        }
    };

    return (

        <Box sx={{ minHeight: "100vh" }}>
            <Navbar />

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Заявка #{id}
                        </Typography>
                        <Typography color="text.secondary">
                            Статус, приоритет и переписка по обращению.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    {ticket && (
                        <Card>
                            <CardContent>
                                <Stack spacing={1.5}>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                                        <Chip
                                            label={statusLabels[ticket.status] || ticket.status}
                                        />
                                        <Chip
                                            label={`Приоритет: ${ticket.priority}`}
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Подписчиков: ${ticket.subscribers_count}`}
                                            color="info"
                                            variant="outlined"
                                        />
                                    </Stack>
                                    {ticket.category?.name && (
                                        <Typography variant="body2" color="text.secondary">
                                            Категория: {ticket.category.name}
                                        </Typography>
                                    )}
                                    <Typography>
                                        {ticket.description}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                            <Stack spacing={2}>
                                <Typography variant="h6">
                                    Новый комментарий
                                </Typography>

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    label="Текст комментария"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />

                                <Button
                                    variant="contained"
                                    onClick={addComment}
                                    disabled={!text.trim()}
                                >
                                    Отправить
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Stack spacing={2}>
                        <Typography variant="h5">
                            Комментарии
                        </Typography>

                        {comments.length === 0 && (
                            <Card>
                                <CardContent sx={{ py: 4, textAlign: "center" }}>
                                    <Typography color="text.secondary">
                                        Комментариев пока нет.
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {comments.map((comment) => (
                            <Card key={comment.id}>
                                <CardContent>
                                    <Typography>
                                        {comment.text}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Пользователь #{comment.user_id}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}

export default TicketDetailsPage;
