import YelpStartingPageNavBar from '../../../components/projectYelpCamp/YelpStartingPageNavigation'
import YelpStartingPageOpener from '../../../components/projectYelpCamp/YelpStartingPageOpener'
import { getSession } from "next-auth/react"
import { useEffect } from 'react';
import $ from 'jquery'

export default function  YelpCamp({ session }) {

    useEffect(() => {
        $('#main').fadeIn(1000)
    }, []);

    return (
        <>
            <style jsx global>
                {
                    `body{
                         background-image: url('/images_YelpCamp/campingBackground.jpg');background-size: cover;
                         background-repeat: no-repeat;
                         background-position: 10%;
                         background-color:rgb(28, 28, 44)
                         
                        }`
                }
            </style>
            <div className={`container`} id="main">
                <YelpStartingPageNavBar session={session} />
                <YelpStartingPageOpener />
            </div>
        </>

    )
}

export async function getServerSideProps(ctx) {
    let session = await getSession({ req: ctx.req })
    if (session) {
        return {
            props: {
                session: session
            }
        }
    }

    return {
        props: {
            session: false
        }
    }


}