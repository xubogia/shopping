import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import axios from 'axios';
import useStore from '../../date/store';
import DeleteProductDialog from '../dialog';
import { ImageCell } from '../dataGrip/cell';

const OperatorCell = (params: GridRenderCellParams<any, any, any>) => {
  const [open, setOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(false);
  // @ts-ignore
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);
  // @ts-ignore
  const getIsProductsChanged = useStore((state) => state.getIsProductsChanged);
  
  const handleEditClick = () => {
    if (!open) setOpen(true);
    
  };
  const handleOpenDeleteDialog = () => {
    if (!deleteProduct) setDeleteProduct(true);
    
  };
  const handleProductDelete = () => {
    const ids = [];
    ids.push(params.id);
    axios
      .post('/api/product/delete', { ids })
      .then((response) => {
        setIsProductsChanged(true);
        console.log(response.data.message); // 输出删除成功的消息
        console.log('column', getIsProductsChanged());
      })
      .catch((error) => {
        console.error('Error deleting products:', error);
      });
    // console.log(isProductsChanged)
  };
  
  const handleCloseEditDialog = () => {
    setOpen(false);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteProduct(false);
  };
  return (
    <div className='flex flex-row '>
      
      <span className='sm:ml-3'>
        <button
          type='button'
          onClick={handleOpenDeleteDialog}
          className='inline-flex items-center rounded-md bg-red-800 px-2 py-1 text-sm font-semibold text-white shadow-sm '
        >
          删除
        </button>
      </span>
      {deleteProduct &&
        <DeleteProductDialog open={deleteProduct} text='确定要删除该商品吗' handleClose={handleCloseDeleteDialog}
                             handleConfirm={handleProductDelete} />}
    </div>
  );
};

const StatusCell = (params: GridRenderCellParams<any, any, any>) => (
  <div className={(params.row.status as string) === '已上架' ? 'text-red-700  ' : ' '}>
    {params.row.status}
  </div>
);

const TitleCell = (params: GridRenderCellParams<any, any, any>) => (
  <div className='w-full pr-4 text-start   whitespace-normal overflow-wrap-break-word'>
    {params.row.title}
  </div>
);

const columns: GridColDef[] = [
  {
    field: 'eachDetail',
    headerName: '图片',
    flex: 1,
    renderCell: ImageCell,
  },
  {
    field: 'title',
    headerName: '名称',
    flex: 1,
    renderCell: TitleCell,
  },
  
  {
    field: 'status',
    headerName: '状态',
    flex: 1,
    renderCell: StatusCell,
  },
  
  {
    field: 'category',
    headerName: '分类',
    flex: 1,
  },
  {
    field: 'id',
    headerName: '商品编号',
    flex: 1,
  },
  {
    field: 'operator',
    flex: 1,
    headerName: '操作',
    renderCell: OperatorCell,
  },
];

export default columns;
