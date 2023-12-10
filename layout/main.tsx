import { FC, useState } from 'react';

interface Props {
  Right?: any;
}

const Index: FC<Props> = ({ Right }) => {

  return (
    <div className="flex-grow flex flex-col">
      <Right />
    </div>
  );
};

export default Index;
