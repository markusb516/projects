
import YelpNavBar from '../../../components/projectYelpCamp/YelpNavbar'
import { useRef, useEffect, useState } from 'react'
import { getSession } from "next-auth/react"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { addNotification } from '../../../redux/slices/yelpCampNotification'
import * as yup from 'yup'

export default function LoginPage({ session }) {
    const username = useRef()
    const password = useRef()
    const router = useRouter()
    let formSchema = yup.object().shape({
        username: yup.string().min(4).max(30).required(),
        password: yup.string().min(8).max(15).required(),
        redirect: yup.boolean().required()
    })
    const [validation, setValidation] = useState(false)
    const [validationMessage, setValidationMessage] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        if (validation) {
            setTimeout(() => {
                setValidation(false)
            }, 4000)
        }

    }, [validation])

    async function formHandler(event) {
        event.preventDefault()
        const values = {
            redirect: false,
            username: username.current.value,
            password: password.current.value
        }

        try {
            const isValid = await formSchema.isValid(values)

            if (isValid) {
                const result = await signIn("credentials", values)
                if (result.error) {
                    setValidation(true)
                    setValidationMessage('could not log you in username or password incorrect')
                    throw new Error('Could not log user in')
                }
                else {
                    dispatch(addNotification({ notification: "User has been logged in" }))
                    router.replace('/projects/yelpCamp/home')
                }
            }
            else {
                setValidation(true)
                setValidationMessage('Invalid credentials')
                throw new Error('Invalid credentials')
            }

        }

        catch (err) {
            

        }
    }


    return (
        <>
            <style jsx global>
                {
                    `body{background:rgb(249, 250, 251)}`
                }
            </style>
            <div className={`px-0 pb-5`}>
                <YelpNavBar session={session} />
                <h1 className='text-center'>Login</h1>
                {validation &&
                    <div className=" container alert alert-danger text-center alert-dismissible show" role="alert">
                        {validationMessage}
                        <button onClick={() => { setValidation(false) }} type="button" className="btn-close"></button>
                    </div>}
                <div className='container border border-dark border-4 text-center w-50 mt-5 rounded-3'>
                    <form onSubmit={formHandler}>
                        <label className={`mb-3 mt-4 fw-semibold`} htmlFor={`username`}>Username</label>
                        <input ref={username} id={`username`} className='form-control text-center' maxLength={30} minLength={4} placeholder={`Username`} />
                        <label className={`mt-5 mb-3 fw-semibold`} htmlFor={`password`}>Password</label>
                        <input ref={password} type={"password"} id={`password`} className='form-control text-center' maxLength={15} minLength={8} placeholder={`Password`} />
                        <button className='mt-4 mb-5 btn btn-success'>Login User</button>
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