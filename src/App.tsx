import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Formulas from './pages/Formulas'
import Practice from './pages/Practice'
import Search from './pages/Search'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/m/:id" element={<Lesson />} />
          <Route path="/m/:id/:section" element={<Lesson />} />
          <Route path="/formulas" element={<Formulas />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
