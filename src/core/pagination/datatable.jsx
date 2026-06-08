/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React,{useState} from "react";
import { Table } from "antd";
import { onShowSizeChange } from "./pagination";

const Datatable = ({
  props,
  columns,
  dataSource,
  loading = false,
  enableRowSelection = true,
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
  },
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = enableRowSelection
    ? {
        selectedRowKeys,
        onChange: onSelectChange,
      }
    : undefined;

  return (
    <Table
      key={props}
      className="table datanew dataTable no-footer"
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey={(record) => record.id}
      pagination={pagination}
    />
  );
};

export default Datatable;
