import Link from 'next/link'
import styles from '../../styles/yelpCamp.module.css'
export default function YelpStartingPageOpener() {



    return (

        <div className={`container mt-md-5 pt-md-5 text-center`}>
            <h2 className={`text-light display-4 fw-semibold`}>YelpCamp</h2>
                <p className={`text-light mb-0  fs-2`}>Welcome to YelpCamp!</p>
                <p className={`text-light mb-0 fs-4`}>jump right in and explore our many campgrounds.</p>
                <p className={`text-light fs-4`}>Feel free to share some of your own and comment on others!</p>
            <Link href={`/projects/yelpCamp/home`}>
                <button className='btn btn-light fs-4 fw-semibold'>View campgrounds</button>
            </Link>
        </div>
    )
}