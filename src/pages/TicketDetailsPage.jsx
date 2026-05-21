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
    Container,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import api from "../api/api";
import Navbar from "../components/Navbar";


function TicketDetailsPage() {

    const { id } = useParams();

    const [comments, setComments] =
        useState([]);

    const [text, setText] =
        useState("");

    const [error, setError] =
        useState("");

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await api.get(
                    `/tickets/${id}/comments`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
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

            const token =
                localStorage.getItem("token");

            await api.post(
                `/tickets/${id}/comments`,
                {
                    text
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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

            <Container
                maxWidth="md"
                sx={{ py: 4 }}
            >
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Заявка #{id}
                        </Typography>
                        <Typography color="text.secondary">
                            Комментарии и переписка по обращению.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
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
                                    onChange={(e) =>
                                        setText(e.target.value)
                                    }
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
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
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
