import Map, { Marker, Popup, NavigationControl } from 'react-map-gl'
import { useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import 'mapbox-gl/dist/mapbox-gl.css'
import styles from  '../../styles/yelpCamp.module.css'
import { homePageImgSizing } from '../../utilites/utilities';


export default function HomeMap({ token, allCamps }) {
    const [viewPort, setViewPort] = useState({
        longitude: -98.202493,
        latitude: 38.344962,
        zoom: 3.3,
        width: "100vh",
        height: "30vh"
    })
    const [showPopup, setShowPopup] = useState(false)
    const router = useRouter()

function imgHandler(e){

router.replace(`/projects/yelpCamp/campground/${e.target.id}`)


}

    return (

        <Map
            initialViewState={{ ...viewPort }}
            mapStyle="mapbox://styles/mapbox/outdoors-v12"
            mapboxAccessToken={token}
            style={{
                widht: "100vh",
                height: "400px"
            }}
            attributionControl={false}
        >

            {allCamps.map((camp) => (
                <Marker key={uuidv4()} onClick={(e) => { setShowPopup(camp) }} latitude={camp.latitude} longitude={camp.longitude} />
            ))}
            {showPopup && (
                <Popup closeOnClick={false} longitude={showPopup.longitude} latitude={showPopup.latitude}
                    anchor="left"
                    onClose={() => setShowPopup(false)}>
                    <div  className='text-center mx-2 p-2 card'>
                        <Image  onClick={imgHandler} id={showPopup.id} src={showPopup.images[0]? homePageImgSizing(showPopup.images[0]) : "/images_YelpCamp/noImg.jpg"}
                            width={250}
                            height={100}
                            className={`card-img-top ${styles.img} mx-auto`}
                            alt="camp"/>
                                
                            
                        <p className='fw-semibold fs-4 card-title'>{showPopup.name.toUpperCase()}</p>
                        <p className='fs-5 card-text'>Rating: {showPopup.rating}</p>
                        <p className='fs-5 card-text'>{showPopup.city.toLowerCase()}, {showPopup.state.toLowerCase()}</p>
                    </div>

                </Popup>)}

                <NavigationControl />
        </Map>


    )
}

