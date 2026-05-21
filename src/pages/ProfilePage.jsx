import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button
} from "@mui/material";


function ProfilePage() {

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        street: "",
        house: "",
        apartment: "",
        password: ""
    });


    useEffect(() => {
        loadProfile();
    }, []);


    const loadProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await api.get("/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setForm({
                ...res.data,
                password: ""
            });

        } catch (err) {
            console.error(err);
            alert("Ошибка загрузки профиля");
        }
    };


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    const saveProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                "/users/me",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Профиль обновлён");

        } catch (err) {
            console.error(err);
            alert("Ошибка сохранения");
        }
    };


    return (
        <Box sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>

            <Navbar />

            <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>

                <Card sx={{ width: 500, borderRadius: 4 }}>

                    <CardContent>

                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Личный кабинет
                        </Typography>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="ФИО"
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Телефон"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Улица"
                            name="street"
                            value={form.street}
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Дом"
                            name="house"
                            value={form.house}
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Квартира"
                            name="apartment"
                            value={form.apartment}
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Новый пароль"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, borderRadius: 3 }}
                            onClick={saveProfile}
                        >
                            Сохранить
                        </Button>

                    </CardContent>

                </Card>

            </Box>

        </Box>
    );
}

export default ProfilePage;