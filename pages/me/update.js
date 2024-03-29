import React from 'react'
import EditProfile from '@/components/user/EditProfile'
import Layout from '@/components/layout/Layout'
import { getSession } from 'next-auth/client'

const updateProfilePage = () => {
    return (
        <Layout title="Update Profile">
            <EditProfile />
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

export default updateProfilePage
