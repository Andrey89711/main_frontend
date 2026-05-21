import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Container,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import api from "../api/api";
import Navbar from "../components/Navbar";


const profileFields = [
    {
        key: "full_name",
        label: "ФИО",
        type: "text",
        helperText: "Как вас будут видеть в системе"
    },
    {
        key: "email",
        label: "Email",
        type: "email",
        helperText: "Используется для входа"
    },
    {
        key: "phone",
        label: "Телефон",
        type: "tel",
        helperText: "Контактный номер для связи"
    },
    {
        key: "street",
        label: "Улица",
        type: "text",
        helperText: "Адрес проживания"
    },
    {
        key: "house",
        label: "Дом",
        type: "text",
        helperText: "Номер дома или корпуса"
    },
    {
        key: "apartment",
        label: "Квартира",
        type: "text",
        helperText: "Номер квартиры"
    },
    {
        key: "password",
        label: "Пароль",
        type: "password",
        helperText: "Оставьте пустым, если не хотите менять пароль",
        preview: "Не отображается"
    }
];


function ProfilePage() {

    const [profile, setProfile] =
        useState({
            full_name: "",
            email: "",
            phone: "",
            street: "",
            house: "",
            apartment: "",
            password: ""
        });

    const [activeFieldKey, setActiveFieldKey] =
        useState("full_name");

    const [draftValue, setDraftValue] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const activeField = useMemo(
        () => profileFields.find((field) =>
            field.key === activeFieldKey
        ),
        [activeFieldKey]
    );

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {

        if (activeField) {
            setDraftValue(profile[activeField.key] || "");
        }

    }, [activeField, profile]);

    const getAuthHeaders = () => {

        const token =
            localStorage.getItem("token");

        return {
            Authorization: `Bearer ${token}`
        };
    };

    const loadProfile = async () => {

        setError("");

        try {

            const res =
                await api.get(
                    "/users/me",
                    {
                        headers: getAuthHeaders()
                    }
                );

            setProfile({
                ...res.data,
                password: ""
            });

        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить профиль.");
        }
    };

    const selectField = (field) => {

        setMessage("");
        setError("");
        setActiveFieldKey(field.key);
        setDraftValue(profile[field.key] || "");
    };

    const cancelEdit = () => {

        if (activeField) {
            setDraftValue(profile[activeField.key] || "");
        }
    };

    const saveActiveField = async () => {

        if (!activeField) {
            return;
        }

        setMessage("");
        setError("");
        setLoading(true);

        const nextProfile = {
            ...profile,
            [activeField.key]: draftValue
        };

        try {

            await api.put(
                "/users/me",
                nextProfile,
                {
                    headers: getAuthHeaders()
                }
            );

            setProfile({
                ...nextProfile,
                password: ""
            });

            setDraftValue(
                activeField.key === "password"
                    ? ""
                    : draftValue
            );

            setMessage(`Поле "${activeField.label}" обновлено.`);

        } catch (err) {
            console.error(err);
            setError("Не удалось сохранить изменения.");
        } finally {
            setLoading(false);
        }
    };

    const getPreviewValue = (field) => {

        if (field.preview) {
            return field.preview;
        }

        return profile[field.key] || "Не заполнено";
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
                            Личный кабинет
                        </Typography>
                        <Typography color="text.secondary">
                            Выберите поле профиля, отредактируйте его и сохраните изменения.
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

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1.3fr 0.9fr"
                            },
                            gap: 3,
                            alignItems: "start"
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr"
                                },
                                gap: 2
                            }}
                        >
                            {profileFields.map((field) => {

                                const isActive =
                                    field.key === activeFieldKey;

                                return (
                                    <Card
                                        key={field.key}
                                        sx={{
                                            borderColor: isActive
                                                ? "primary.main"
                                                : "divider"
                                        }}
                                    >
                                        <CardActionArea
                                            onClick={() =>
                                                selectField(field)
                                            }
                                        >
                                            <CardContent>
                                                <Stack spacing={1}>
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        spacing={1}
                                                    >
                                                        <Typography
                                                            variant="subtitle2"
                                                            color="text.secondary"
                                                        >
                                                            {field.label}
                                                        </Typography>

                                                        {isActive && (
                                                            <Chip
                                                                size="small"
                                                                color="primary"
                                                                label="Активно"
                                                            />
                                                        )}
                                                    </Stack>

                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            wordBreak: "break-word"
                                                        }}
                                                    >
                                                        {getPreviewValue(field)}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {field.helperText}
                                                    </Typography>
                                                </Stack>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                );
                            })}
                        </Box>

                        <Card>
                            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="h5" gutterBottom>
                                            Редактирование
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Сейчас выбрано поле: {activeField?.label}
                                        </Typography>
                                    </Box>

                                    <TextField
                                        fullWidth
                                        label={activeField?.label}
                                        type={activeField?.type || "text"}
                                        value={draftValue}
                                        helperText={activeField?.helperText}
                                        onChange={(event) =>
                                            setDraftValue(event.target.value)
                                        }
                                    />

                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={1}
                                    >
                                        <Button
                                            variant="contained"
                                            disabled={loading}
                                            onClick={saveActiveField}
                                        >
                                            {loading ? "Сохраняем..." : "Сохранить"}
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            disabled={loading}
                                            onClick={cancelEdit}
                                        >
                                            Отмена
                                        </Button>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}

export default ProfilePage;
