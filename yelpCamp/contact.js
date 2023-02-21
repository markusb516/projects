import YelpNavBar from "../../../components/projectYelpCamp/YelpNavbar"
import Image from "next/image"
import { getSession } from "next-auth/react"
import { useEffect } from "react"
import { addNotification } from "../../../redux/slices/yelpCampNotification"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
export default function ContactPage({ session }) {
    const notification = useSelector((state) => state.notificationsSlice.notification)
    const dispatch = useDispatch()

    useEffect(() => {
        if (notification) {
            setTimeout(() => {
                dispatch(addNotification({ notification: null }))
            },
                4000)
        }
    }, [notification,dispatch])


    return (
        <>
            <style jsx global>
                {
                    `body{background:rgb(249, 250, 251)}`
                }
            </style>
            <div className={` bg-light px-0 pb-5`}>
                <YelpNavBar session={session} />
                {notification &&
                    <div className="alert text-center alert-success alert-dismissible fade show  mb-0" role="alert">
                        {notification}
                        <button onClick={() => { dispatch(addNotification({ notification: null })) }} className="btn-close ms-auto"></button>
                    </div>}
                <div className="container mt-1">
                    <div className="card">
                        <Image
                            src={`/images_YelpCamp/yelpCamp_ContactIMG.jpg`}
                            width={1295}
                            height={400}
                            className={"card-img-top"}
                            alt={"Contact photo"}
                        />
                        <div className="card-body">
                            <h1 className="text-center card-title">Contact Us</h1>
                            <p className="card-text"><b>This is a project application with not real data and is for visual and interactive functionality to display my skills as a developer.
                                For any questions or inquiries please navigate to the &quot;Contact Me&quot; page in the main navigation bar. The rest of this description will be filled with lorem ipsum for filler. </b>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quo. Voluptates quae facilis eius quia ullam earum dolorum voluptatum mollitia natus aperiam nisi saepe, autem sit, quis non aliquam deleniti.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quo. Voluptates quae facilis eius quia ullam earum dolorum voluptatum mollitia natus aperiam nisi saepe, autem sit, quis non aliquam deleniti.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quo. Voluptates quae facilis eius quia ullam earum dolorum voluptatum mollitia natus aperiam nisi saepe, autem sit, quis non aliquam deleniti.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quo. Voluptates quae facilis eius quia ullam earum dolorum voluptatum mollitia natus aperiam nisi saepe, autem sit, quis non aliquam deleniti.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quo. Voluptates quae facilis eius quia ullam earum dolorum voluptatum mollitia natus aperiam nisi saepe, autem sit, quis non aliquam deleniti.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quo. Voluptates quae facilis eius quia ullam earum dolorum voluptatum mollitia natus aperiam nisi saepe, autem sit, quis non aliquam deleniti.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quo. Voluptates quae facilis eius quia ullam earum dolorum voluptatum mollitia natus aperiam nisi saepe, autem sit, quis non aliquam deleniti.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quo. Voluptates quae facilis eius quia ullam earum dolorum voluptatum mollitia natus aperiam nisi saepe, autem sit, quis non aliquam deleniti.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quo. Voluptates quae facilis eius quia ullam earum dolorum voluptatum mollitia natus aperiam nisi saepe, autem sit, quis non aliquam deleniti.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quo. Voluptates quae facilis eius quia ullam earum dolorum voluptatum mollitia natus aperiam nisi.
                            </p>

                        </div>
                    </div>

                    <div className="card" >
                        <div className="card-header fw-bold text-center">
                            Reach Us By
                        </div>
                        <ul className="list-group list-group-flush text-center">
                            <li className="list-group-item"><b>Email :</b> YelpCamp.contactus@yelpcamp.com</li>
                            <li className="list-group-item"><b>Phone :</b> +1 (305) 783-8998 </li>
                            <li className="list-group-item"><b>Mail :</b>  11 SW 1st Ave, Miami, FL 33130 </li>
                        </ul>
                    </div>



                </div>
            </div>
        </>
    )
}


export async function getServerSideProps(ctx) {
    const session = await getSession({ req: ctx.req })

    return {
        props: {
            session: session
        }
    }
}