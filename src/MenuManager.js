import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Form, Input, Button, Table, Space, Modal, Switch } from 'antd';
import { DingtalkCircleFilled  } from '@ant-design/icons';


const { TabPane } = Tabs;
const { confirm } = Modal;

const MenuManager = () => {
  const [editTableVisible, setEditTableVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [editTableForm] = Form.useForm();

  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    image: null,
  });
  const [tables, setTables] = useState([]);
  const [tableForm] = Form.useForm();

  useEffect(() => {
    fetchMenuItems();
    fetchTables();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/menuItems');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: name === 'image' ? files[0] : value,
    }));
  };

  const handleAddItem = async () => {
    try {
      // Convert image to base64
      const imageFile = newItem.image;
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        const newItemWithImage = { ...newItem, image: base64Image };

        // Send the modified newItem to the server
        axios.post('http://localhost:8080/api/menuItems', newItemWithImage)
          .then(() => {
            fetchMenuItems();
            setNewItem({
              name: '',
              description: '',
              price: 0,
              image: null,
            });
          })
          .catch((error) => {
            console.error('Error adding new item:', error);
          });
      };

      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error('Error adding new item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/menuItems/${itemId}`);
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAddTable = async (values) => {
    try {
      const response = await axios.post('http://localhost:8080/api/tables', values);
      // Table added successfully, fetch updated tables
      fetchTables();
      tableForm.resetFields();
    } catch (error) {
        // Display the error message as a warning
        Modal.warning({
          title: 'Warning',
          content: "Table already exists",
        });
    }
  };
  
  
  
  const handleDeleteTable = (tableId) => {
    confirm({
      title: 'Are you sure you want to delete this table?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios.delete(`http://localhost:8080/api/tables/${tableId}`)
          .then(() => {
            fetchTables();
          })
          .catch((error) => {
            console.error('Error deleting table:', error);
          });
      },
    });
  };

  const handleEditTable = async (values) => {
    try {
      const { id } = selectedTable;
      await axios.put(`http://localhost:8080/api/tables/${id}`, values);
      fetchTables();
      setEditTableVisible(false);
    } catch (error) {
      console.error('Error editing table:', error);
    }
  };

  const handleCancelEditTable = () => {
    setEditTableVisible(false);
  };

  const showEditTableModal = (table) => {
    setSelectedTable(table);
    editTableForm.setFieldsValue(table);
    setEditTableVisible(true);
  };

  const editTableModal = (
    <Modal
      title="Edit Table"
      visible={editTableVisible}
      onCancel={handleCancelEditTable}
      footer={null}
    >
      <Form form={editTableForm} onFinish={handleEditTable}>
        <Form.Item label="Table ID" name="id" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="Capacity" name="capacity" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Occupied" name="occupied" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Save Changes</Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const columns = [
    {
      title: 'Table ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Occupied',
      dataIndex: 'occupied',
      key: 'occupied',
      render: (occupied) => (occupied ? 'Yes' : 'No'),
      filters: [
        { text: 'Occupied', value: true },
        { text: 'Not Occupied', value: false },
      ],
      onFilter: (value, record) => record.occupied === value,
    },
    {
      title: 'Ordered Items',
      dataIndex: 'orderedMenuItems',
      key: 'orderedMenuItems',
      render: (orderedMenuItems) => (
        orderedMenuItems && orderedMenuItems.length > 0 ? orderedMenuItems.join(', ') :
        <span>
           <DingtalkCircleFilled style={{ color: 'red' }} /> No items ordered
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => showEditTableModal(record)}>Edit</a>
          <a onClick={() => handleDeleteTable(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];
  return (
    <div className="menu-manager-page">
      <Tabs defaultActiveKey="1" tabPosition='left'>
        <TabPane tab="Menu Items" key="1">
          <div className="add-item-form">
            <h3>Add New Item</h3>
            <Form onFinish={handleAddItem}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input name="name" value={newItem.name} onChange={handleInputChange} />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                <Input.TextArea name="description" value={newItem.description} onChange={handleInputChange} />
              </Form.Item>
              <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                <Input type="number" name="price" value={newItem.price} onChange={handleInputChange} />
              </Form.Item>
              <Form.Item label="Image" name="image" rules={[{ required: true }]}>
                <Input type="file" name="image" accept="image/*" onChange={handleInputChange} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Add Item</Button>
              </Form.Item>
            </Form>
          </div>

          <div className="menu-items-list">
            <h3>Menu Items</h3>
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <div>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <p>${item.price}</p>
                    <Button onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabPane>

        <TabPane tab="Tables" key="2">
          <div className="add-table-form">
            <h3>Add New Table</h3>
            <Form form={tableForm} onFinish={handleAddTable}>
              <Form.Item label="Table ID" name="id" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Capacity" name="capacity" rules={[{ required: true }]}>
                <Input type="number" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Add Table</Button>
              </Form.Item>
            </Form>
          </div>

          <div className="tables-list">
            <h3>Tables</h3>
            <Table dataSource={tables} columns={columns} />
          </div>
        </TabPane>
      </Tabs>

      {editTableModal}
    </div>
  );
};

export default MenuManager;