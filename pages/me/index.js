import React from 'react'
import MyProfile from '@/components/user/MyProfile'
import HomeProfile from '@/components/user/HomeProfile'
import Layout from '@/components/layout/Layout'
import { getSession } from 'next-auth/client'

const myProfilePage = () => {
    return (
        <Layout title="My Profile">
            <MyProfile />
            <HomeProfile />
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });
    if (!session) {
        return {
            redirect: {
                destination: "/account/login",
                permanent: false
            }
        }
    }
    return {
        props: { session }
    }
}

export default myProfilePage
