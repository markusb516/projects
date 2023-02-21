import YelpNavBar from '../../../../components/projectYelpCamp/YelpNavbar'
import { getSession } from "next-auth/react"
import { useState, useRef, useEffect } from 'react'
import * as yup from 'yup'
import axios from 'axios'
import { Rating } from 'react-simple-star-rating'

import { useSelector } from "react-redux"


export default function CreateCampPage({ session }) {
    const notification = useSelector((state) => state.notificationsSlice.notification)

    const [validation, setValidation] = useState(null)
    const [validationMessage, setValidationMessage] = useState(null)
    const [rating, setRating] = useState(0)
    const [show, setShow] = useState(false)
    const name = useRef()
    const city = useRef()
    const state = useRef()
    const img = useRef()
    const price = useRef()
    const description = useRef()
    let formSchema = yup.object().shape({
        name: yup.string().max(150).required(),
        city: yup.string().notOneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9']).max(120).min(2).required(),
        state: yup.string().notOneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9']).min(2).max(2).required(),
        description: yup.string().required(),
        images: yup.array().required(),
        price: yup.number().max(9_999_999).required(),
        rating: yup.number().min(0.5).max(5).required(),
        
    })

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 10)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setValidation(null)
        }, 3000)
    }, [validation])

    function ratingHandler(rating) {
        setRating(rating)
    }

    async function formHandler(event) {
        event.preventDefault()
        try {
            let imgParsed = [...img.current.files]

            let imglink = []
            for (let x of imgParsed) {
                let formData = new FormData()
                if (x.name.includes('.jpg') || x.name.includes('.jpeg') || x.name.includes('.png')) {
                    formData.append("file", x)
                    formData.append("upload_preset", "ml_default")
                    const data = await axios.post("https://api.cloudinary.com/v1_1/dzss94beo/upload", formData)
                    imglink.push(data.data.secure_url)
                }
                else {
                    continue
                }
            }

            const values = {
                name: name.current.value.trim(), city: city.current.value.trim(), state: state.current.value.trim(),
                description: description.current.value.trim(), images: imglink, price: Number(price.current.value), rating: rating
            }
            const isValid = await formSchema.isValid(values)

            if (isValid) {
                const data = await axios.post("/api/campground/new", values)
                setValidationMessage('Campground has been added')
                setValidation('success')


            }
            else {
                setValidationMessage('Invalid entry please make sure fields are complete')
                setValidation('error')
                throw new Error('Invalid credentials')
            }
        }
        catch (err) {
            if (err.response.data.message === "Campground already created") {
                setValidationMessage('Campground already exist')
                setValidation('error')
            }
            else if(err.response.data.message ==="Invalid location"){
                setValidationMessage('Invalid location')
                setValidation('error')
            }
            else {
                setValidationMessage('Unexpected error')
                setValidation('error')
            }

        }




    }

    return (

        <>
            <style jsx global>
                {
                    `body{background:rgb(249, 250, 251)}`
                }
            </style>


            <div className={` px-0 pb-4  bg-light`}>
                <YelpNavBar session={session} />
                {notification &&
                    <div className="alert text-center  alert-success fade show  mb-0" role="alert">
                        {notification}
                    </div>}

                <div className="container text-center">
                    {validation === 'success' ?
                        <div className="alert text-center  alert-success  fade show" role="alert">
                            {validationMessage}
                        </div> : null
                    }

                    {validation === 'error' ? <div className="alert text-center  alert-danger  fade show" role="alert">
                        {validationMessage}
                    </div> : null}
                    <h1 className=" mt-3 text-center">Create New Camp</h1>
                    <p className="mb-4 text-danger">YelpCamp may pick the most applicable location for entries that are deemed to have an invalid location.</p>
                    <form onSubmit={formHandler} className="formValidation" encType="multipart/form-data" >
                        <label htmlFor="name" className="form-label fw-semibold">Camp Name</label>
                        <input ref={name} type="text" className="form-control mb-3 border-dark" name="name" id="name" required />

                        <label htmlFor="city" className="form-label fw-semibold">Camp City</label>
                        <input ref={city} type="text" className="form-control mb-3 border-dark" name="city" id="city" required />

                        <label htmlFor="state" className="form-label fw-semibold">Camp State</label>
                        <input ref={state} type="text" className="form-control mb-5 border-dark" name="state" id="state" maxLength="2" placeholder="State Abbreviation ex) NY, AZ" required />

                        <div className="input-group mb-3">
                            <input ref={img} type="file" name="img" className="form-control border-dark" id="inputGroupFile02" multiple />
                            <label className="input-group-text fw-semibold border-dark" htmlFor="inputGroupFile02">Camp Image</label>
                        </div>

                        <label htmlFor="description" className="form-label fw-semibold">Camp Description</label>
                        <textarea ref={description} name="description" className="form-control mb-3 border-dark" id="description" cols="20" rows="10" required ></textarea>
                        <label htmlFor="campPrice" className="form-label fw-semibold">Camp Price</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text border-dark">$</span>
                            <input ref={price} id={'campPrice'} required type="number" placeholder="Enter Price" className="form-control border-dark" min="0" name="price" />
                            <span className="input-group-text border-dark">.00</span>
                        </div>

                        {show &&
                            <>
                                <label htmlFor="rating" className="form-label d-block fw-semibold">Camp Rating</label>
                                <Rating
                                    id={'rating'}
                                    onClick={ratingHandler}
                                    allowFraction={true}

                                />
                            </>}

                        <div className=" mt-2 mb-3">
                            <button className="btn btn-success mt-3"> Add New Campground</button>
                        </div>
                    </form>
                    <div>
                    </div>

                </div>
            </div>
        </>
    )


}

export async function getServerSideProps(ctx) {
    const session = await getSession({ req: ctx.req })

    if (!session) {
        return {
            redirect: {
                destination: '/projects/yelpCamp/home'
            }
        }
    }
    return {
        props: {
            session: session
        }
    }
}