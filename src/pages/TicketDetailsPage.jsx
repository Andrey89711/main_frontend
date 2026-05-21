import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import api from "../api/api";

import Navbar
from "../components/Navbar";

import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box
} from "@mui/material";


function TicketDetailsPage() {

    const { id } = useParams();

    const [comments, setComments] =
        useState([]);

    const [text, setText] =
        useState("");


    useEffect(() => {

        fetchComments();

    }, []);


    const fetchComments = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const response =
                await api.get(
                    `/tickets/${id}/comments`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setComments(
                response.data
            );

        } catch (error) {

            console.error(error);
        }
    };


    const addComment = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            await api.post(
                `/tickets/${id}/comments`,
                {
                    text: text
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setText("");

            fetchComments();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to add comment"
            );
        }
    };

    return (

        <Box
            sx={{
                backgroundColor:
                    "#f4f6f8",
                minHeight: "100vh"
            }}
        >

            <Navbar />

            <Box sx={{ p: 4 }}>

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                >
                    Детали заявки
                </Typography>

                <Card
                    sx={{
                        mb: 3,
                        borderRadius: 4,
                        boxShadow: 3
                    }}
                >

                    <CardContent>

                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Добавить комментарий
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={text}
                            onChange={(e) =>
                                setText(
                                    e.target.value
                                )
                            }
                            sx={{
                                backgroundColor:
                                    "white"
                            }}
                        />

                        <br />
                        <br />

                        <Button
                            variant="contained"
                            onClick={
                                addComment
                            }
                        >
                            Отправить
                        </Button>

                    </CardContent>

                </Card>

                <Typography
                    variant="h5"
                    gutterBottom
                >
                    Комментарии
                </Typography>

                {comments.map((comment) => (

                    <Card
                        key={comment.id}
                        sx={{
                            mb: 2,
                            borderRadius: 4,
                            boxShadow: 2
                        }}
                    >

                        <CardContent>

                            <Typography
                                sx={{
                                    color:
                                        "#222",
                                    fontSize:
                                        "16px"
                                }}
                            >
                                {comment.text}
                            </Typography>

                        </CardContent>

                    </Card>
                ))}

            </Box>

        </Box>
    );
}

export default TicketDetailsPage;