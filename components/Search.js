import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import dbConnect from '@/config/dbConnect'
import { FaFileMedical, FaUserMd } from 'react-icons/fa'
import SearchResults from './SearchResults'
import styles from '@/styles/Search.module.css'
import axios from 'axios';

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [articleStatus, setArticleStatus] = useState(true);
    const [docStatus, setDocStatus] = useState(false);
    const [placeholder, setPlaceholder] = useState('Articles...');

    useEffect(() => {
        const getResults = async () => {
            if (searchTerm === '') {
                setSearchResults([])
            } else {
                const res = await axios.get(`/api/articles/published?location=${searchTerm}&articleStatus=${articleStatus}`)
                setSearchResults(res.data.articles)
            }
        }

        getResults()
    }, [searchTerm, articleStatus])

    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const checkRadio = (e) => {
        if (e.target.value === 'article') {
            setPlaceholder('Articles...')
            setArticleStatus(true);
            setDocStatus(false);
        } else {
            setPlaceholder('Doctors...')
            setDocStatus(true);
            setArticleStatus(false);
        }
        setSearchTerm('');
    };

    const onClick = (e) => {
        document.getElementById("search_elem").style.position = 'relative';
        document.getElementById("search_elem").style.top = '-144px';
    };

    return (
        <div className='container' id="search_elem">
            <input type="radio" id="searchArticle" onChange={checkRadio} value="article" name="type" checked={articleStatus} style={{ display: 'none' }} /> <label className="mb-2 cursor-pointer" htmlFor="searchArticle"> <FaFileMedical style={{ color: articleStatus && 'red' }} icon="spinner" size={45} role="button" /> </label>
            <input type="radio" id="searchDoc" onChange={checkRadio} value="doctor" name="type" checked={docStatus} style={{ display: 'none' }} /> <label className="mb-2" htmlFor="searchDoc"> <FaUserMd style={{ color: docStatus && 'red' }} size={45} role="button" /></label>
            <br />
            <div className={styles.search}>

                <form onSubmit={handleSubmit}>
                    <input type="text" name="" onClick={onClick} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={`Search ${placeholder}`} />
                </form>
                <SearchResults val={searchTerm} results={searchResults} />

            </div>
        </div>
    )
}