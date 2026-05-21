import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";

import { Link } from "react-router-dom";


function LoginPage() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
	
	const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append("username", email);

            formData.append("password", password);

            const response = await api.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            navigate("/dashboard");

        } catch (error) {

            alert("Ошибка входа");
        }
    };

    return (

        <div style={{ padding: "40px" }}>

            <h1>ТСЖ Вход</h1>

            <form onSubmit={handleLogin}>

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />
                </div>

                <br />

                <button type="submit">
                    Вход
                </button>
				
				<br />
				<br />

				<Link to="/register">
					Регистрация
				</Link>

            </form>

        </div>
    );
}

export default LoginPage;