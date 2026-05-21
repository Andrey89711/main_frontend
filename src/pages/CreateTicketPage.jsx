import {
    useState
} from "react";

import api from "../api/api";

import Navbar
from "../components/Navbar";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button
} from "@mui/material";


function CreateTicketPage() {

    const [description, setDescription] =
        useState("");


    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            await api.post(
                "/tickets/",
                {
                    description:
                        description,

                    category_id: 1
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Заявка создана"
            );

            setDescription("");

        } catch (error) {

            console.error(error);

            alert(
                "Ошибка создания заявки"
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

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "center",
                    pt: 6
                }}
            >

                <Card
                    sx={{
                        width: 500,
                        borderRadius: 4,
                        boxShadow: 4
                    }}
                >

                    <CardContent>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Создание заявки
                        </Typography>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Описание проблемы"
                                margin="normal"
                                value={
                                    description
                                }
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    borderRadius: 3
                                }}
                            >
                                Создать заявку
                            </Button>

                        </form>

                    </CardContent>

                </Card>

            </Box>

        </Box>
    );
}

export default CreateTicketPage;