
import YelpNavBar from '../../../components/projectYelpCamp/YelpNavbar'
import axios from 'axios'
import { useRef, useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { getSession } from "next-auth/react"
import { addNotification } from '../../../redux/slices/yelpCampNotification'
import * as yup from 'yup'

export default function SignUpPage() {
    const username = useRef()
    const password = useRef()
    const router = useRouter()
    let formSchema = yup.object().shape({
        username: yup.string().min(4).max(30).required(),
        password: yup.string().min(8).max(15).required()
    })
    const dispatch = useDispatch()
    const [validation, setValidation] = useState(null)
    const [validationMessage, setValidationMessage] = useState(null)

    useEffect(() => {
        if (validation) {
            setTimeout(() => {
                setValidation(false)
            }, 4000)
        }

    }, [validation])

    async function formHandler(event) {
        event.preventDefault()
        try {
            const values = { username: username.current.value, password: password.current.value }
            const isValid = await formSchema.isValid(values)
            if (isValid) {
                const data = await axios.post('/api/auth/signup', values)
                const result = await signIn("credentials", {
                    redirect: false,
                    username: username.current.value,
                    password: password.current.value
                })


                if (result.error) {
                    setValidationMessage('Unexpected error has occured please try again later')
                    setValidation('error')
                }
                else {
                    dispatch(addNotification({ notification: 'User has been created' }))
                    router.replace('/projects/yelpCamp/home')
                }


            }
            else {
                setValidationMessage('Invalid credentials entered')
                setValidation('error')
            }
        }

        catch (err) {
            setValidationMessage('Unexpected error')
            setValidation('error')
        }
    }

    return (
        <>
            <style jsx global>
                {
                    `body{background:rgb(249, 250, 251)}`
                }
            </style>
            <div className={` pb-5 px-0 `}>
                <YelpNavBar />
                <h1 className='text-center'>Create New User</h1>
                {validation === 'error' ?
                    <div className=" container alert alert-danger text-center alert-dismissible fade show" role="alert">
                        {validationMessage}
                        <button onClick={() => { setValidation(false) }} type="button" className="btn-close"></button>
                    </div> : null}
                <div className='container border border-dark border-4 text-center w-50 mt-5 rounded-3'>
                    <form onSubmit={formHandler}>
                        <label className={`mb-3 mt-4 fw-semibold`} htmlFor={`username`}>Username</label>
                        <input ref={username} id={`username`} className='form-control text-center' minLength={4} maxLength={30} placeholder={`Username`} />
                        <p className='mt-2'>Username must be no longer than 30 characters and at least 4 characters.</p>
                        <label className={`mt-5 mb-3 fw-semibold`} htmlFor={`password`}>Password</label>
                        <input ref={password} type={"password"} id={`password`} className='form-control text-center' minLength={8} maxLength={15} placeholder={`Password`} />
                        <p className='mt-2'>Password must be no longer than 15 characters and at least 8 characters.</p>
                        <button className='mt-4 mb-5 btn btn-success'>Create New User</button>
                    </form>
                </div>
            </div>
        </>
    )
}



export async function getServerSideProps(ctx) {
    const session = await getSession({ req: ctx.req })
    if (session) {
        return {
            redirect: {
                destination: '/projects/yelpCamp/home'
            }
        }
    }

    return {
        props: {
            session: false
        }
    }

}