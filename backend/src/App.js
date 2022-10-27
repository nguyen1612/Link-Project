import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Register from './component/register/register'
import Logout from './component/logout'
import Dashboard from './component/dashboard/dashboard'
import Create from './component/create/create'
import Edit from './component/edit/edit'

// import Detail from './component/detail/detail'
import Detail from './component/detail_3/detail'

import Error from './component/error'
import Protected from './component/protected'

function App() {
  return (
    <Router>
      <Routes>

        <Route path='/register' element={<Register/>}/>

        <Route element={<Protected/>}>
          <Route path='/' element={<Dashboard/>}>
            <Route path='/page/:pageNum' element={<Dashboard/>} />
          </Route>
          <Route path="/create" element={<Create/>} />
          <Route path="/edit" element={<Edit/>} />
          <Route path='doc/:docId' element={<Detail/>} />
          <Route path='/logout' element={<Logout/>} />
        </Route>

        <Route path="*" element={<Error/>} />

      </Routes>
    </Router>
  );
}

export default App;
