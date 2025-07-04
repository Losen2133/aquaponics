import Header from './components/Header';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* This renders /dashboard, /about, etc. */}
      </main>
    </>
  );
}
