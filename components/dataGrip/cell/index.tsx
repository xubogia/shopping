import { GridRenderCellParams } from '@mui/x-data-grid';
import Image from 'next/image';

export const ImageCell = (params: GridRenderCellParams<any, any, any>) => {



  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className="relative" >
      <Image src={params.value[0].image} alt="商品图片" width={40} height={40} loader={({ src }) => src} />
    </div>
  );
};

export const ProductCell = (params: GridRenderCellParams<any, any, any>) => (
  <div className="text-start space-y-1">
    <div className="font-semibold">{params.row.title}</div>
    <div className="flex flex-row space-x-1">
      <div>{params.row.color},</div>
      <div>{params.row.size}</div>
    </div>
  </div>
);

export const UserDetailCell = (params: GridRenderCellParams<any, any, any>) => (
  <div className="w-full h-full flex flex-col justify-center items-center text-left space-y-1 overflow-auto ">
    <div className="font-semibold ">{params.row.name}</div>
    <div className="">{params.row.phone}</div>
    <div className="break-words whitespace-normal ">{params.row.address}</div>
  </div>
);

export const AmountCell = (params: GridRenderCellParams<any, any, any>) => (
  <div className="w-full text-left space-y-1">
    <div className="">x {params.row.count}</div>
    <div className="">{params.row.amount}</div>
  </div>
);
