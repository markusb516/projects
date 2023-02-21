
import Link from "next/link"
import { signOut } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { addNotification } from "../../redux/slices/yelpCampNotification"


export default function YelpNavBar({ session, userId }) {
  
    const dispatch = useDispatch()
    function signOutHandler(e) {
        e.preventDefault()
        dispatch(addNotification({ notification: "User has been logged out" }))
        signOut()

    }



    if (session) {

        return (
            <nav className="navbar navbar-expand-lg bg-dark bg-gradient">
                <div className="container-fluid">
                    <Link className="navbar-brand text-light fs-3 fw-semibold" href={`/projects/yelpCamp/`}>YelpCamp</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup2" aria-controls="navbarNavAltMarkup2" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup2">
                        <div className="navbar-nav">
                            <Link className="nav-link text-light fs-5" href={`/projects/yelpCamp/home`}>Home</Link>
                            <Link className="nav-link text-light fs-5" href={`/projects/yelpCamp/mycampgrounds`}>My Campgrounds</Link>
                            <Link className="nav-link text-light fs-5" href={`/projects/yelpCamp/campground/create`}>Add New Campground</Link>
                            <Link className="nav-link text-light fs-5" href={`/projects/yelpCamp/contact`}>Contact</Link>
                            <Link className="nav-link text-light fs-5" href={`/projects/yelpCamp/user/${session.user.name}`}>Edit User</Link>
                            <Link onClick={signOutHandler} className="nav-link text-light fs-5" href={`/projects/yelpCamp/home`}>Logout</Link>
                        </div>
                    </div>
                </div>
            </nav>
        )

    }


    return (
        <nav className="navbar navbar-expand-lg bg-dark bg-gradient">
            <div className="container-fluid">
                <Link className="navbar-brand text-light fs-3 fw-semibold" href={`/projects/yelpCamp/`}>YelpCamp</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup2" aria-controls="navbarNavAltMarkup2" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup2">
                    <div className="navbar-nav">
                        <Link className="nav-link text-light fs-5" href={`/projects/yelpCamp/home`}>Home</Link>
                        <Link className="nav-link text-light fs-5" href={`/projects/yelpCamp/contact`}>Contact</Link>
                        <Link className={`nav-link text-light fs-5 `} href={`/projects/yelpCamp/signup`}>Signup</Link>
                        <Link className="nav-link text-light fs-5" href={`/projects/yelpCamp/login`}>Login</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

