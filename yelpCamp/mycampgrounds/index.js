import YelpNavBar from "../../../../components/projectYelpCamp/YelpNavbar"
import CampItem from "../../../../components/projectYelpCamp/YelpCampItem"
import { getSession } from "next-auth/react"
import InfiniteScroll from 'react-infinite-scroll-component'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import axios from "axios"
import { useSelector } from "react-redux"

export default function MycampgroundPage({ session, campgrounds }) {
    
    const [page, setPage] = useState(2)
    const [campPerReq, setcampPerReq] = useState(2)
    const [items, setItems] = useState(campgrounds.length ? campgrounds.slice(0, 2) : false)
    const [scrollHeight, setScrollHeight] = useState(500)
    const [hasMore, setHasMore] = useState(true)
    const notification = useSelector((state) => state.notificationsSlice.notification)

    useEffect(() => {
        if (window.innerHeight < 700) {
            setScrollHeight(400)
        }
        else if (window.innerHeight < 725) {
            setScrollHeight(350)
        }
        else if (window.innerHeight < 916) {
          setItems(campgrounds.slice(0,3))
            setScrollHeight(600)
        }
        else if (window.innerHeight<1030){
            setItems(campgrounds.slice(0,4))
            setcampPerReq(4)
            setScrollHeight(700)
        }
        else if (window.innerHeight<1190){
            setItems(campgrounds.slice(0,4))
            setcampPerReq(4)
            setScrollHeight(690)
        }
        else if (window.innerHeight<1370){
            setItems(campgrounds.slice(0,5))
            setcampPerReq(5)
            setScrollHeight(830)
        }

        function resizing() {
            if (window.innerHeight < 700) {
                setScrollHeight(400)
            }
            else if (window.innerHeight < 725) {
                setScrollHeight(350)
            }
            else if (window.innerHeight < 916) {
              setItems(campgrounds.slice(0,3))
                setScrollHeight(600)
            }
            else if (window.innerHeight<1030){
                setItems(campgrounds.slice(0,4))
                setcampPerReq(4)
                setScrollHeight(700)
            }
            else if (window.innerHeight<1190){
                setItems(campgrounds.slice(0,4))
                setcampPerReq(4)
                setScrollHeight(690)
            }
            else if (window.innerHeight<1370){
                setItems(campgrounds.slice(0,5))
                setcampPerReq(5)
                setScrollHeight(830)
            }
        }
        
        window.addEventListener('resize', resizing)
        return () => window.removeEventListener('resize',resizing)
    }, [])




    async function fetchData() {
        if (items && items.length < campgrounds.length) {
            setTimeout(async () => {
                try {
                    const data = await axios.get("/api/campground/mycampground/page", {
                        params: {
                            page: page,
                            campPerReq: campPerReq,
                            user: session.user.name
                        }
                    })

                    setItems((state) => {

                        let holder = [...state, ...data.data.camps]
                        holder = holder.filter((element,index,arr) => {
                            return arr.map((obj)=>obj.id).indexOf(element.id)===index;
                        })                        
                        return holder
                    })
                    setPage((state) => state += 2)

                }
                catch (err) {
                    
                }

            }, 1000)

        }
        else { setHasMore(false) }
    }

if (!campgrounds[0]){
    return(
        <>
        <style jsx global>
                {
                    `body{background:rgb(249, 250, 251)}`
                }
            </style>
            
            <YelpNavBar session={session} />
                {notification &&
                    <div className="alert  text-center alert-success fade show  mb-0" role="alert">
                        {notification}
                    </div>}


        <h1 className="text-center mt-3 mb-5">My Campgrounds</h1>

        <h2 className="text-center" >You currently do not have any campground created.</h2>
        </>
    )
}
    return (
        <>
            <style jsx global>
                {
                    `body{background:rgb(249, 250, 251)}`
                }
            </style>
            <div className={` px-0 pb-1`}>
                <YelpNavBar session={session} />
                {notification &&
                    <div className="alert  text-center alert-success fade show  mb-0" role="alert">
                        {notification}
                    </div>}

                <h1 className="text-center mt-3 mb-5">My Campgrounds</h1>
                <div id="scrollableDiv" style={{ height: scrollHeight, overflow: "auto" }}>

                        <InfiniteScroll
                            dataLength={items.length}
                            next={fetchData}
                            hasMore={hasMore}
                            loader={<h4 className="text-center ">Loading...</h4>}
                            endMessage={
                                <p className="text-center  text-secondary">
                                    <b>All campground are being displayed.</b>
                                </p>
                            }
                            scrollableTarget={"scrollableDiv"}

                        >

                            {
                                items.map((camp) => {

                                    return <CampItem key={uuidv4()} name={camp.name.toUpperCase()} id={camp.id} image={camp.images[0]}
                                        description={camp.description} user={camp.user} rating={camp.rating} city={camp.city.toLowerCase()} state={camp.state.toLowerCase()}
                                    />
                                })
                            }



                        </InfiniteScroll>
                       
                    
                </div>

            </div>

        </>
    )
}

export async function getServerSideProps(ctx) {
    const uri = `${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}`
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const session = await getSession({ req: ctx.req })
    let allCamps = []
    try {
        await client.connect()
        const campgrounds = client.db('yelpCamp').collection('campgrounds')
        allCamps = await campgrounds.find({ user: session.user.name })
        allCamps = await allCamps.toArray()
        allCamps = allCamps.map((camp) => ({
            id: camp._id.toString(), user: camp.user, name: camp.name,
            city: camp.city, state: camp.state, description: camp.description,
            images: camp.images, price: camp.price, rating: camp.rating
        }))

    }
    catch (err) {

        allCamps = []
    }


    if (!session) {
        return {
            redirect: {
                destination: '/projects/yelpCamp/home'
            }
        }
    }
    return {
        props: {
            session: session,
            campgrounds: allCamps,
        }
    }
}