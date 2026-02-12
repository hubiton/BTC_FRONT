import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./modal/Modal";

function App() {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState(data);
  useEffect(() => {
    updateData();
  }, []);
  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  let toDelete = [];

  const radioOptions = [
    { label: "Wszystkie", value: "all" },
    { label: "Wykonane", value: "done" },
    { label: "Oczekujące", value: "pending" },
    { label: "Przeterminowane", value: "due" },
  ];

  const updateData = () => {
    axios.post("http://localhost:8080/api/v1/task/all").then((response) => {
      setData(response.data);
    });
  };

  const changeState = async (record) => {
    await axios.patch("http://localhost:8080/api/v1/task", { ...record, done: !record.done });
    updateData();
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      toDelete = selectedRows;
    },
  };

  const handleRadioOptionChange = (value) => {
    const now = new Date();
    switch (value) {
      case "all":
        setCurrentData(data);
        break;

      case "done":
        setCurrentData(data.filter((task) => task.done === true));
        break;

      case "pending":
        setCurrentData(
          data.filter(
            (task) => task.done === false && new Date(task.deadline) > now,
          ),
        );
        break;

      case "due":
        setCurrentData(
          data.filter(
            (task) => task.done === false && new Date(task.deadline) <= now,
          ),
        );
        break;
      default:
        setCurrentData(data);
        break;
    }
  };

  const handleDelete = async () => {
    console.log(toDelete);
    await axios.delete("http://localhost:8080/api/v1/task", {
      data: toDelete,
      headers: {
        "Content-Type": "application/json",
      },
    });
    updateData();
  };

  const handleEdit = async (record) => {
    await axios.patch("http://localhost:8080/api/v1/task", record);
    updateData();
  };

  const handleCreate = async (record) => {
    await axios.post("http://localhost:8080/api/v1/task", record);
    updateData();
  };

  return (
    <div className="app">
      <Modal
        className="modal"
        taskData={currentData}
        radioOptions={radioOptions}
        rowSelection={rowSelection}
        onRadioOptionChange={handleRadioOptionChange}
        handleEdit={handleEdit}
        changeState={changeState}
        handleDelete={handleDelete}
        handleCreate={handleCreate}
      ></Modal>
    </div>
  );
}

export default App;
