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
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";

import api from "../api/api";
import Navbar from "../components/Navbar";


function formatAddress(address) {

    return `${address.street}, д. ${address.house}, кв. ${address.apartment}`;
}


function UsersPage() {

    const [users, setUsers] =
        useState([]);

    const [roles, setRoles] =
        useState([]);

    const [pendingAddresses, setPendingAddresses] =
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

            const [
                usersResponse,
                rolesResponse,
                addressesResponse
            ] = await Promise.all([
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
                ),
                api.get(
                    "/addresses/pending",
                    {
                        headers: getAuthHeaders()
                    }
                )
            ]);

            setUsers(usersResponse.data);
            setRoles(rolesResponse.data);
            setPendingAddresses(addressesResponse.data);

        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить данные.");
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
            loadData();

        } catch (err) {
            console.error(err);
            setError("Не удалось подтвердить адрес.");
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
                            Назначайте роли и подтверждайте адреса жильцов.
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
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                sx={{ flexWrap: "wrap", rowGap: 1 }}
                                            >
                                                <Typography variant="h6">
                                                    {user.full_name}
                                                </Typography>
                                                {user.is_current && (
                                                    <Chip
                                                        size="small"
                                                        label="Вы"
                                                        color="primary"
                                                    />
                                                )}
                                            </Stack>
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
