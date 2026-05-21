import {
    useEffect,
    useState
} from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";

import api from "../api/api";
import Navbar from "../components/Navbar";


function UsersPage() {

    const [users, setUsers] =
        useState([]);

    const [roles, setRoles] =
        useState([]);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        loadData();
    }, []);

    const getAuthHeaders = () => {

        const token =
            localStorage.getItem("token");

        return {
            Authorization: `Bearer ${token}`
        };
    };

    const loadData = async () => {

        setError("");

        try {

            const [usersResponse, rolesResponse] =
                await Promise.all([
                    api.get(
                        "/users/",
                        {
                            headers: getAuthHeaders()
                        }
                    ),
                    api.get(
                        "/users/roles",
                        {
                            headers: getAuthHeaders()
                        }
                    )
                ]);

            setUsers(usersResponse.data);
            setRoles(rolesResponse.data);

        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить пользователей.");
        }
    };

    const updateRole = async (
        userId,
        role
    ) => {

        setError("");
        setMessage("");

        try {

            await api.patch(
                `/users/${userId}/role`,
                {
                    role
                },
                {
                    headers: getAuthHeaders()
                }
            );

            setUsers((currentUsers) =>
                currentUsers.map((user) => {

                    if (user.id !== userId) {
                        return user;
                    }

                    const selectedRole = roles.find((item) =>
                        item.code === role
                    );

                    return {
                        ...user,
                        role,
                        role_name: selectedRole?.name || role
                    };
                })
            );

            setMessage("Роль пользователя обновлена.");

        } catch (err) {
            console.error(err);
            setError("Не удалось обновить роль пользователя.");
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
                            Пользователи
                        </Typography>
                        <Typography color="text.secondary">
                            Назначайте роли жильцам, диспетчерам, администраторам и исполнителям.
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

                    <Stack spacing={2}>
                        {users.map((user) => (
                            <Card key={user.id}>
                                <CardContent>
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={2}
                                        alignItems={{ xs: "stretch", md: "center" }}
                                        justifyContent="space-between"
                                    >
                                        <Box>
                                            <Typography variant="h6">
                                                {user.full_name}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                {user.email}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Телефон: {user.phone || "не указан"}
                                            </Typography>
                                        </Box>

                                        <FormControl
                                            sx={{
                                                minWidth: { xs: "100%", md: 260 }
                                            }}
                                        >
                                            <InputLabel>
                                                Роль
                                            </InputLabel>
                                            <Select
                                                label="Роль"
                                                value={user.role}
                                                disabled={user.is_current}
                                                onChange={(event) =>
                                                    updateRole(
                                                        user.id,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                {roles.map((role) => (
                                                    <MenuItem
                                                        key={role.code}
                                                        value={role.code}
                                                    >
                                                        {role.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
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

export default UsersPage;
