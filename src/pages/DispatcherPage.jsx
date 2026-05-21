import { useEffect, useState } from "react";

import api from "../api/api";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";


function DispatcherPage() {

    const [tickets, setTickets] = useState([]);

    useEffect(() => {

        fetchTickets();

    }, []);
	
	const navigate = useNavigate();
	
	const handleLogout = () => {

		localStorage.removeItem(
			"token"
		);

		navigate("/");
	};


    const fetchTickets = async () => {

        try {

            const token = localStorage.getItem(
                "token"
            );

            const response = await api.get(
                "/tickets/all",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setTickets(response.data);

        } catch (error) {

            console.error(error);

            alert(
                "Failed to load tickets"
            );
        }
    };


    const updateStatus = async (
        ticketId,
        newStatus
    ) => {

        try {

            const token = localStorage.getItem(
                "token"
            );

            await api.patch(
                `/tickets/${ticketId}/status?new_status=${newStatus}`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            fetchTickets();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to update status"
            );
        }
    };

    return (

        <div style={{ padding: "40px" }}>
		
			<Navbar />

            <h1>
                Панель диспетчера
            </h1>
			
			<button onClick={handleLogout}>
				Выход
			</button>

			<br />
			<br />

            {tickets.map((ticket) => (

                <div
                    key={ticket.id}
                    style={{
                        border: "1px solid gray",
                        padding: "15px",
                        marginBottom: "10px"
                    }}
                >

                    <h3>
                        Заявка #{ticket.id}
                    </h3>

                    <p>
                        {ticket.description}
                    </p>

                    <p>
                        Статус:
                        {" "}
                        {ticket.status}
                    </p>

                    <p>
                        Приоритет:
                        {" "}
                        {ticket.priority}
                    </p>

                    <button
                        onClick={() =>
                            updateStatus(
                                ticket.id,
                                "in_progress"
                            )
                        }
                    >
                        В работу
                    </button>

                    {" "}

                    <button
                        onClick={() =>
                            updateStatus(
                                ticket.id,
                                "completed"
                            )
                        }
                    >
                        Завершить
                    </button>

                </div>
            ))}

        </div>
    );
}

export default DispatcherPage;