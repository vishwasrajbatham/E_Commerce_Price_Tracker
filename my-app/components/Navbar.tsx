import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const navIcons = [
    {src : '/assets/icons/search.svg', alt: 'searh'},
    {src : '/assets/icons/black-heart.svg', alt: 'heart'},
    {src : '/assets/icons/user.svg', alt: 'user'},
]

const Navbar = () => {
  return (
    <header className='w-full'>
        <nav className='nav'>
            <Link href="/" className='flex items-center gap-1'>
                <Image
                    src="/assets/icons/logo.svg"
                    width={27}
                    height={27}
                    alt='logo'
                />
                <p className='nav-logo'>
                    Price<span className='text-primary'>Wise</span>
                </p>
            </Link>

            <div className='flex items-center gap-2'>
                {navIcons.map((icon) => (
                    <Image
                        key={icon.alt}
                        src={icon.src}
                        alt={icon.alt}
                        width={28}
                        height={28}
                        className='object-contain'
                    />    
                ))}
            </div>
        </nav>
    </header>
  )
}

export default Navbar