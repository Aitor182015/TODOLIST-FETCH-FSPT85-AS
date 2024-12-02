import React, { useState, useEffect } from "react";

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [toDolist, setToDoList] = useState([]);

    // ******** FUNCION PARA CREAR USUARIO *************
    async function createUser() {
        try {
            let response = await fetch("https://playground.4geeks.com/todo/users/aitorsantos", {
                method: "POST",
            });

            if (response.status === 400) {
                console.log("Usuario ya existe, no es necesario crearlo nuevamente.");
                return false;
            }
            if (!response.ok) {
                console.log(`Error al crear el usuario: ${response.status}`);
                return false;
            }
            let data = await response.json();
            console.log("Usuario creado exitosamente:", data);
            return true;
        } catch (error) {
            console.log("Error de red o servidor:", error);
            return false;
        }
    }

    // ************* FUNCION PARA CREAR ITEMS ******************
    async function createItem(label) {
        try {
            let response = await fetch("https://playground.4geeks.com/todo/todos/aitorsantos", {
                method: "POST",
                body: JSON.stringify({
                    label: label,
                    is_done: false,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                console.log(response.status);
                return;
            }
            let data = await response.json();
            console.log(data);
            console.log(`Tarea ${label} añadida a la lista.`);
        } catch (error) {
            console.log(error);
        }
    }

    // ************** FUNCION PARA RECIBIR DATOS DE LA BD **************
    async function getItems() {
        try {
            let response = await fetch("https://playground.4geeks.com/todo/users/aitorsantos", {
                method: "GET",
            });
            if (!response.ok) {
                console.log(response.status);
                return;
            }
            let data = await response.json();
            console.log(data.todos);
            setToDoList(data.todos);
        } catch (error) {
            console.log(error);
        }
    }

    //****************FUNCION PARA BORRAR ITEMS DE LA BD *************/
    async function deleteItem(todoId) {
        try {
            let response = await fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                console.log(response.status);
                return;
            }
            console.log(`Tarea con la ID ${todoId} eliminada`);
        } catch (error) {
            console.log(error);
        }
    }

    // *********** LLAMAMOS A CREAR USUARIO Y OBTENER TAREAS AL INICIO *****************
    useEffect(() => {
        const initialize = async () => {
            await createUser(); // No muestra error si el usuario ya existe
            await getItems();
        };
        initialize();
    }, []);

    // **************** LOGICA ****************
    return (
        <div className="container">
            <h1>To Do list</h1>
            <ul>
                <li>
                    <input
                        type="text"
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={async (e) => {
                            if (e.key === "Enter" && inputValue.trim() !== "") {
                                await createItem(inputValue); // Agrega la tarea a la lista
                                await getItems(); // Actualiza la lista para incluir el ID generado.
                                setInputValue(""); // Borra el input
                            }
                        }}
                        value={inputValue}
                        placeholder="¿Qué tienes que hacer?"
                    />
                </li>

                {toDolist.length > 0
                    ? toDolist.map((item) => (
                        <li className="todo-item-list" key={item.id}>
                            {item.label}{" "}
                            <span
                                className="fa-solid fa-xmark"
                                onClick={async () => {
                                    await deleteItem(item.id); // Usa el ID para eliminar.
                                    setToDoList(toDolist.filter((tarea) => tarea.id !== item.id)); // Filtra por ID.
                                }}
                            ></span>
                        </li>
                    ))
                    : null}
            </ul>
            <div className="pending" >{toDolist.length} Tareas pendientes</div>
        </div>
    );
};

export default Home;
