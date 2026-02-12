import { useEffect, useState, useRef } from "react";
import './Modal.css'
import {
  Form,
  Input,
  Popconfirm,
  Table,
  Checkbox,
  Button,
  Radio,
  DatePicker,
} from "antd";
import dayjs from "dayjs";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode;

  if (inputType === "checkbox") {
    inputNode = <Checkbox />;
  } else if (inputType === "date") {
    inputNode = (
      <DatePicker
        showTime
        style={{ width: "100%" }}
        value={record[dataIndex] ? dayjs(record[dataIndex]) : null}
      />
    );
  } else {
    inputNode = <Input />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          valuePropName={inputType === "checkbox" ? "checked" : "value"}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Modal = ({
  taskData,
  rowSelection,
  radioOptions,
  changeState,
  onRadioOptionChange,
  handleDelete,
  handleEdit,
  handleCreate,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(taskData);
  const [searchText, setSearchText] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const searchInput = useRef({});
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.uuid === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      task: record.task || "",
      done: record.done || false,
      deadline: record.deadline ? dayjs(record.deadline) : null,
    });
    setEditingKey(record.uuid);
    console.log(editingKey);
    console.log(record.uuid);
  };
  useEffect(() => {
    setData(taskData);
  }, [taskData]);

  const handleAdd = () => {
    let uuid = crypto.randomUUID();
    setData((prev) => [
      {
        uuid: uuid,
        task: "",
        isNew: true,
        done: false,
        deadline: "",
      },
      ...prev,
    ]);
    setEditingKey(uuid);
    setIsCreating(true);

    console.log(data);
  };

  const cancel = () => {
    if (isCreating) {
      setData((prev) => prev.filter((item) => item.uuid !== editingKey));
    }
    setEditingKey("");
    setIsCreating(false);
    form.resetFields();
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      console.log(row);
      row.uuid = editingKey;
      row.deadline = row.deadline.toISOString();
      console.log(row);
      if (row.uuid === "") {
        handleCreate(row);
      } else {
        handleEdit(row);
      }
      setEditingKey("");
      setIsCreating(false);
      form.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const renderTitleWithSearch = (title, dataIndex) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div>{title}</div>
      <Input
        className="input"
        placeholder={`Wyszukaj`}
        size="small"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        ref={(el) => (searchInput.current[dataIndex] = el)}
        style={{ marginTop: 0, width: 120 }}
        onPressEnter={(e) => {
          e.preventDefault();
          setSearchText((prev) => ({
            ...prev,
            [dataIndex]: e.target.value,
          }));
        }}
      />
    </div>
  );

  const getFilteredData = (data) => {
    return data.filter((record) => {
      return Object.keys(searchText).every((column) => {
        const value = searchText[column];
        if (!value) return true;
        return record[column]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    });
  };
  const columns = [
    {
      title: "operation",
      dataIndex: "operation",
      width: "10%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.key)}
              style={{ marginInlineEnd: 8 }}
            >
              Save
            </Button>
            <Button onClick={cancel}>Cancel</Button>
          </span>
        ) : (
          <Button disabled={editingKey !== ""} onClick={() => edit(record)}>
            Edit
          </Button>
        );
      },
    },
    {
      title: renderTitleWithSearch("Zadanie", "task"),
      dataIndex: "task",
      key: "task",
      editable: true,
      render: (_, record) => (
        <p
          style={{
            color: `${record.done ? "#28a745" : new Date(record.deadline) < new Date() ? "#dc3545" : ""}`,
          }}
        >
          {record.task}
        </p>
      ),
      sorter: (a, b) => a.task.localeCompare(b.task),
    },
    {
      title: renderTitleWithSearch("Wykonane", "done"),
      dataIndex: "done",
      key: "done",
      inputType: "checkbox",
      editable: true,
      sorter: (a, b) => a.done - b.done,
      render: (_, record) => (
        <Checkbox
          checked={record.done}
          onClick={() => {
            changeState(record);
          }}
        ></Checkbox>
      ),
    },
    {
      title: renderTitleWithSearch("Termin", "deadline"),
      dataIndex: "deadline",
      key: "deadline",
      inputType: "date",
      editable: true,
      sorter: (a, b) => a.task.localeCompare(b.task),
      render: (_, record) => (
        <p
          style={{
            color: `${record.done ? "#28a745" : new Date(record.deadline) < new Date() ? "#dc3545" : ""}`,
          }}
        >
          {dayjs(record.deadline).format("DD-MM-YYYY HH:mm")}
        </p>
      ),
    },
  ];

  const confirm = (e) => {
    handleDelete();
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType || "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div className="tableWrapper">
      <Form className="tableWrapper" form={form} component={false}>
        <Table
          bordered
          components={{
            body: { cell: EditableCell },
          }}
          dataSource={getFilteredData(data)}
          columns={mergedColumns}
          rowClassName="editable-row"
          className="taskTable"
          rowKey="uuid"
          rowSelection={{ type: "checkbox", ...rowSelection }}
          title={() => (
            <div className="title">
              <Radio.Group
                block
                options={radioOptions}
                onChange={(e) => onRadioOptionChange(e.target.value)}
                defaultValue="all"
                optionType="button"
              />
              <div className="buttons">
                <Button onClick={() => handleAdd()}>Dodaj</Button>
                <Popconfirm
                  title="Usuń Zadania"
                  description="Na pewno?"
                  onConfirm={confirm}
                  okText="Tak"
                  cancelText="Nie"
                >
                  <Button>Usuń</Button>
                </Popconfirm>
              </div>
            </div>
          )}
          styles={{ float: "bottom" }}
          pagination={{ placement: "topEnd" }}
          size="middle"
          tableLayout="fixed"
        />
      </Form>
    </div>
  );
};
export default Modal;
