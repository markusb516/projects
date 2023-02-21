import { useState } from "react";
import axios from "axios";

export default function CommentItem({ comment, user, currUser, deleteCommentHandler, editCommentHandler, campCreator, commentId }) {
    const [editCommentForm, setEditCommentForm] = useState(false)
    const [stateComment, setStateComment] = useState(comment)



    async function deleteCommentFormHandler(e) {
        e.preventDefault()
        try {

            const response = await axios.delete("/api/campground/comment/delete", { data: { commentId: commentId } })
            deleteCommentHandler(commentId)

        }
        catch (err) {

        }
    }

    async function editCommentFormHandler(e) {
        e.preventDefault()
        try {
            const response = await axios.patch("/api/campground/comment/edit", { commentId: commentId, comment: e.target[0].value, user: user })

            setStateComment(e.target[0].value)
            editCommentHandler(commentId, e.target[0].value)
            e.target[0].value = ''
            setEditCommentForm(false)


        }
        catch (err) {
        }
    }



    if (currUser === user) {
        return (

            <li className="list-group-item py-4">
                <p className="d-inline">{stateComment}</p>

                <button onClick={() => { setEditCommentForm((state) => !state) }} className='ms-3 py-0  px-1 btn btn-secondary'>Edit Comment</button>
                <form className="d-inline">
                    <button onClick={deleteCommentFormHandler} className='ms-3 py-0 px-1 btn btn-dark'>Delete Comment</button>
                </form>
                <p className="d-inline float-end text-secondary" >User: {user.toLowerCase()}</p>
                {editCommentForm && <form onSubmit={editCommentFormHandler}>
                    <div className="input-group">
                        <input type="text" className="form-control" name="comment" placeholder="Enter New Comment" aria-label="Recipient's username" aria-describedby="button-addon2" />
                        <button className="btn btn-outline-success">Submit</button>
                    </div>
                </form>}

            </li>

        )
    }
    else if (currUser === campCreator) {
        return (

            <li className="list-group-item py-4">
                <p className="d-inline">{stateComment}</p>
                <form className="d-inline">
                    <button onClick={deleteCommentFormHandler} className='ms-3 py-0 px-1 btn btn-dark'>Delete Comment</button>
                </form>
                <p className="d-inline float-end text-secondary" >User: {user.toLowerCase()}</p>
            </li>

        )

    }

    else {

        return (

            <li className="list-group-item py-4">
                <p className="d-inline">{comment}</p>
                <p className="d-inline float-end text-secondary" >User: {user.toLowerCase()}</p>
            </li>

        )
    }
} 