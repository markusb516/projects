import { homePageImgSizing } from "../../utilites/utilities"
import Image from "next/image"
import { useRef } from "react"
export default function CheckBox({ image,  }) {
    const checkbox = useRef()
    

    return (
        <div className="d-inline">
            <input id={'checkbox'} ref={checkbox} value={image} className="me-3 form-check-input" type={"checkbox"} />
            <Image
                width={300}
                height={300}
                src={homePageImgSizing(image)}
                className={`me-5`}
                alt={`camp image`}

            />
        </div>


    )
}