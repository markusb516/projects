import MenuItem from './MenuItem.js'
import { v4 as uuidv4 } from 'uuid';

export default function Menu() {
    const data = [
        {id:1,item: "chicken parm" , price : 25.00, description: "chicken cutlet with fresh herbs and spices on top of pasta of your choice with our famous tomato sauce"},
        {id:2,item:"italian panini", price :  15.00 , description: "italian sausage with peppers and onions with our award wining secrete sauce"},
        {id:3,item: "cheese burger delux", price: 10.00, description:"fresh angus beef cheese burger with lettuce , tomatoes, and onions."},
        {id:4, item: "chicken ceasar salad", price:5.00, description:"fresh romaine lettuce, with cheese, chicken, and our homemade ceasar dressing"}
    ]
    

    return (
        <div >

            {data.map((menuItem)=><MenuItem key={uuidv4()} id = {menuItem.id} item = {menuItem.item} description = {menuItem.description} price = {menuItem.price} /> )}


        </div>
    )
}