import styles from '../../styles/restaurant.module.css'


export default function CartInner({ count , refresh }) {  
    return (

        <div className={!refresh ? `${styles.cartAmtBody} rounded-4` : `${styles.cartAmtBodyHidden} rounded-4` }>
            <h3 className="mt-2">
                {count}
            </h3>
        </div>




    )
}