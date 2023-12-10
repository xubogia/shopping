import { NextPage } from 'next';
import Main from '../../components/bag'
import Layout from '../../layout/toC';




const Home: NextPage = () =>{

    return (
        <Layout Main={Main}/>
    )

}


export default Home;
