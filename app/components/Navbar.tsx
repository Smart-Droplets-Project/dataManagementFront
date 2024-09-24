// app/components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav style={{ padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
            <ul style={{ display: 'flex', listStyle: 'none' }}>
                <li style={{ marginRight: '1rem' }}>
                    <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
                </li>
                <li style={{ marginRight: '1rem' }}>
                    <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
