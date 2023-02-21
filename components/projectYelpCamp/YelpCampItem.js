import Image from 'next/image'
import Link from 'next/link'
import { homePageImgSizing } from '../../utilites/utilities'
export default function CampItem({ name, city, description, user, id, state, image, rating }) {

    const imgLink = image ? homePageImgSizing(image) : null
    if (imgLink) {
        return (

            <div className={`container mt-2`}>

                <div className={`row`}>
                    <div className={`col`}>
                        <Link href={`/projects/yelpCamp/campground/${id}`}>
                            <Image src={imgLink} priority className={`img-fluid`} width={350} height={300} alt={"camp image"} />
                        </Link>
                    </div>

                    <div className='col-9'>
                        <h1>{name.toUpperCase()}</h1>
                        <p className='fw-semibold'>{city}, {state.toLowerCase()} </p>
                        <p>Created by {user.toLowerCase()}</p>
                        <p>Rating: {rating}</p>
                        <p>{description} </p>
                    </div>
                </div>
            </div>


        )
    }

    return (

        <div className={`container mt-2`}>

            <div className={`row`}>
                <div className={`col`}>
                    <Link href={`/projects/yelpCamp/campground/${id}`}>
                        <Image src={'/images_YelpCamp/noImg.jpg'} priority className={`img-fluid`} width={350} height={300} alt={"camp image"} />
                    </Link>
                </div>

                <div className='col-9'>
                    <h1>{name.toUpperCase()}</h1>
                    <p className='fw-semibold'>{city}, {state.toLowerCase()} </p>
                    <p>Created by {user.toLowerCase()}</p>
                    <p>Rating: {rating}</p>
                    <p>{description} </p>
                </div>
            </div>
        </div>


    )
}