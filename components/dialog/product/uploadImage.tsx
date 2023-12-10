import { FC, useState } from 'react';
import Button from '@mui/material/Button';
import Image from 'next/image';
import TextField from '@mui/material/TextField';
import ImageDialog from '../image/imageToLargerDialog';
import { EachDetail, NewProduct } from '../../../interface';


interface Props {
  value: NewProduct;
  onChange: (prop: string, images: any[]) => void;
  validationError: any;
}

const ImageUploader: FC<Props> = ({ value, onChange, validationError }) => {
  const [imageItems, setImageItems] = useState<EachDetail[]>(value.eachDetail);
  const [imageFiles, setImageFiles] = useState<File[]>(value.newImage);
  const [previewImage, setPreviewImage] = useState(false);
  const [imageToLarger, setImageToLarger] = useState('');
  const handleClose = () => {
    setPreviewImage(false);
  };
  
  const handleImageUpload = (event: any) => {
    const { files } = event.target;
    // console.log('files', files);
    const uploadedImageFiles = [...imageFiles, ...files];
    // console.log('uploadedImageFiles', uploadedImageFiles);
    setImageFiles(uploadedImageFiles);
    onChange('newImage', uploadedImageFiles);
    const uploadedImages = [...imageItems];
    let count = 0;
    const uploadImage = (file: File) => {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        count++;
        const newImageItem: EachDetail = { image: '', imageDetail: '', size: [''], amount: [''], amountOld: [''] };
        const imageItemsTemp = [...imageItems, newImageItem];
        onChange('eachDetail', imageItemsTemp);
        // onChange('eachDetail', sizeTemp);
        if (typeof reader.result === 'string') {
          newImageItem.image = reader.result;
          uploadedImages.push(newImageItem);
        }
        console.log(uploadedImages);
        if (count === files.length) {
          setImageItems(uploadedImages);
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
  
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...imageItems];
    updatedImages.splice(index, 1);
    setImageItems(updatedImages);
    const newImageTemp = value.newImage;
    console.log(newImageTemp.length);
    newImageTemp.splice(index, 1);
    onChange('newImage', newImageTemp);
    onChange('eachDetail', updatedImages);
  };
  
  const handleDetailAdd = (
    index: number,
    event: any,
    type: 'size' | 'imageDetail' | 'amount' | 'amountOld',
    sizeIndex?: number,
  ) => {
    const detailValue = event.target.value;
    console.log(detailValue, index, type, sizeIndex);
    const detailTemp = [...imageItems];
    if (type === 'imageDetail') {
      const detailValueTemp=detailValue.trim();
      detailTemp[index][type] = detailValueTemp;
    } else if ((type === 'size' || 'amount' || 'amountNew') && sizeIndex != null) {
      detailTemp[index][type][sizeIndex] = detailValue;
    }
    console.log(detailTemp);
    setImageItems(detailTemp);
    onChange('eachDetail', detailTemp);
  };
  const handleSizeAdd = (index: number) => {
    const detailTemp = [...imageItems];
    console.log(index);
    detailTemp[index].size.push('');
    setImageItems(detailTemp);
  };
  const handleSizeDelete = (index: number, sizeIndex: number) => {
    const detailTemp = [...imageItems];
    console.log(index);
    detailTemp[index].size.splice(sizeIndex, 1);
    detailTemp[index].amount.splice(sizeIndex, 1);
    setImageItems(detailTemp);
    onChange('eachDetail', detailTemp);
  };
  
  return (
    <div className='my-2'>
      {imageToLarger !== '' && (
        <ImageDialog open={previewImage} image={imageToLarger} handleClose={handleClose} />
      )}
      <div className='flex flex-col'>
        {imageItems.length !== 0 &&
          imageItems.map((item: EachDetail, index) => (
            <div className='border  p-4 flex flex-row mb-4 space-x-6    '>
              <div className='flex flex-col space-y-2'>
                <div className='flex flex-row  space-x-2  '>
                  <Image
                    src={item.image}
                    alt='Uploaded'
                    width={160}
                    height={160}
                    loader={({ src }) => src}
                    onClick={() => {
                      setImageToLarger(item.image);
                      setPreviewImage(true);
                    }}
                  />
                  <div className='flex flex-col justify-between'>
                    <button
                      className='w-2  rounded-lg '
                      type='button'
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </button>
                    <div />
                  </div>
                </div>
                <div className='w-40'>
                  <TextField
                    fullWidth
                    margin='dense'
                    id='color'
                    label='颜色'
                    type='text'
                    name='color'
                    error={Boolean(validationError[`eachDetail[${index}].imageDetail`])}
                    required
                    value={item.imageDetail || ''}
                    onChange={(event) => {
                      handleDetailAdd(index, event, 'imageDetail');
                    }}
                  />
                </div>
              </div>
              <div className='flex flex-col space-y-2 relative text-xs items-center '>
                {item.size.map((sizeTemp, sizeIndex) => (
                  <div className='flex flex-row space-x-2 items-center'>
                    <button
                      type='button'
                      className='w-6 h-6 text-red-500 '
                      onClick={() => handleSizeDelete(index, sizeIndex)}
                    >
                      X
                    </button>
                    <div className='flex flex-row space-x-4 items-center'>
                      
                      <TextField
                        margin='dense'
                        id='amount'
                        label='商品尺寸'
                        type='text'
                        name='amount'
                        value={item.size[sizeIndex]}
                        error={Boolean(validationError[`eachDetail[${index}].size["${sizeIndex}"]`])}
                        onChange={(event) => {
                          handleDetailAdd(index, event, 'size', sizeIndex);
                        }}
                        fullWidth
                      />
                      
                      <TextField
                        margin='dense'
                        id='amount'
                        label='售卖价'
                        type='text'
                        name='amount'
                        value={item.amount[sizeIndex]}
                        error={Boolean(validationError[`eachDetail[${index}].amount["${sizeIndex}"]`])}
                        onChange={(event) => {
                          handleDetailAdd(index, event, 'amount', sizeIndex);
                        }}
                        fullWidth
                      />
                      
                      <TextField
                        margin='dense'
                        id='amount'
                        label='原价'
                        type='text'
                        name='amount'
                        value={item.amountOld[sizeIndex]}
                        error={Boolean(validationError[`eachDetail[${index}].amount["${sizeIndex}"]`])}
                        onChange={(event) => {
                          handleDetailAdd(index, event, 'amountOld', sizeIndex);
                        }}
                        fullWidth
                      />
                    
                    </div>
                  </div>
                ))}
                <button
                  type='button'
                  className='w-2/3  h-10  border bg-red-700 rounded-lg text-white text-2xl text-center'
                  onClick={() => handleSizeAdd(index)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
      </div>
      
      <label htmlFor='image-upload'>
        <Button
          variant='contained'
          component='span'
          className='w-40 h-10  border bg-red-700 rounded-lg text-white  text-sm text-center'
        >
          添加商品图片
        </Button>
        <input
          accept='image/*'
          className='hidden'
          id='image-upload'
          type='file'
          multiple
          onChange={handleImageUpload}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
