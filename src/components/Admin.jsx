import React from 'react'
import Tareas from './Tareas'
import {withRouter} from 'react-router-dom'
import { auth } from '../firebase'

const Admin = (props) => {

    const [user, setUser] = React.useState('')

    React.useEffect(() => {
        if (auth.currentUser) {
            setUser(auth.currentUser)
            console.log('Existe un usuario')
        } else {
            props.history.push('login')
            console.log('No existe usuario')
        }
    }, [props.history])

    return (
        <div>
            {
                user ? (
                    <Tareas user={user}/>
                ) : (
                    null
                )
            }
            
        </div>
    )
}

export default withRouter(Admin)
