import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Admin from './components/Admin'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Reset from './components/Reset'
import { auth } from './firebase'

const App = () => {

  const [firebaseUser, setFirebaseUser] = React.useState(null)

  React.useEffect(() => {

    auth.onAuthStateChanged((user) => {
      if(user) {
        setFirebaseUser(user)
        console.log(user)
      } else {
        setFirebaseUser(false)
      }
    })

  }, [])

  return firebaseUser !== null ? (
      <Router>

        <Navbar firebaseUser={firebaseUser}/>

        <Switch>

          <Route path="/" exact>
            Inicio
          </Route>

          <Route path="/admin">
            <Admin />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/reset">
            <Reset />
          </Route>

        </Switch>

      </Router>
  ) : (
    <span>Cargando...</span>
  )
}

export default App
