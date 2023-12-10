import { NextPage } from 'next';

import Layout from '@/layout';
import Right from '@/components/product';
import Main from '@/layout/main';

const Product = () => <Main Right={Right} />;
const Home: NextPage = () => <Layout right={Product} currentPage="商品" />;


export default Home;
