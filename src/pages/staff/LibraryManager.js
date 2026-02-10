import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Popconfirm,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
  FileOutlined,
} from '@ant-design/icons';

export default function LibraryManager({ staffId, staffName }) {
  const [libraryItems, setLibraryItems] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const levels = ['Undergraduate', 'Postgraduate', 'Certificate'];
  const types = ['books', 'past-papers'];

  useEffect(() => {
    fetchLibraryItems();
    fetchFaculties();
  }, []);

  const fetchLibraryItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/library');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLibraryItems(data.items || []);
    } catch (err) {
      message.error('Failed to load library items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/faculties');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFaculties(data.faculties || []);
    } catch (err) {
      console.error('Failed to load faculties:', err);
    }
  };

  const handleAddEdit = () => {
    setEditingId(null);
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      title: record.title,
      type: record.type,
      author: record.author,
      isbn: record.isbn,
      year: record.year,
      course: record.course,
      subject: record.subject,
      faculty_id: record.faculty_id,
      level: record.level,
      description: record.description,
      status: record.status,
    });
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/library/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      message.success('Library item deleted');
      fetchLibraryItems();
    } catch (err) {
      message.error('Failed to delete library item');
      console.error(err);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('type', values.type);
      formData.append('author', values.author || '');
      formData.append('isbn', values.isbn || '');
      formData.append('year', values.year || '');
      formData.append('course', values.course || '');
      formData.append('subject', values.subject || '');
      formData.append('faculty_id', values.faculty_id || '');
      formData.append('faculty_name', values.faculty_id ? faculties.find(f => f.id == values.faculty_id)?.name : '');
      formData.append('level', values.level);
      formData.append('description', values.description || '');
      formData.append('status', values.status);

      if (fileList.length > 0) {
        formData.append('file', fileList[0].originFileObj);
      }

      const url = editingId
        ? `http://localhost:4000/api/library/${editingId}`
        : 'http://localhost:4000/api/library';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to save');
      message.success(editingId ? 'Library item updated' : 'Library item created');
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchLibraryItems();
    } catch (err) {
      message.error('Failed to save library item');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'books' ? 'blue' : 'orange'}>
          {type === 'books' ? 'Books' : 'Past Papers'}
        </Tag>
      ),
    },
    {
      title: 'Faculty',
      dataIndex: 'faculty_name',
      key: 'faculty_name',
      width: 150,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Author/Course',
      key: 'author',
      render: (_, record) => record.author || record.course || '-',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Library Item"
            description="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
          {record.file_path && (
            <a
              href={`http://localhost:4000${record.file_path}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="small" icon={<DownloadOutlined />}>
                File
              </Button>
            </a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="library-management">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Library Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddEdit}
        >
          Add Library Item
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={libraryItems}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingId ? 'Edit Library Item' : 'Add New Library Item'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={submitting}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="Book/Paper Title" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select placeholder="Select type">
              {types.map(t => (
                <Select.Option key={t} value={t}>
                  {t === 'books' ? 'Books' : 'Past Papers'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Faculty"
            name="faculty_id"
          >
            <Select placeholder="Select faculty" allowClear>
              {faculties.map(faculty => (
                <Select.Option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Level"
            name="level"
            rules={[{ required: true, message: 'Please select level' }]}
          >
            <Select placeholder="Select level">
              {levels.map(level => (
                <Select.Option key={level} value={level}>
                  {level}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Author"
            name="author"
          >
            <Input placeholder="Author name (for books)" />
          </Form.Item>

          <Form.Item
            label="ISBN"
            name="isbn"
          >
            <Input placeholder="ISBN (for books)" />
          </Form.Item>

          <Form.Item
            label="Course Code"
            name="course"
          >
            <Input placeholder="Course code (for past papers)" />
          </Form.Item>

          <Form.Item
            label="Subject"
            name="subject"
          >
            <Input placeholder="Subject/Topic" />
          </Form.Item>

          <Form.Item
            label="Year"
            name="year"
          >
            <Input type="number" placeholder="Year" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="Description or summary" />
          </Form.Item>

          <Form.Item label="Upload File (PDF/Word)">
            <Upload
              accept=".pdf,.doc,.docx"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
            >
              <Button icon={<FileOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            initialValue="active"
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
