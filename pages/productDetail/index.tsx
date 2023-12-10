import Layout from '../../layout/toC';
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
const Main=()=>{

    const [data, setData] = useState<>(null);
    const router = useRouter();
    const [id,setId]=useState('');
    useEffect(() => {
        let idTemp = router.query.id;
        console.log(idTemp)
     if (idTemp) {

            console.log('fetch', idTemp)
            fetchData(idTemp);
            setId(idTemp)
     }

    }, [router.query.id])
    const fetchData = async (id) => {
        let products;
        let categorys;
        try {
            let response = await axios.get('/api/product/getById?id='+id);
            products = response.data;
            console.log(products[0])
            setData(products[0]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addToBag=async (e) => {
        e.preventDefault()
        const userName=localStorage.getItem('userName');
        if(!userName){
            alert('请先登录');
            router.push('/login');
            return; // 由于未登录，中断函数执行
        }else{
            const data = {
                userName: userName,
                id: id
            }
            const response = await axios.post('/api/user/bag/add', data);
            router.push('/bag');
            return; // 由于未登录，中断函数执行
        }

    }


    return(
       data!==null&& <div className="bg-white">
            <div className="pt-6">
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7x  l ">
                    <div className="hidden rounded-lg lg:block ">
                        <img
                            src={data.eachDetail[0].image}
                            alt="Two each of gray, white, and black shirts laying flat."
                            className="h-full w-full object-cover object-center"/>
                    </div>
                </div>

                <div
                    className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{data.title}</h1>
                    </div>


                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl tracking-tight text-gray-900">￥{data.eachDetail[data.eachDetail.length-1].amount[0]}</p>


                        <div className="mt-6">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">

                                    <svg className="text-gray-900 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20"
                                         fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                    <svg className="text-gray-900 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20"
                                         fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                    <svg className="text-gray-900 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20"
                                         fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                    <svg className="text-gray-900 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20"
                                         fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                    <svg className="text-gray-200 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20"
                                         fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <p className="sr-only">4 out of 5 stars</p>
                                <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">117
                                    reviews</a>
                            </div>
                        </div>

                        <form className="mt-10" onSubmit={addToBag}>



                            <div className="mt-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                </div>

                                <fieldset className="mt-4">
                                    <legend className="sr-only">Choose a size</legend>

                                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                                        {data.eachDetail[data.eachDetail.length-1].size.map(item=><label
                                            className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm">
                                            <input type="radio" name="size-choice" value="XS" className="sr-only"
                                                   aria-labelledby="size-choice-1-label" />
                                            <span id="size-choice-1-label">{item}</span>

                                            <span className="pointer-events-none absolute -inset-px rounded-md"
                                                  aria-hidden="true"></span>
                                        </label>)}

                                    </div>
                                </fieldset>
                            </div>

                            <button type="submit"

                                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                               加入购物车
                            </button>
                        </form>
                    </div>

                    <div
                        className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">

                        <div>
                            <h3 className="sr-only">Description</h3>

                            <div className="space-y-6">
                                <p className="text-base text-gray-900">
                                    欢迎来到我们的品牌精选系列 - 独特风格的完美选择。每一款产品都经过精心设计，体现出我们对细节的关注，为您的时尚生活提供了多样化的选择。探索各种风格，尽情展现您的独特个性。</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-medium text-gray-900">品牌特色:</h3>

                            <div className="mt-4">
                                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                                    <li className="text-gray-400"><span className="text-gray-600">本土工艺: 我们的产品在本地制造，每一件都经过精心的手工剪裁和缝制。</span>
                                    </li>
                                    <li className="text-gray-400"><span className="text-gray-600">独特色调: 通过我们专有的染色工艺，呈现出丰富多彩的色彩选择。</span>
                                    </li>
                                    <li className="text-gray-400"><span
                                        className="text-gray-600">预洗和预缩: 确保产品穿着舒适，经久耐用。</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-sm font-medium text-gray-900">另外</h2>

                            <div className="mt-4 space-y-6">
                                <p className="text-sm text-gray-600">欢迎加入我们的会员服务，第一时间体验全新激动人心的颜色，如即将推出的“炭灰色”限量版系列。我们期待为您的日常穿搭增添亮丽色彩。.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Index=()=>{


    return (
        <Layout Main={Main}/>
    )
}


export default Index;