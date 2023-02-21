import { useRef, useState, useEffect } from "react"
import { getSession } from "next-auth/react"
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import YelpNavBar from "../../../../../components/projectYelpCamp/YelpNavbar"
import axios from "axios"
import { useRouter } from "next/router"
import * as yup from 'yup'
import { Rating } from 'react-simple-star-rating'
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from "react-redux"
import CheckBox from "../../../../../components/projectYelpCamp/YelpCampCheckbox"


// NEED TO BRING IN RATING DATA---------------------------------------


export default function EditCampPage({ session, camp }) {
    const notification = useSelector((state) => state.notificationsSlice.notification)
    const router = useRouter()
    const { campId } = router.query
    const name = useRef()
    const city = useRef()
    const state = useRef()
    const img = useRef()
    const [validation, setValidation] = useState(null)
    const [validationMessage, setValidationMessage] = useState(null)
    const [rating, setRating] = useState(null)
    const [editRating, setEditRating] = useState(false)
    const price = useRef()
    const description = useRef()
    let formSchema = yup.object().shape({
        name: yup.string().max(150),
        city: yup.string().max(120),
        state: yup.string().max(2),
        description: yup.string(),
        price: yup.number().max(99_999_999),
        rating: yup.mixed(),
        newImages: yup.array(),
        deletedImages: yup.array(),
        id: yup.string(),
        user: yup.string()
    })


    function ratingHandler(rating) {
        setRating(rating)
    }

    useEffect(() => {
        setTimeout(() => {
            setValidation(null)
        }, 3000)
    }, [validation])


    async function formHandler(e) {
        e.preventDefault()
        let delImages = []
        for (let element of e.target) {
            if (element.id === 'checkbox') {
                if (element.checked) {
                    delImages.push(element.value)
                }
                else if (!element.checked) {
                    delImages = delImages.filter((item) => item !== element.value)

                }
            }
        }
        const newName = !name.current.value.trim() ? camp.name : name.current.value.trim()
        const newCity = !city.current.value.trim() ? camp.city : city.current.value.trim()
        const newState = !state.current.value.trim() ? camp.state : state.current.value.trim()
        const newPrice = !Number(price.current.value) ? camp.price : Number(price.current.value.trim())
        const newDescription = !description.current.value.trim() ? camp.description : description.current.value.trim()
        let imgParsed = [...img.current.files]
        let imglink = []

        if (imgParsed.length) {
            for (let x of imgParsed) {
                let formData = new FormData()
                formData.append("file", x)
                formData.append("upload_preset", "ml_default")
                const data = await axios.post("https://api.cloudinary.com/v1_1/dzss94beo/upload", formData)
                imglink.push(data.data.secure_url)

            }
        }

        const values = {
            user: session.user.name, id: campId,
            name: newName, city: newCity, state: newState, price: newPrice,
            description: newDescription, newImages: imglink.length ? imglink : [], deletedImages:
                delImages, rating: rating
        }

        try {
            const isValid = await formSchema.isValid(values)
            if (isValid) {
                const data = await axios.put("/api/campground/edit", values)
                setValidation('success')
                setValidationMessage('Campground has been updated')
                setTimeout(() => {
                    router.reload()
                }, 800)




            }
            else {
                setValidation('error')
                setValidationMessage('Invalid entry')
            }
        }
        catch (err) {
            if (err.response.data.message === "Campground already created") {
                setValidationMessage('Campground already exist')
                setValidation('error')
            }
            else if (err.response.data.message === "Invalid location") {
                setValidationMessage('Invalid location')
                setValidation('error')
            }
            else {
                setValidation('error')
                setValidationMessage('Unexpected error')
            }
        }

    }

    return (
        <div className={`container-fluid full  px-0 bg-light`}>

            <div className={`container-fluid px-0 pb-4  bg-light`}>
                <YelpNavBar session={session} />
                {notification &&
                    <div className="alert alert-success text-center fade show  mb-0" role="alert">
                        {notification}
                    </div>}

                <div className="container text-center">
                    {validation === 'success' ?
                        <div className="alert text-center alert-success fade show " role="alert">
                            {validationMessage}
                        </div> : null
                    }
                    {validation === 'error' ?
                        <div className="alert  text-center alert-danger fade show" role="alert">
                            {validationMessage}
                        </div> : null
                    }

                    <h1 className="text-center mt-3">Edit Camp: {camp.name.toUpperCase()}</h1>
                    <p className="mb-4 text-danger">YelpCamp may pick the most applicable location for entries that are deemed to have an invalid location.</p>

                    <form onSubmit={formHandler} className="formValidation" encType="multipart/form-data" noValidate>
                        <label htmlFor="name" className="form-label fw-semibold">Camp Name</label>
                        <input ref={name} placeholder={camp.name} type="text" className="form-control mb-3 border-dark" name="name" id="name" required />

                        <label htmlFor="city" className="form-label fw-semibold">Camp City</label>
                        <input ref={city} type="text" placeholder={camp.city.toLowerCase()} className="form-control mb-3 border-dark" name="city" id="city" required />

                        <label htmlFor="state" className="form-label fw-semibold">Camp State</label>
                        <input ref={state} placeholder={camp.state.toLowerCase()} type="text" className="form-control mb-5 border-dark" name="state" id="state" maxLength="2" required />

                        <div className="input-group mb-3">
                            <input ref={img} type="file" name="img" className="form-control border-dark" id="inputGroupFile02" multiple />
                            <label className="input-group-text fw-semibold border-dark" htmlFor="inputGroupFile02">Camp Image</label>
                        </div>

                        <label htmlFor="description" className="form-label fw-semibold">Camp Description</label>
                        <textarea placeholder={camp.description} ref={description} name="description" className="form-control mb-3 border-dark" id="description" cols="20" rows="10" required></textarea>
                        
                        <label htmlFor="campPrice" className="form-label fw-semibold">Camp Price</label>
                        <div className="input-group">                        
                            <span className="input-group-text border-dark">$</span>
                            <input ref={price} id={'campPrice'}  required type="number" placeholder={camp.price} className="form-control border-dark" min="0" name="price" />
                            <span className="input-group-text border-dark">.00</span>
                        </div>

                        {editRating ?
                            <>
                                <label htmlFor="rating" className="form-label d-block  fw-semibold">Camp Rating</label>
                                <Rating
                                    id={'rating'}
                                    onClick={ratingHandler}
                                    allowFraction={true}
                                    className={`mb-3`} />
                                <button className="btn  mb-3 btn-secondary d-block mx-auto" onClick={() => { setEditRating(false) }}>Cancel</button>

                            </>
                            :
                            <button className="btn mt-3 mb-3 btn-secondary" onClick={() => { setEditRating(true) }}>Edit Rating</button>
                        }


                        <div>
                            {camp.images[0]&&<label className="d-block fw-semibold form-label" htmlFor="imgDelete">Delete Image</label>}


                            {camp.images.map((image) => {
                                return (
                                    <CheckBox key={uuidv4()} image={image} />
                                )
                            })}



                        </div>

                        <div className=" mb-3">
                            <button type="submit" className="btn btn-success mt-3">Edit Campground</button>
                        </div>
                    </form>
                    <div>
                    </div>

                </div>
            </div>


        </div>


    )



}

export async function getServerSideProps(ctx) {
    const session = await getSession({ req: ctx.req })
    const uri = `${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}`
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const campgrounds = client.db('yelpCamp').collection('campgrounds')
    if (session) {
        const foundCamp = await campgrounds.findOne({ _id: ObjectId(ctx.query.campId) })

        return {
            props:
            {
                camp: {
                    id: foundCamp._id.toString(), name: foundCamp.name, city: foundCamp.city, state: foundCamp.state,
                    description: foundCamp.description, images: foundCamp.images, price: foundCamp.price
                },
                session: session
            }
        }

    }

    return {
        redirect:
        {
            destination:
                '/projects/yelpCamp/home'
        }
    }

}