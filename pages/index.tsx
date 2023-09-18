import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '@/components/Header'
import Featured from '@/components/Featured'
export default function Home() {
  return (
    <div>
      <Header/>
      <Featured/>
    </div>
  )
}
