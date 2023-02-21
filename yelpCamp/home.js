import YelpNavBar from "../../../components/projectYelpCamp/YelpNavbar"
import CampItem from "../../../components/projectYelpCamp/YelpCampItem"
import HomeMap from "../../../components/projectYelpCamp/YelpHomeMap"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { getSession } from "next-auth/react"
import InfiniteScroll from 'react-infinite-scroll-component'
import { useEffect, useState } from 'react'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { v4 as uuidv4 } from 'uuid';
import { addNotification } from "../../../redux/slices/yelpCampNotification"
import axios from "axios"

export default function YelpHomePage({ session, allCamps, mapToken }) {
    const notification = useSelector((state) => state.notificationsSlice.notification)
    const dispatch = useDispatch()
    const [page, setPage] = useState(2)
    const [scrollHeight, setScrollHeight] = useState(500)
    const [campPerReq, setcampPerReq] = useState(2)
    const [items, setItems] = useState(allCamps[0] ? allCamps.slice(0, 2) : false)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        if (window.innerHeight < 630) {
            setScrollHeight(420)
        }

        else if (window.innerHeight < 700) {
            setScrollHeight(480)
        }
        else if (window.innerHeight < 725) {
            setScrollHeight(350)
        }
        else if (window.innerHeight < 916) {
            setItems(allCamps.slice(0, 3))
            setScrollHeight(600)
        }
        else if (window.innerHeight < 1030) {
            setItems(allCamps.slice(0, 4))
            setcampPerReq(4)
            setScrollHeight(700)
        }
        else if (window.innerHeight < 1190) {
            setItems(allCamps.slice(0, 4))
            setcampPerReq(4)
            setScrollHeight(690)
        }
        else if (window.innerHeight < 1370) {
            setItems(allCamps.slice(0, 5))
            setcampPerReq(5)
            setScrollHeight(830)
        }

        function resizing() {
            if (window.innerHeight < 630) {
                setScrollHeight(420)
            }
    
            else if (window.innerHeight < 700) {
                setScrollHeight(400)
            }
            else if (window.innerHeight < 725) {
                setScrollHeight(350)
            }
            else if (window.innerHeight < 916) {
                setItems(allCamps.slice(0, 3))
                setScrollHeight(600)
            }
            else if (window.innerHeight < 1030) {
                setItems(allCamps.slice(0, 4))
                setcampPerReq(4)
                setScrollHeight(700)
            }
            else if (window.innerHeight < 1190) {
                setItems(allCamps.slice(0, 4))
                setcampPerReq(4)
                setScrollHeight(690)
            }
            else if (window.innerHeight < 1370) {
                setItems(allCamps.slice(0, 5))
                setcampPerReq(5)
                setScrollHeight(830)
            }
        }

        window.addEventListener('resize', resizing)
        return () => window.removeEventListener('resize', resizing)
    }, [allCamps])






    async function fetchData() {
        if (items.length < allCamps.length) {
            setTimeout(async () => {
                try {
                    const data = await axios.get("/api/campground/page", {
                        params: {
                            page: page,
                            campPerReq: campPerReq,
                        }
                    })

                    setItems((state) => {

                        let holder = [...state, ...data.data.camps]
                        holder = holder.filter((element, index, arr) => {
                            return arr.map((obj) => obj.id).indexOf(element.id) === index;
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

    useEffect(() => {
        if (notification) {
            setTimeout(() => {
                dispatch(addNotification({ notification: null }))
            },
                4000)
        }
    }, [notification])


    return (
        <>
            <style jsx global>
                {
                    `body{background:rgb(249, 250, 251)}`
                }
            </style>
            <div className={` bg-light px-0 pb-4 mb-3`}>
                <YelpNavBar session={session} />
                {notification &&
                    <div className="alert text-center alert-success alert-dismissible fade show mb-0" role="alert">
                        {notification}
                        <button onClick={() => { dispatch(addNotification({ notification: null })) }} className="btn-close ms-auto"></button>
                    </div>}
                <HomeMap token={mapToken} allCamps={allCamps} />

                <div id="scrollableDiv" style={{ height: scrollHeight, overflowY: 'auto' }} className=" mt-2 mb-2">
                    {items ?
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
                            scrollableTarget="scrollableDiv"
                        >

                            {
                                items.map((camp) => {

                                    return <CampItem key={uuidv4()} rating={camp.rating} name={camp.name.toUpperCase()} id={camp.id} image={camp.images[0]}
                                        description={camp.description} user={camp.user} city={camp.city.toLowerCase()} state={camp.state.toLowerCase()}
                                    />
                                })
                            }
                        </InfiniteScroll> :
                        <h2 className="text-center">There are no campground post created currently.</h2>
                    }
                </div>
            </div>
        </>
    )
}


export async function getServerSideProps(ctx) {
    const uri = `${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}`
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    const session = await getSession({ req: ctx.req })
    await client.connect()
    const campgrounds = client.db('yelpCamp').collection('campgrounds')
    let allCamps = await campgrounds.find({})
    allCamps = await allCamps.toArray()
    allCamps = allCamps.map((camp) => ({
        id: camp._id.toString(), user: camp.user, name: camp.name,
        city: camp.city, state: camp.state, description: camp.description,
        images: camp.images, price: camp.price, latitude: camp.latitude, longitude: camp.longitude, rating: camp.rating
    }))

    if (session) {
        client.close()
        return {
            props: {
                session: session,
                allCamps: allCamps,
                mapToken: process.env.MAPBOX_TOKEN
            }
        }
    }
    client.close()
    return {
        props: {
            session: false,
            allCamps: allCamps,
            mapToken: process.env.MAPBOX_TOKEN
        }
    }
}