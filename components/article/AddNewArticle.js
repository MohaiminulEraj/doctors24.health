import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import ButtonLoader from '@/components/layout/ButtonLoader'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';

import { newArticle, clearErrors } from '@/redux/actions/articleActions'
import { NEW_ARTICLE_RESET } from '@/redux/constants/articleConstants'
import Link from 'next/link'
import styles from '@/styles/Form.module.css'

const AddNewArticle = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [values, setValues] = useState({
        title: '',
        department: '',
        description: '',
        causes: '',
        stages: '',
        consequences: '',
        remediesAndTreatments: '',
        faq: '',
        prevention: '',
        adverse: '',
        sideEffect: '',
        diagnosis: '',
        symptoms: '',
        docId: '',
        refLink: '',
        author: '',
        authorUserId: '',
    })
    const { title, department, description, causes, stages, consequences, remediesAndTreatments, faq, prevention, adverse, sideEffect, diagnosis, symptoms, docId, refLink, authorUserId } = values
    const [description_file, setDescription_file] = useState([])
    const [stages_file, setStages_file] = useState([])
    const [remedies_file, setRemedies_file] = useState([])

    const { user } = useSelector(state => state.loadedUser)
    const { loading, error, success } = useSelector(state => state.newArticle)

    useEffect(() => {

        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }

        if (success) {
            router.push('/me/publications/pending-articles')
            dispatch({ type: NEW_ARTICLE_RESET })
        }

    }, [dispatch, error, success])

    const handleSubmit = (e) => {
        e.preventDefault();

        const articleData = {
            title,
            department,
            description,
            description_file,
            causes,
            stages,
            stages_file,
            consequences,
            remediesAndTreatments,
            remedies_file,
            faq,
            prevention,
            adverse,
            sideEffect,
            diagnosis,
            symptoms,
            docId,
            refLink,
            draftArticle: false,
            author: user?._id,
            authorUserId: user?.username,
        }
        dispatch(newArticle(articleData))
    }

    const handleDraft = (e) => {
        const articleData = {
            title,
            department,
            description,
            description_file,
            causes,
            stages,
            stages_file,
            consequences,
            remediesAndTreatments,
            remedies_file,
            faq,
            prevention,
            adverse,
            sideEffect,
            diagnosis,
            symptoms,
            docId,
            refLink,
            draftArticle: true,
            author: user?._id,
            authorUserId: user?.username,
        }
        dispatch(newArticle(articleData))
        toast.success('Article Saved to Draft!')
        // setTimeout(function () {
        //     router.push('/me/publications/draft-articles')
        // }, 1000)
        // router.push('/me/publications/draft-articles')
    }

    const handleInputChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setDescription_file([]);
            setStages_file([]);
            setRemedies_file([]);

            files.forEach(file => {

                const reader = new FileReader();

                reader.onload = () => {
                    if (reader.readyState === 2) {
                        setDescription_file(oldArray => [...oldArray, reader.result]);
                        setStages_file(oldArray => [...oldArray, reader.result]);
                        setRemedies_file(oldArray => [...oldArray, reader.result]);
                    }
                }

                reader.readAsDataURL(file)

            })
        }

    }
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className="text-center">Create Article</h1>
            <div className={styles.grid}>
                <div>
                    <input type="text" id="title" name="title" value={title} onChange={handleInputChange} placeholder="Enter Title..." required />
                </div>
                <div>
                    <input type="text" id="department" name="department" value={department} onChange={handleInputChange} placeholder="Enter Department..." required />
                </div>
                <div>
                    <textarea type="text" id="description" name="description" value={description} onChange={handleInputChange} placeholder="Enter Description" required></textarea>
                </div>
                <div className={styles.grid}>
                    <div className={styles.files}>
                        <input type="file" name="description_file" onChange={handleInputChange} multiple />
                    </div>
                    <div>
                        <textarea type="text" id="causes" name="causes" value={causes} onChange={handleInputChange} placeholder="Enter Causes" required></textarea>
                    </div>
                </div>
                <div>
                    <textarea type="text" id="stages" name="stages" value={stages} onChange={handleInputChange} placeholder="Enter Stages" required></textarea>
                </div>
                <div className={styles.grid}>
                    <div className={styles.files}>
                        <input type="file" name="stages_file" onChange={handleInputChange} multiple />
                    </div>
                    <div>
                        <textarea type="text" id="consequences" name="consequences" value={consequences} onChange={handleInputChange} placeholder="Enter consequences" required></textarea>
                    </div>
                </div>
                <div>
                    <textarea type="text" id="remediesAndTreatments" name="remediesAndTreatments" value={remediesAndTreatments} onChange={handleInputChange} placeholder="Enter remedies and treatments" required></textarea>
                </div>
                <div className={styles.grid}>
                    <div className={styles.files}>
                        <input type="file" name="remedies_file" onChange={handleInputChange} multiple />
                    </div>
                    <div>
                        <textarea type="text" id="faq" name="faq" value={faq} onChange={handleInputChange} placeholder="Frequently asked questions and answers" required></textarea>
                    </div>
                </div>
                <div>
                    <textarea type="text" id="prevention" name="prevention" value={prevention} onChange={handleInputChange} placeholder="Enter prevention" required></textarea>
                </div>
                <div className={styles.grid}>
                    <div>
                        <textarea type="text" id="adverse" name="adverse" value={adverse} onChange={handleInputChange} placeholder="Enter adverse" required></textarea>
                    </div>
                    <div>
                        <textarea type="text" id="sideEffect" name="sideEffect" value={sideEffect} onChange={handleInputChange} placeholder="Enter medication and side effect" required></textarea>
                    </div>
                </div>
                <div>
                    <input type="text" id="diagnosis" name="diagnosis" value={diagnosis} onChange={handleInputChange} placeholder="Enter diagnosis..." required />
                </div>
                <div>
                    <input type="text" id="symptoms" name="symptoms" value={symptoms} onChange={handleInputChange} placeholder="Enter symptoms..." required />
                </div>
                <div className={styles.grid}>
                    <div>
                        <input type="text" value={user?.username} name="authorUserId" placeholder="User ID" disabled />
                    </div>
                    <div>
                        <input type="text" id="docId" name="docId" value={docId} onChange={handleInputChange} placeholder="Doctor ID" required />
                    </div>
                </div>
                <div>
                    <input type="text" id="refLink" name="refLink" value={refLink} onChange={handleInputChange} placeholder="Reference Link (if any)" />
                </div>
            </div>
            {/* <div style={{ marginTop: '6px' }}>
                    <input type="button" value="Save as Draft" className='btn-secondary' />
                </div> */}
            <div className="row my-4">
                <div className="col text-center">
                    <button type="button" onClick={handleDraft} style={{ paddingInline: '31px' }} className="btn btn-primary mb-2 mx-4" disabled={loading ? true : false} >{loading ? <ButtonLoader /> : 'SAVE AS DRAFT'} </button>
                    <button type="submit" className="btn btn-danger mb-2 mx-4" disabled={loading ? true : false} >{loading ? <ButtonLoader /> : 'SUBMIT FOR REVIEW'} </button>
                    {/* <input type="submit" value="SUBMIT FOR REVIEW" className='btn-danger' /> */}
                </div>
            </div>
        </form>
    )
}

export default AddNewArticle;

