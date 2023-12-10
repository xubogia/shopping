import { FC } from 'react';
import Nav from '../components/nav';

interface Props {
  right?: any;
  currentPage: string;
}

const Index: FC<Props> = ({ right: Right, currentPage }) => (
  <div className="h-full  p-4  bg-gray-100">
    <div className="w-full h-full  flex flex-row  border rounded-lg bg-white ">
      <Nav currentPage={currentPage} />
      <Right />
    </div>
  </div>
);

export default Index;
