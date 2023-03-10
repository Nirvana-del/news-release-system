import {reqAddNewsCategory, reqDeleteNewsCategory, reqGetNewsCategories, reqUpdateNewsCategory} from '@/api/news';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {ConfigProvider, InputRef} from 'antd';
import {Button, Form, Input, Popconfirm, Table} from 'antd';
import type {FormInstance} from 'antd/es/form';
import {Category} from "@/views/news-manage/types";
import EmptyState from "@/components/antd/EmptyState";
import {store} from "@/redux";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
       title,
       editable,
       children,
       dataIndex,
       record,
       handleSave,
       ...restProps
    }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({[dataIndex]: record[dataIndex]});
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{margin: 0}}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{paddingRight: 24}} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const NewsCategory: React.FC = () => {
    const navItems = ['新闻管理','新闻分类']
    useEffect(() => {
        store.dispatch({
            type: 'CHANGE_PAGE',
            payload: navItems
        })
    }, []);
    const [dataSource, setDataSource] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    let _category = {
        id: 0,
        label: '',
        value: ''
    }
    const [currentItem, setCurrentItem] = useState<Category>(_category);
    const getCategoryList = () => {
        reqGetNewsCategories().then(res => {
            const list = res.data.categoryList
            setDataSource(list)
            setCurrentItem(list.at(-1))
            setTotalPage(Math.ceil(list.length / 5))
        })
    }
    const updateCategory = async (id:number,item:Category) => {
       await reqUpdateNewsCategory(id,item)
        getCategoryList()
    }
    const deleteCategory = async (id:number) => {
       await reqDeleteNewsCategory(id)
        getCategoryList()
    }
    useEffect(() => {
        getCategoryList()
    }, []);

    const handleDelete = (item:Category) => {
        deleteCategory(item.id!).then(res => {
            console.log(res)
        })
    };

    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            width: '20%'
        },
        {
            title: '名称',
            dataIndex: 'label',
            editable:true
        },
        {
            title: '操作',
            render: (item:Category) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(item)} okText="确定" cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                ) : null
        }
    ];
    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Category) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave
            }),
        };
    });
    const handleAdd = async () => {
        const newData: Category = {
           ...currentItem,
            id:currentItem.id! + 1
        };
        setCurrentPage(totalPage)
       await reqAddNewsCategory(newData)
        setDataSource([...dataSource,newData])
    };

    const handleSave = (row: Category) => {
        updateCategory(row.id!,row).then(res => {
            console.log(res)
        })
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    return (
        <div>
            <Button onClick={handleAdd} type="primary" style={{marginBottom: 16}}>
                新增分类
            </Button>
            <ConfigProvider renderEmpty={EmptyState}>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                pagination={{
                    current: currentPage,
                    hideOnSinglePage: true,
                    pageSize: 6,
                    onChange:(page) => {
                        setCurrentPage(page)
                    }
                }}
                columns={mergedColumns}
                rowKey="id"
            />
            </ConfigProvider>
        </div>
    );
};

export default NewsCategory;