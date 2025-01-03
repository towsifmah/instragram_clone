import React from 'react'
import Post from './Post'
import MinePrifile from './MinePrifile'

export default function Feed() {
  return (
    <main className='grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto'>
        <section className='col-span-2'>
            <Post/>
        </section>

        <section className='hidden md:inline-grid md:col-span-1'>
            <div className='w-[300px] fixed'>
            <MinePrifile/>
            </div>
        </section>
    </main>
  )
}
