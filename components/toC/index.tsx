import axios from "axios";
import {useEffect, useState} from "react";

interface EachDetail {
    image: string;
    imageDetail: string;
    size: string[];
}
interface Product {
    eachDetail: EachDetail[];
    title: string;
    id: number;
    category: string;
    amount: string;
    status: string;
    detail: string[];
}

const Index=()=>{
    const [data, setData] = useState<Product[]>([]);
    const fetchData = async () => {
        let products;
        let categorys;
        try {
            let response = await axios.get('/api/product');
            products = response.data;
            setData(products);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(()=>{
        fetchData()
    },[])

    return(
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

                <div
                    className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {
                        data.map((item)=>(
                            <a href={"/productDetail/?id="+item.id} className="group">
                                <div
                                    className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                    <img
                                        src={item.eachDetail[0].image}
                                        alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                                        className="h-full w-full object-cover object-center group-hover:opacity-75" />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700">{item.title}</h3>
                                <p className="mt-1 text-lg font-medium text-gray-900">￥{item.eachDetail[item.eachDetail.length-1].amount[0]}</p>
                            </a>
                        ))
                    }

                </div>
            </div>
        </div>
    )
}

export default Index;