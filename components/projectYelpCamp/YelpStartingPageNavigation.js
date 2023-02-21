import styles from '../../styles/yelpCamp.module.css'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function YelpStartingPageNavBar({ session }) {

    const router = useRouter()

    async function signOutHandler(e) {
        e.preventDefault()
         signOut({callbackUrl: `${window.location.origin}/projects/yelpCamp`})
    }



    if (session) {

        return (

            <nav className="navbar navbar-expand-lg ">
                <div className="container-fluid">
                    <Link className={`navbar-brand text-light fs-1 fw-semibold ${styles.nav_brandLink}`} href={`/projects/yelpCamp/`}>YelpCamp</Link>
                    <button className=" navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup2" aria-controls="navbarNavAltMarkup2" aria-expanded="false" aria-label="Toggle navigation">
                        <span className=" navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup2">
                        <div className="navbar-nav ms-auto">
                            <Link className={`nav-link text-light fs-4 ${styles.nav_link}`} href={`/projects/yelpCamp/home`}>Home</Link>
                            <Link className={`nav-link text-light fs-4 ${styles.nav_link}`} href={`/projects/yelpCamp/mycampgrounds`}>My Campgrounds</Link>
                            <Link className={`nav-link text-light fs-4 ${styles.nav_link}`} href={`/projects/yelpCamp/contact`}>Contact</Link>
                            <Link onClick={signOutHandler} className={`nav-link text-light fs-4 ${styles.nav_link}`}  href={`/projects/yelpCamp`}>Logout</Link>
                        </div>
                    </div>
                </div>
            </nav >
        )
    }

    return (
        <nav className="navbar navbar-expand-lg ">
            <div className="container-fluid">
                <Link className="navbar-brand text-light fs-1 fw-semibold" href={`/projects/yelpCamp/`}>YelpCamp</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup2" aria-controls="navbarNavAltMarkup2" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup2">
                    <div className="navbar-nav ms-auto">
                        <Link className={`nav-link text-light fs-4 ${styles.nav_link}`} href={`/projects/yelpCamp/home`}>Home</Link>
                        <Link className={`nav-link text-light fs-4 ${styles.nav_link}`} href={`/projects/yelpCamp/contact`}>Contact</Link>
                        <Link className={`nav-link text-light fs-4 ${styles.nav_link}`} href={`/projects/yelpCamp/login`}>Login</Link>
                        <Link className={`nav-link text-light fs-4 ${styles.nav_link}`} href={`/projects/yelpCamp/signup`}>Signup</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}