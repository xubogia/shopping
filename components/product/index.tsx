import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import AddProductDialog from '../dialog/product/addProductDialog';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import columns from './columns';
import useStore from '../../date/store';
interface EachDetail {
  image: string;
  imageDetail: string;
  size: string[];
}
interface Product {
  eachDetail: EachDetail[];
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
  detail: string[];
}

interface Pros {
  searchText: string;
}

const Index: FC<Pros> = ({ searchText }) => {

  const [data, setData] = useState<Product[]>([]);
  const [row, setRow] = useState<Product[]>([]);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [categoryArr, setCategoryArr] = useState<string[]>([]);
  const isProductsChanged = useStore((state) => state.getIsProductsChanged());
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);


  const [deleteProduct, setDeleteProduct] = useState(false);

  const fetchData = async () => {
    let products;
    let categorys;
    try {
      let response = await axios.get('/api/product');
      products = response.data;
      // response = await axios.get('/api/product/category/get');
      // categorys = response.data;
      // setCategoryArr(categorys);
      setData(products);
      setRow(products);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData().then();
  }, []);

  const handleStateChange = (newState: '全部商品' | '已上架' | '未上架') => {
    setState(newState);
  };

  const handleOpenAddProductDialog = () => {
    if (!addProductDialog) {
      setAddProductDialog(true);
    }
  };
  const handleCloseAddProductDialog = () => {
    setAddProductDialog(false);
  };


  useEffect(() => {
    console.log('index', isProductsChanged);
    if (isProductsChanged) {
      sessionStorage.removeItem('productData');
      sessionStorage.removeItem('categoryData');
      fetchData().then();
      setIsProductsChanged(false);
    }
  }, [isProductsChanged, setIsProductsChanged]);


  const handleIsProductAdd = () => {
    setIsProductsChanged(true);
  };
  


  return (
    <div className="w-full  flex-grow flex flex-col  px-8 py-4 ">
      <div className="flex   items-center  justify-center ">
        <div className=" flex  items-center  ">
          <div className="flex-grow text-center ">
            <button
                className="bg-red-800 text-white py-2 px-20 rounded-md"
                type="button"
                onClick={handleOpenAddProductDialog}
            >
              添加商品
            </button>
            {addProductDialog && (
                <AddProductDialog
                    open={addProductDialog}
                    handleClose={handleCloseAddProductDialog}
                    isProductAdd={handleIsProductAdd}
                    categoryArr={categoryArr}
                />
            )}
          </div>
        </div>

      </div>
      <div className='grow border my-10 h-96  '>
        <DataGrid
            rows={row}
            columns={columns}
            // key={(product: Product) => product.id.toString()}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            getRowHeight={() => 80} // 设置行高度的函数
            pageSizeOptions={[5, 10]}
            checkboxSelection
            // onRowSelectionModelChange={(newRowSelectionModel) => {
            //   setRowSelectionModel(newRowSelectionModel);
            // }}
            // rowSelectionModel={rowSelectionModel}
            disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default Index;
