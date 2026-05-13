import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import MovieDetail from './pages/MovieDetail';
import AnimeDetail from './pages/AnimeDetail';
import WatchPage from './pages/WatchPage';
import TMDBDetail from './pages/TMDBDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/tmdb/:id" element={<TMDBDetail />} />
        {/* Catch-all aliases */}
        <Route path="/movies" element={<Home />} />
        <Route path="/anime" element={<Home />} />
        <Route path="/series" element={<Home />} />
        <Route path="/mylist" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
