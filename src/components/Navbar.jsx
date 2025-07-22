import { appleImg, bagImg, searchImg } from '../utils'
import { navLists } from '../constants'

const Navbar = () => {
  return (
    <header
      className='w-full py-5 sm:px-10 px-5 flex 
    justify-between items-center'
    >
      <nav className='w-full flex screen-max-width'>
        <img
          src={appleImg}
          alt='apple'
          width={14}
          height={18}
          className='cursor-pointer'
        />
        <div className='flex flex-1 justify-center max-sm:hidden'>
          {navLists?.map(nav => (
            <div
              key={nav}
              className='px-5 text-sm cursor-pointer
            text-gray hover:text-white'
            >
              {nav}
            </div>
          ))}
        </div>

        <div
          className='flex justify-center 
        items-baseline gap-7 max-sm:flex-1 max-sm:justify-end'
        >
          <img
            src={searchImg}
            alt='search'
            width={18}
            height={18}
            className='cursor-pointer'
          />
          <img
            src={bagImg}
            alt='bag'
            width={18}
            height={18}
            className='cursor-pointer'
          />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
