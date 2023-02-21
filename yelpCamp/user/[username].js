import axios from "axios"
import { useRef, useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { getSession } from "next-auth/react"
import YelpNavBar from "../../../../components/projectYelpCamp/YelpNavbar"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import { addNotification } from "../../../../redux/slices/yelpCampNotification"
import { MongoClient, ServerApiVersion } from 'mongodb'
import * as yup from 'yup'
import { useSelector } from "react-redux"

export default function EditUserPage({ session, name }) {
    const notification = useSelector((state) => state.notificationsSlice.notification)
    const router = useRouter()
    const currPassword = useRef()
    const newPassword = useRef()
    const [validation, setValidation] = useState(null)
    const [validationMessage, setValidationMessage] = useState(null)
    const dispatch = useDispatch()
    const [changePassword, setChangePassword] = useState(true)
    let changePasswordSchema = yup.object().shape({
        username: yup.string().min(4).max(30).required(),
        currPassword: yup.string().min(8).max(15).required(),
        newPassword: yup.string().min(8).max(15).required()
    })

    let deleteUserSchema = yup.object().shape({
        username: yup.string().min(4).max(30).required(),
        currPassword: yup.string().min(8).max(15).required(),
        reenteredPassword: yup.string().min(8).max(15).required()
    })

    useEffect(() => {
        if (validation) {
            setTimeout(() => {
                setValidation(false)
            }, 3000)

        }

    }, [validation])

    async function formHandler(form) {
        form.preventDefault()
        try {
            if (changePassword) {
                const value = { username: name, currPassword: currPassword.current.value, newPassword: newPassword.current.value }
                const isValid = await changePasswordSchema.isValid(value)
                if (isValid) {
                    const response = await axios.patch('/api/auth/editUser', value
                    )
                    setValidation('success')
                    currPassword.current.value = null
                    newPassword.current.value = null
                    setValidationMessage(`User ${name} has been updated`)
                }
                else {
                    setValidation('error')
                    setValidationMessage('Invalid entry')
                }
            }
            else {
                if (currPassword.current.value === newPassword.current.value) {
                    const value = { currPassword: currPassword.current.value, reenteredPassword: newPassword.current.value, username: name }
                    const isValid = await deleteUserSchema.isValid(value)
                    if (isValid) {
                        const response = await axios.delete('/api/auth/deleteUser', {
                            data: value
                        })
                        dispatch(addNotification({ notification: 'User has been deleted' }))
                        signOut()
                    }
                    else {
                        setValidation('error')
                        setValidationMessage('Invalid entry')


                    }
                }
                else {

                    setValidation('error')
                    setValidationMessage('Passwords do not match')
                }
            }
        }

        catch (err) {

            if (err.response.data.message === "Incorrect password") {
                setValidation('error')
                setValidationMessage('Password is incorrect')
            }
            else {
                setValidation('error')
                setValidationMessage('Unexpected error')
            }

        }
    }

    if (session.user.name === name) {
        return (
            <div className={`container-fluid full  px-0 bg-light`}>

                <div className={`container-fluid px-0 pb-4  bg-light`}>
                    <YelpNavBar session={session} />
                    {notification &&
                        <div className="alert text-center  alert-success fade show  mb-0" role="alert">
                            {notification}
                        </div>}

                    <div className="container mt-3 text-center">
                        {validation === 'success' ?
                            <div className="alert  text-center alert-success alert-dismissible fade show" role="alert">
                                {validationMessage}
                                <button onClick={() => { setValidation(false); setValidationMessage(null) }} className="btn-close ms-auto" ></button>
                            </div> : null
                        }
                        {validation === 'error' ?
                            <div className="alert text-center  alert-danger alert-dismissible fade show" role="alert">
                                {validationMessage}
                                <button className="btn-close ms-auto" onClick={() => { setValidation(false); setValidationMessage(null) }}></button>
                            </div> : null
                        }

                        <h1 className="mb-5">Edit User : {name}</h1>
                        {changePassword ?
                            <h2>Change Password</h2> :
                            <h2>Delete Password</h2>
                        }
                        <form onSubmit={formHandler} className="formValidation mt-4">
                            <label htmlFor="currPassword" className="form-label fw-semibold">Current Password</label>
                            <input type="password" ref={currPassword} className="form-control mb-3 text-center border-dark" minLength={4} maxLength={30} id="currPassword" required />

                            <label htmlFor="newPassword" className="form-label fw-semibold">
                                {changePassword ? "New Password" : "Re-enter Password"}</label>
                            <input type="password" ref={newPassword} className="form-control mb-3 border-dark text-center" minLength={8} maxLength={15} id="newPassword" required />

                            <div className=" mb-3">

                                {changePassword ?
                                    <button className={`btn btn-success mt-3 px-4`}> Edit User</button> :
                                    <button className={`btn btn-danger mt-3 px-3`}>Delete User</button>
                                }
                            </div>
                        </form>

                        <div className=" mb-3">
                            {changePassword ?
                                <button onClick={() => { setChangePassword((e) => !e) }} className={`btn btn-danger mt-3 px-3`}>Delete User</button> :
                                <button onClick={() => { setChangePassword((e) => !e) }} className={`btn btn-success mt-3 px-4`}>Edit User</button>
                            }
                        </div>
                        <div>
                        </div>

                    </div>
                </div>


            </div>
        )
    }
    else {
        router.replace('/projects/yelpCamp/home')
    }
}


export async function getServerSideProps(ctx) {
    const session = await getSession({ req: ctx.req })
    const uri = `${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}`
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const users = client.db('yelpCamp').collection('users')
    if (session) {
        const foundUser = await users.findOne(ctx.query)

        return {
            props:
            {
                name: foundUser.username,
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