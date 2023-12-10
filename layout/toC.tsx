import { NextPage } from 'next';
import Nav from '../components/nav/toC'

const Home: NextPage = ({Main}) =>{

    return (
        <div className='flex flex-col  bg-gray-100 w-full h-full'>
            <Nav/>
            <div className='border bg-white  rounded-lg grow '>
               <Main/>
            </div>

        </div>
    )

}


export default Home;
