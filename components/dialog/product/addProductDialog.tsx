import React, { useState, FC,  useCallback } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import * as yup from 'yup';
import { debounce } from 'lodash';
import UploadImage from './uploadImage';
import { NewProduct } from '../../../interface';


interface ValidationErrors {
  [key: string]: string;
}

interface Props {
  open: boolean;
  handleClose: () => void;
  isProductAdd: () => void;
  categoryArr: string[];
}

const FormDialog: FC<Props> = ({ open, handleClose, isProductAdd, categoryArr }) => {
  const initialProductData: NewProduct = {
    id: 0,
    eachDetail: [],
    title: '',
    category: '',
    status: '已上架',
    detail: [],
    newImage: [],
    newDetailImage:[]
  };
  
  const [productData, setProductData] = useState<NewProduct>(initialProductData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [newCategory, setNewCategory] = useState('');
  const [categoryArrTemp, setCategoryArrTemp] = useState<string[]>(categoryArr);
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [loading,setLoading]=useState(false);

  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = (name: string, value: any) => {
    // setValidationErrors([]); // 清空之前的错误信息
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const addNewCategory = () => {
    const newCategoryArrTemp = [...categoryArrTemp, newCategory];
    setCategoryArrTemp(newCategoryArrTemp);
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSaveProduct = useCallback(
    debounce(async () => {
      const schema = yup.object().shape({
        title: yup.string().required('商品名称是必填项'),
        category: yup.string().required('分类是必填项'),
        status: yup.string().required('状态是必填项'),
        detail: yup
          .array()
          .test('fileRequired', '商品详情是必填项', (value) => value && value.length > 0),
        eachDetail: yup
          .array()
          .min(1)
          .of(
            yup.object().shape({
              imageDetail: yup.string().required('颜色是必填项'),
              size: yup
                .array()
                .of(yup.string().test('no-empty-string', '尺寸必须填写', (value) => {
                  if (value === '') {
                    return false; // 验证失败，数组中包含了空字符串
                  }
                  return true; // 验证通过，数组中不包含空字符串
                })),
              amount: yup
                .array()
                .of(yup.string().test('no-empty-string', '价格', (value) => {
                  if (value === '') {
                    return false; // 验证失败，数组中包含了空字符串
                  }
                  return true; // 验证通过，数组中不包含空字符串
                })),
              
            }),
          )
          .required('至少需要一个配色'),
      });
      
      try {
        await schema.validate(productData, { abortEarly: false });
        console.log('有效的数据:', productData);
        
        const formData = new FormData();
        formData.append('title', productData.title);
        formData.append('category', productData.category);
        formData.append('status', productData.status);
        // @ts-ignore
        
        const eachDetailJSON = JSON.stringify(productData.eachDetail);
        formData.append('eachDetail', eachDetailJSON);
        productData.newImage.forEach((file, index) => {
          formData.append(`$file${index}`, file);
        });
        
        productData.detail.forEach((file, index) => {
          formData.append(`$detail${index}`, file);
        });
        
        setLoading(true);
        const response = await axios.post('/api/product/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setLoading(false);
        
        if (!categoryArr.includes(productData.category)) {
          console.log('new category');
          const addCategoryResult = await axios.post('api/product/category/add', {
            newCategory: productData.category,
          });
          console.log(addCategoryResult);
        }
        console.log(response.data);
        isProductAdd();
        handleClose();
      } catch (error) {
        console.log(error);
        const errors: Record<string, string> = {};
        (error as yup.ValidationError).inner.forEach((err) => {
          errors[err.path as string] = err.message;
        });
        console.log(errors);
        setValidationErrors(errors);
      }
    }, 300),
    [productData],
  );
  
  const handleImageUpload = (event: any) => {
    const { files } = event.target;
    // const uploadedImageFiles = [...imageFiles, ...files];
    // setImageFiles(uploadedImageFiles);
    const detailImageFilesTemp = [...productData.detail, ...files];
    handleChange('detail', detailImageFilesTemp);
    const uploadImage = (file: File) => {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const detailImageTemps = [...detailImages];
          detailImageTemps.push(reader.result);
          setDetailImages(detailImageTemps);
        }
      };
      
      if (file) {
        reader.readAsDataURL(file);
      }
    };
    
    for (let i = 0; i < files.length; i++) {
      uploadImage(files[i]);
    }
  };
  
  const handleRemoveDetailImage = (index: number) => {
    const detailImageTemps = [...detailImages];
    detailImageTemps.splice(index, 1);
    setDetailImages(detailImageTemps);
    const productDataTemp = productData.detail;
    productDataTemp.splice(index, 1);
    handleChange('detail', productDataTemp);
  };
  
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>添加商品</DialogTitle>
        <DialogContent>
          <UploadImage
            value={productData}
            onChange={handleChange}
            validationError={validationErrors}
          />
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='商品名称'
            type='text'
            name='title'
            required
            value={productData.title}
            onChange={(event) => handleChange(event.target.name, event.target.value)}
            fullWidth
            error={Boolean(validationErrors.title)}
          />
          
          <FormControl fullWidth margin='dense'>
            <InputLabel htmlFor='status'>分类</InputLabel>
            <Select
              label='状态'
              id='status'
              name='category'
              value={productData.category}
              required
              error={Boolean(validationErrors.category)}
              onChange={(event) => handleChange(event.target.name, event.target.value)}
            >
              {categoryArrTemp.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
              <div className='mt-4'/>
              <div className='flex flex-row mx-2 space-x-2 py-2 '>
                <button type='button' className='border border-black rounded-lg  p-1 w-8 h-8' onClick={addNewCategory}>
                  +
                </button>
                <input
                  placeholder='其他'
                  className='border-black px-2'
                  onChange={(event) => setNewCategory(event.target.value)}
                />
              </div>
            </Select>
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <InputLabel htmlFor='status'>状态</InputLabel>
            <Select
              label='状态'
              id='status'
              name='status'
              required
              value={productData.status}
              onChange={(event) => handleChange(event.target.name, event.target.value)}
            >
              <MenuItem value='已上架'>已上架</MenuItem>
              <MenuItem value='未上架'>未上架</MenuItem>
            </Select>
          </FormControl>
          <label htmlFor='detailImage-upload'>
            <Button
              variant='contained'
              component='span'
              className='mt-4 w-40 my-4 h-10  border bg-red-700 rounded-lg text-white  text-sm text-center'
            >
              选择商品详情图片
            </Button>
            <input
              accept='image/*'
              className='hidden'
              id='detailImage-upload'
              type='file'
              multiple
              onChange={handleImageUpload}
            />
          </label>
          {detailImages.map((detailImage, index) => (
            <div className='flex flex-row space-x-2'>
              <Image src={detailImage} alt='Uploaded' width={500} height={500} />
              <button type='button' onClick={() => handleRemoveDetailImage(index)}>
                X
              </button>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          {loading?<div className='text-gray-500 text-sm border border-blue-200 p-2 '>添加中</div>:<Button onClick={handleSaveProduct}>确认</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(FormDialog);
