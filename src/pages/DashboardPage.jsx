import {
    useEffect,
    useState
} from "react";

import api from "../api/api";

import Navbar
from "../components/Navbar";

import {
    Link
} from "react-router-dom";

import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Chip,
    Box
} from "@mui/material";


function DashboardPage() {

    const [tickets, setTickets] =
        useState([]);

    useEffect(() => {

        fetchTickets();

    }, []);


    const fetchTickets = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const response =
                await api.get(
                    "/tickets/",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setTickets(
                response.data
            );

        } catch (error) {

            console.error(error);

            alert(
                "Failed to load tickets"
            );
        }
    };


    const getStatusColor = (
        status
    ) => {

        switch (status) {

            case "new":
                return "error";

            case "in_progress":
                return "warning";

            case "completed":
                return "success";

            default:
                return "default";
        }
    };
	
	const getStatusText = (status) => {

		switch (status) {

			case "new":
				return "Новая";

			case "in_progress":
				return "В работе";

			case "completed":
				return "Завершена";

			default:
				return status;
		}
	};


    const newCount = tickets.filter(
        t => t.status === "new"
    ).length;

    const progressCount =
        tickets.filter(
            t =>
                t.status ===
                "in_progress"
        ).length;

    const completedCount =
        tickets.filter(
            t =>
                t.status ===
                "completed"
        ).length;


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
                    Мои заявки
                </Typography>

                <Link to="/create-ticket">

                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            borderRadius: 3,
                            mb: 3
                        }}
                    >
                        Создать заявку
                    </Button>

                </Link>

                <Grid
                    container
                    spacing={3}
                    sx={{ mb: 4 }}
                >

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: 3
                            }}
                        >

                            <CardContent>

                                <Typography
                                    color="text.secondary"
                                >
                                    Новые
                                </Typography>

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                >
                                    {newCount}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: 3
                            }}
                        >

                            <CardContent>

                                <Typography
                                    color="text.secondary"
                                >
                                    В работе
                                </Typography>

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                >
                                    {progressCount}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: 3
                            }}
                        >

                            <CardContent>

                                <Typography
                                    color="text.secondary"
                                >
                                    Завершённые
                                </Typography>

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                >
                                    {completedCount}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

                {tickets.map((ticket) => (

                    <Card
                        key={ticket.id}
                        sx={{
                            mb: 3,
                            borderRadius: 4,
                            boxShadow: 2
                        }}
                    >

                        <CardContent>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                gutterBottom
                            >
                                Заявка №{ticket.id}
                            </Typography>

                            <Typography
                                sx={{
                                    mb: 2
                                }}
                            >
                                {ticket.description}
                            </Typography>
							
							<Typography
								sx={{ mb: 2 }}
							>
								Адрес:
								{" "}
								{ticket.address?.street}
								,
								д.
								{" "}
								{ticket.address?.house}
								,
								кв.
								{" "}
								{ticket.address?.apartment}
							</Typography>

                            <Chip
                                label={
                                    getStatusText(ticket.status)
                                }
                                color={
                                    getStatusColor(
                                        ticket.status
                                    )
                                }
                                sx={{
                                    mr: 2
                                }}
                            />

                            <Chip
                                label={
                                    `Приоритет: ${ticket.priority}`
                                }
                                variant="outlined"
                            />

                            <br />
                            <br />

                            <Link
                                to={`/tickets/${ticket.id}`}
                            >

                                <Button
                                    variant="outlined"
                                >
                                    Открыть
                                </Button>

                            </Link>

                        </CardContent>

                    </Card>
                ))}

            </Box>

        </Box>
    );
}

export default DashboardPage;