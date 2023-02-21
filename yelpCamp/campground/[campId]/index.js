import { useDispatch } from 'react-redux'
import { addNotification } from '../../../../../redux/slices/yelpCampNotification'
import YelpNavBar from '../../../../../components/projectYelpCamp/YelpNavbar'
import { getSession } from 'next-auth/react'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { ObjectID } from 'bson'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import CommentItem from '../../../../../components/projectYelpCamp/YelpCampgroudComment'
import { mainPageImgSizing } from '../../../../../utilites/utilities'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Rating } from 'react-simple-star-rating'
import { useSelector } from 'react-redux'

export default  function CampgroundPage({ session, camp, campId, commentsList, hasRating }) {

    const imgLink = []
    const dispatch = useDispatch()
    const router = useRouter()
    const [commentValid, setCommentValid] = useState(false)
    const [commentValidMessage, setCommentValidMessage] = useState(null)
    const [campRating, setCampRating] = useState(camp.rating)
    const [deleteRating, setDeleteRating] = useState(hasRating ? hasRating.rating : null)
    const [ratingNotification, setRatingNotification] = useState(false)
    const [ratingNotificationMessage, setratingNotificationMessage] = useState(null)
    const notification = useSelector((state) => state.notificationsSlice.notification)
    const [items, setItems] = useState(commentsList.length ? commentsList.slice(0, 6) : false)
    const [page, setPage] = useState(4)
    const [commentsPerReq, setCcommentsPerReq] = useState(4)
    const [hasMore, setHasMore] = useState(true)
    const [picIndex, setPicIndex] = useState(0)
    const [rating, setRating] = useState(0)
    const [scrollHeight, setScrollHight] = useState('29vh')
    const [leaveRating, setLeaveRating] = useState(true)

    camp.images.forEach(element => {
        const holder = mainPageImgSizing(element)
        imgLink.push(holder)
    })

    function ratingHandler(enteredRating) {
        setRating(enteredRating)

    }


    async function ratingSubmitHandler() {
        try {

            const data = await axios.post('/api/campground/rating/new', { user: session.user.name, rating: rating, campground: router.query.campId })
            setDeleteRating(rating)
            setRatingNotification('success')
            setratingNotificationMessage('Rating has been created')
            setCampRating(data.data.newRating)
            setLeaveRating(true)
        }

        catch (err) {
            setRatingNotification('error')
            setratingNotificationMessage('Unexected error')

        }

    }
    async function fetchData() {
        if (items.length < commentsList.length) {
            setTimeout(async () => {
                try {
                    const data = await axios.get("/api/campground/comment/page", {
                        params: {
                            page: page,
                            commentsPerReq: commentsPerReq,
                            campId: campId
                        }
                    })
                    setItems((state) => {

                        let holder = [...state, ...data.data.comments]
                        holder = holder.filter((element, index, arr) => {
                            return arr.map((obj) => obj.id).indexOf(element.id) === index;
                        })
                        return holder
                    })
                    setPage((state) => state += 4)

                }
                catch (err) {
                }

            }, 1000)

        }
        else { setHasMore(false) }
    }

    const decrementImg = function () {
        setPicIndex((state) => {
            if (state > 0) {
                return state -= 1
            }
            else {
                return state
            }
        })
    }

    const incrementImg = function () {
        setPicIndex((state) => {

            if (state < imgLink.length - 1) {
                return state += 1
            }
            else {
                return state
            }

        }

        )
    }

    useEffect(() => {
        setTimeout(() => {
            setCommentValid(false)
        }, 1000)
    }, [commentValid])

    useEffect(() => {
        setTimeout(() => {
            setRatingNotification(false)
        }, 1000)
    }, [ratingNotification])

    useEffect(() => {
        function listen() {
            
                if (window.innerHeight <= 855) {
                    setScrollHight('32vh')
                }
                else if (window.innerHeight <= 1032) {
                    setScrollHight('28vh')
                }
                else if (window.innerHeight <= 1190) {
                    setScrollHight('22vh')
                }
                else if (window.innerHeight <= 1380) {
                    setScrollHight('22vh')
                }
                else { setScrollHight((state) => state) }
            
        }
        window.addEventListener('resize',listen )


        return () => window.removeEventListener('resize', listen)
    }, [scrollHeight])

    async function commentCreateHandler(e) {
        e.preventDefault()
        try {
            const test = e.target[0].value
            if (test.trim().length >= 1 && test.trim().length < 99_999_999) {
                const result = await axios.post("/api/campground/comment/new", { comment: test, campground: router.query.campId, user: session.user.name })
                setCommentValid(true)
                setCommentValidMessage('Comment created')
                setItems((state) => state ? [...state, { id: result.data.newCamp, comment: test, user: session.user.name, campground: router.query.campId }] : [{ id: result.data.newCamp, comment: test, user: session.user.name, campground: router.query.campId }])
                e.target[0].value = ''
            }
            else {
                setCommentValid('error')
                setCommentValidMessage('Error in comment credentials')
            }
        }
        catch (err) {
            setCommentValid('error')
            setCommentValidMessage('Unexpected error')
        }
    }

    async function deleteCampgroundHandler(e) {
        e.preventDefault()
        try {
            const response = await axios.delete("/api/campground/delete", { data: { id: campId, user: session.user.name } })
            
            dispatch(addNotification({ notification: "Campground has been deleted." }))
            router.replace("/projects/yelpCamp/home")
        }
        catch (err) {
        }
    }

    function updateCommentDeleteState(commentId) {
        setItems((state) => {

            if ([...state.filter((e) => e.id !== commentId)].length > 0) {
                return [...state.filter((e) => e.id !== commentId)]
            }
            setHasMore(false)
        }
        )
    }

    function editCommentStateHandler(commentId, newComment) {
        setItems((state) => {
            return [...state].map((comment) => {
                if (comment.id === commentId) {
                    comment.comment = newComment
                    return comment
                }
                else {
                    return comment
                }
            })
        })
    }

    async function deleteRatingHandler(e) {
        e.preventDefault()
        try {

            const data = await axios.delete('/api/campground/rating/delete', { data: { user: session.user.name, campground: campId } })
            setRatingNotification('success')
            setratingNotificationMessage('Rating has been deleted')
            setCampRating(data.data.newRating)
            setLeaveRating(true)
            setDeleteRating(null)

        }

        catch (err) {
            setRatingNotification('error')
            setratingNotificationMessage('Unexpected error')
        }


    }

    if (session) {
        return (
            <>
                <style jsx global>
                    {
                        `body{background:rgb(249, 250, 251)}`
                    }
                </style>
                <div className={` pb-3 px-0 bg-light`} >
                    <YelpNavBar session={session} />
                    {notification &&
                        <div className="alert text-center alert-success alert-dismissible fade show mb-0" role="alert">
                            {notification}
                            <button onClick={() => { dispatch(addNotification({ notification: null })) }} className="btn-close ms-auto"></button>
                        </div>}
                    <div className='container mt-2'>

                        <div className='row'>
                            <div className='col-12'>

                                <div className="card" >

                                    <div id="carouselCampground" className="carousel slide">
                                        <div className="carousel-inner">
                                            <div className="carousel-item active">
                                                <Image src={imgLink[0] ? imgLink[picIndex] : "/images_YelpCamp/noImg.jpg"} width={1294} height={500} className="d-block w-100" priority={true} alt={`camp photo`} />
                                            </div>
                                        </div>
                                        <button onClick={decrementImg} className="carousel-control-prev" type="button" data-bs-target="#carouselCampground" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>

                                        <button onClick={incrementImg} className="carousel-control-next" type="button" data-bs-target="#carouselCampground" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <h1 className="card-title">{camp.name.toUpperCase()}</h1>
                                        <p className="card-text  fs-4 fw-semibold">{camp.city.toLowerCase()}, {camp.state.toLowerCase()}</p>
                                        <p className="card-text  fs-4 fw-semibold">Price: ${camp.price}</p>
                                        <p className="card-text  fs-4 fw-semibold">Rating: {campRating} / 5</p>
                                        <p className="card-text fs-6 fw-semibold">{camp.description}</p>

                                        {session.user.name !== camp.user ?
                                            <>
                                                <div>
                                                    {!leaveRating ?
                                                        <Rating
                                                            onClick={ratingHandler}
                                                            allowFraction={true}

                                                        /> : null}
                                                </div>

                                                {leaveRating ?
                                                    <>
                                                        <button onClick={() => { setLeaveRating(false) }} className={'btn btn-secondary'}>Leave Rating</button>
                                                        <p className='text-danger fw-bold mt-1'>Entering any new rating will override previosly made ones.</p>
                                                    </>
                                                    :
                                                    <>
                                                        <button onClick={ratingSubmitHandler} className='btn  btn-outline-secondary ms-2'>Submit</button>
                                                        <button onClick={() => { setLeaveRating(true) }} className='btn  btn-outline-dark ms-3'>Cancel</button>
                                                        {deleteRating && <button onClick={deleteRatingHandler} className='btn btn-outline-danger ms-3'>Delete Rating: {deleteRating}</button>}

                                                    </>


                                                }

                                            </>

                                            : null}

                                        {ratingNotification === 'success' ?
                                            <div className="alert  text-center alert-success" role="alert">
                                                {ratingNotificationMessage}
                                            </div> : null
                                        }
                                        {ratingNotification === 'error' ?
                                            <div className="alert text-center alert-danger" role="alert">
                                                {ratingNotificationMessage}
                                            </div> : null
                                        }



                                        {session.user.name === camp.user ?
                                            <div>
                                                <Link href={`/projects/yelpCamp/campground/${campId}/edit`} className="btn btn-secondary py-1">Edit Campground</Link>
                                                <button onClick={deleteCampgroundHandler} className="btn btn-dark py-1 ms-2">Delete Campground</button></div>
                                            : null
                                        }


                                    </div>
                                </div>


                            </div>
                            <div className='row pe-0'>
                                <div className='col-12 pe-0'>
                                    <div className="card px-0">

                                        <div className="card-body">

                                            <h6 className="card-title">Comments</h6>
                                        </div>
                                        {items ?
                                            <ul className="list-group list-group-flush">
                                                <InfiniteScroll
                                                    dataLength={items.length} //This is important field to render the next data
                                                    next={fetchData}
                                                    hasMore={hasMore}
                                                    loader={<h4 className="text-center ">Loading...</h4>}
                                                    endMessage={
                                                        <p className="text-center text-secondary">
                                                            <b>All comments are being displayed.</b>
                                                        </p>
                                                    }
                                                    scrollThreshold={.8}
                                                    height={scrollHeight}
                                                >

                                                    {items && items.map((data) => <CommentItem key={uuidv4()} deleteCommentHandler={updateCommentDeleteState} editCommentHandler={editCommentStateHandler} comment={data.comment} commentId={data.id} user={data.user.toLowerCase()} campCreator={camp.user} currUser={session.user.name} />)}
                                                </InfiniteScroll>

                                            </ul> : <h5 className='ms-3'>No comments have been made for this post.</h5>
                                        }

                                        <form onSubmit={commentCreateHandler}>
                                            <div className="input-group">
                                                <input type="text" className="form-control" name="comment" placeholder="Enter New Comment" minLength={1} min={1} />
                                                <button type='submit' className="btn btn-outline-success">Submit</button>
                                            </div>
                                        </form>

                                    </div>
                                    {commentValid === 'success' ?
                                        <div className="alert text-center  alert-success" role="alert">
                                            {commentValidMessage}
                                        </div> : null}

                                    {commentValid === 'error' ?
                                        <div className="alert  text-center alert-danger" role="alert">
                                            {commentValidMessage}
                                        </div> : null}


                                </div>
                            </div>


                        </div>

                    </div>

                </div>
            </>

        )
    }
    else {
        return (
            <>
                <style jsx global>
                    {
                        `body{background:rgb(249, 250, 251)}`
                    }
                </style>
                <div className={` px-0 bg-light`}>
                    <YelpNavBar session={session} />
                    {notification &&
                        <div className="alert text-center alert-success alert-dismissible fade show mb-0" role="alert">
                            {notification}
                            <button onClick={() => { dispatch(addNotification({ notification: null })) }} className="btn-close ms-auto"></button>
                        </div>}

                    <div className='container mt-2'>
                        <div className='row'>
                            <div className='col-12'>

                                <div className="card" >
                                    <div id="carouselCampground" className="carousel slide">
                                        <div className="carousel-inner">
                                            <div className="carousel-item active">
                                                <Image src={imgLink[0] ? imgLink[picIndex] : "/images_YelpCamp/noImg.jpg"} width={1294} height={500} className="d-block w-100" priority={true} alt={`camp photo`} />
                                            </div>
                                        </div>
                                        <button onClick={decrementImg} className="carousel-control-prev" type="button" data-bs-target="#carouselCampground" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>

                                        <button onClick={incrementImg} className="carousel-control-next" type="button" data-bs-target="#carouselCampground" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <h1 className="card-title">{camp.name.toUpperCase()}</h1>
                                        <p className="card-text  fs-4 fw-semibold">{camp.city.toLowerCase()}, {camp.state.toLowerCase()}</p>
                                        <p className="card-text  fs-4 fw-semibold">Price: ${camp.price}</p>
                                        <p className="card-text  fs-4 fw-semibold">Rating: {camp.rating} / 5</p>
                                        <p className="card-text fs-6 fw-semibold">{camp.description}</p>


                                    </div>
                                </div>


                            </div>
                            <div className='row pe-0'>
                                <div className='col-12 pe-0'>
                                    <div className="card">
                                     
                                        <div className="card-body">

                                            <h6 className="card-title">Comments</h6>
                                        </div>
                                        {items  ?
                                            <ul className="list-group list-group-flush">
                                                <InfiniteScroll
                                                    dataLength={items.length} //This is important field to render the next data
                                                    next={fetchData}
                                                    hasMore={hasMore}
                                                    loader={<h4 className="text-center ">Loading...</h4>}
                                                    endMessage={
                                                        <p className="text-center text-secondary">
                                                            <b>All comments are being displayed.</b>
                                                        </p>
                                                    }
                                                    scrollThreshold={1}
                                                    height={scrollHeight}
                                                >

                                                    {items && items.map((data) => <CommentItem key={uuidv4()} comment={data.comment} commentId={data.id} user={data.user} campCreator={camp.user} />)}
                                                </InfiniteScroll>



                                            </ul> : <h5 className='ms-3'>No comments have been made for this post.</h5>}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </>
        )
    }
}



export async function getServerSideProps(ctx) {
    const uri = `${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}`
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const session = await getSession({ req: ctx.req })
    const campId = ctx.params.campId
    await client.connect()
    const campground = client.db('yelpCamp').collection('campgrounds')
    const rating = client.db('yelpCamp').collection('ratings')
    const comments = client.db('yelpCamp').collection('comments')
    const foundCamp = await campground.findOne({ _id: ObjectID(campId) })
    let campComments = await comments.find({ campground: ObjectID(campId) })
    let foundRating = session ? await rating.findOne({ user: session.user.name, campground: ObjectID(campId) }) : false
    campComments = await campComments.toArray()
    campComments = campComments.length ? campComments.map((comment) => {
        let entry = { user: comment.user, comment: comment.comment, campground: comment.campground.toString(), id: comment._id.toString() }
        return entry
    }) : false
    foundCamp._id = foundCamp._id.toString()
    if (session && foundRating) {
        foundRating._id = foundRating._id.toString()
        foundRating.campground = foundRating.campground.toString()
        
    }

    client.close()



    if (!session) {
        return {
            props: {
                session: false,
                camp: foundCamp,
                campId: campId,
                commentsList: campComments,
                hasRating: foundRating

            }
        }
    }

    return {
        props: {
            session: session,
            camp: foundCamp,
            campId: campId,
            commentsList: campComments,
            hasRating: foundRating
        }
    }
}