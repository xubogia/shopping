import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

const Index=()=>{

    const [data, setData] = useState<>(null);
    const [allPrice,setAllPrice]=useState(0)
    const router=useRouter();
    useEffect(() => {
        const userName = localStorage.getItem('userName')
        console.log(userName)
        if (userName) {

            console.log('fetch', userName)
            fetchData(userName)
        }
        else{
            alert('请先登录');
            router.push('/login');
            return; // 由于未登录，中断函数执行
        }


    }, [])

    const fetchData = async (userName) => {
        try {
            let response = await axios.get('/api/user/bag/getByUserName?userName='+userName);

            let ids=response.data.map(item=>item.id);
            console.log(ids);
            response= await axios.post('/api/product/getById',{ids:ids})
            console.log(response.data);
            let allPriceTemp=0;
            response.data.forEach((item)=>{
                allPriceTemp+=Number(item.eachDetail[item.eachDetail.length-1].amount[0]);
            })
            setAllPrice(allPriceTemp);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    return (
       data!==null&& <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8  flex flex-col'>
            <div className='h-40  flex text-3xl items-center'>购物车</div>
            <div className='flex '>
                <div className=' w-2/3 pr-10 '>
                    {
                        data.map(item=><div className='border-t border-b  py-10 flex flex '>
                            <img src={item.eachDetail[0].image} className='w-60 '/>
                            <div className='ml-4 space-y-2 '>
                                <div>{item.title}</div>
                                <div className='text-gray-500'>size: {item.eachDetail[item.eachDetail.length-1].size[0]}</div>
                                <div className='text-xl '>￥{item.eachDetail[item.eachDetail.length-1].amount[0]}</div>
                            </div>
                        </div>)
                    }

                </div>
                <div className='bg-gray-50 w-1/3  h-60 p-4 flex flex-col justify-between  '>
                    <div className='space-y-4'>
                        <div className='text-xl '>购物车详情</div>
                        <div className='text-gray-500'>总价：￥{allPrice}</div>
                    </div>

                    <button className='bg-blue-600 w-full py-3 text-center text-white'>支付</button>
                </div>
            </div>

        </div>
    )
}


export default Index