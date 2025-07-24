import React from 'react'
import {Link} from "react-router/internal/react-server-client";

const NavBar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="uppercase text-2xl font-bold text-gradient">Resume</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>

        </nav>
    )
}
export default NavBar
