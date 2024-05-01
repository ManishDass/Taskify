import React, { useState, useContext, useEffect, useId, useRef } from 'react'
import './Homepage.css'
import useHover from './useHover';
import DarkModeIcon from '../assets/svg/Moon.svg'
import LightModeIcon from '../assets/svg/Sun.svg'
// import PlusSign from '../assets/svg/PlusSign.svg'
import { ReactComponent as SearchIcon } from '../assets/svg/Search.svg'; // Import SVG as a React component
import { ReactComponent as PlusSign } from '../assets/svg/PlusSign.svg'; // Import SVG as a React component
import { ReactComponent as EditIcon } from '../assets/svg/Edit.svg'; // Import SVG as a React component
import { ReactComponent as DeleteIcon } from '../assets/svg/delete.svg'; // Import SVG as a React component
import { ReactComponent as EmptyImage } from '../assets/svg/empty.svg'; // Import SVG as a React component

const NewNoteModal = ({operationMode, onSave, onCancel, passedTitle: initialTitle, passedSubject:initialSubject }) => {
    const [title, setTitle] = useState(operationMode === 'edit' ? initialTitle : '');
    const [subject, setSubject] = useState(operationMode === 'edit' ? initialSubject : '');

        // Determine the placeholder text based on operationMode
        const titlePlaceholder = operationMode === 'edit' ? 'Update note title' : 'Note title';
        const subjectPlaceholder = operationMode === 'edit' ? 'Update your note...' : 'Input your note...';

    const handleSave = () => {
        if (title.trim() !== '') {
            onSave({ title, subject });
        }
    };

    return (
        <div className="modal">
            <div className='modal-wrapper'>
                <h1 style={{ textAlign: 'center' }}>{operationMode === 'edit' ? 'EDIT NOTE' : 'NEW NOTE'}</h1>
                {/* Set the placeholder dynamically */}
                <input type="text" className='modal-title' placeholder={titlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea className='modal-subject' placeholder={subjectPlaceholder} value={subject} onChange={(e) => setSubject(e.target.value)} />
                <div className='modal-button-wrapper'>
                    <button className='modal-button' onClick={onCancel}>CANCEL</button>
                    <button className='modal-button' onClick={handleSave}>{operationMode === 'edit' ? 'UPDATE' : 'APPLY'}</button>
                </div>
            </div>
        </div>
    );
};


const Homepage = () => {
    let [isDarkMode, setIsDarkMode] = useState('light')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlusSignRotated, setIsPlusSignRotated] = useState(false);
    const checkBoxRef = useRef([]);
    let [notes, setNotes] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        console.log(event.target.value)
    };

    // Filter notes based on search input
    // const filteredNotes = notes.filter(note => 
    //     note.title.toLowerCase().includes(searchInput.toLowerCase()));
    // console.log("Filtered Notes: ", filteredNotes)


    const filteredNotes = notes.filter(note => {
        console.log("Lenegth: ",searchInput.length)
        if(searchInput.length > 0) {
         return note.title.toLowerCase().includes(searchInput.toLowerCase());
        }
        else {
            return note;
        }
        });

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsPlusSignRotated(!isModalOpen); // Rotate PlusSign when modal is opened
    };

    function colorModeHandler() {
        setIsDarkMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            //console.log("NewMode: ", newMode)
            newMode === 'light' ? document.body.classList.toggle('dark-mode-body') : document.body.classList.toggle('light-mode-body');
            setTimeout(() => setIsDarkMode(newMode), 100); // Add a delay for smooth transition
            return prevMode; // Return the previous mode immediately
        });
    }


    function noteDeleteHandler(index) {
        let udpatedNotes = [...notes]
        udpatedNotes.splice(index, 1);
        setNotes(udpatedNotes)
        // console.log(notes)
    }

    function noteCheckboxHandler(index) {
        const h3Element = checkBoxRef.current[index].parentNode.querySelector('h3');

        h3Element.classList.toggle('strike-through');
    }

    const handleNewNoteSave = (newNote) => {
        setNotes((prevNotes) => [...prevNotes, newNote]);
        toggleModal();
    };

    //console.log('isModalOpen:', isModalOpen);

    useEffect(() => {
        //console.log("Fetching notes from localStorage...");
        const tempNotes = localStorage.getItem('notes');
        if (tempNotes) {
            //console.log("Notes found in localStorage:", tempNotes);
            setNotes(JSON.parse(tempNotes));
        } else {
            //console.log("No notes found in localStorage. Initializing with default notes.");
            setNotes([
                {
                    title: "Default Note",
                    subject: "This is a default note."
                }
            ]);
        }
    }, []);


    //console.log("Current notes state:", notes);



    useEffect(() => {
        saveNotesToLocalStorage(notes);
    }, [notes]);



    let saveNotesToLocalStorage = (updatedNotes) => {
        localStorage.setItem('notes', JSON.stringify(updatedNotes))
        //console.log(updatedNotes)
    }


    const [isEditHovered, editMouseEnter, editMouseLeave] = useHover(); //CustomHook
    const [isDeleteHovered, deleteMouseEnter, deleteMouseLeave] = useHover();

    return (
        <div className={`main-wrapper ${isDarkMode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
            <div className={`wrapper`}>
                <nav>
                    <section className='section-heading'>
                        <h1 style={{ color: isDarkMode === 'dark' ? 'white' : 'black' }}>TODO LIST</h1>
                    </section>

                    <section className='section-wrapper'>
                        <div className={`searchBar ${isDarkMode === 'dark' ? 'searchBar-dark' : 'searchBar-light'}`}>
                            <input className='search-input' type='search' placeholder='Search Note...' value={searchInput}
                                onChange={handleSearchInputChange} />
                            {/* <SearchIcon style={{ fill: '#6C63FF' }} className='searchIcon' /> */}
                            <SearchIcon style={{ fill: isDarkMode === 'dark' ? 'white' : '#6C63FF' }} className='searchIcon' />

                        </div>
                        <select className='note-category'>
                            <option value='ALL'>ALL</option>
                            <option value='IMPORTANT'>IMPORTANT</option>
                        </select>
                        <div className='mode-selection' onClick={() => colorModeHandler()}>
                            {
                                isDarkMode === 'light' ? <img alt='darkModeIcon' src={DarkModeIcon} className='drop' /> : <img alt='LightModeIcon' src={LightModeIcon} className='spin' />
                            }
                            {/* <img alt='darkModeIcon' src={DarkModeIcon}/> */}
                        </div>

                    </section>
                </nav>

                <main>
                    <section className='todo-list-section'>
                        {notes && notes.length > 0 ? (
                            <ul>
                                {
                                    filteredNotes.map((data, index) => (
                                        <div key={index}>
                                            <article className='note'>
                                                <div className="left">
                                                    <input
                                                        type='checkbox'
                                                        onClick={() => noteCheckboxHandler(index)}
                                                        ref={(el) => (checkBoxRef.current[index] = el)}
                                                    />

                                                    <h3>{data.title}</h3>
                                                </div>
                                                <div className="right">
                                                    <div className="edit-wrapper">
                                                        <EditIcon
                                                            src={EditIcon}
                                                            alt='editIcon'
                                                            className={isEditHovered ? 'edit-icon-hovered' : ''}
                                                            onMouseEnter={editMouseEnter}
                                                            onMouseLeave={editMouseLeave}
                                                            
                                                        />

                                                        
                                                    </div>
                                                    <div className="delete-wrapper">
                                                        <DeleteIcon
                                                            src={DeleteIcon}
                                                            alt='deleteIcon'
                                                            className={isDeleteHovered ? 'delete-icon-hovered' : ''}
                                                            onMouseEnter={deleteMouseEnter}
                                                            onMouseLeave={deleteMouseLeave}
                                                            onClick={(e) => noteDeleteHandler(e)}
                                                        />
                                                    </div>


                                                </div>
                                            </article>
                                            <hr />
                                        </div>
                                    ))
                                }
                            </ul>
                        ) : (<div className='empty-image'><EmptyImage alt='darkModeIcon' src={DarkModeIcon} /></div>)}


                    </section>

                    <section className="addNote-wrapper addNote-hover">
                        <PlusSign
                            src={PlusSign}
                            alt=""
                            className={`addNote ${isModalOpen ? 'rotate' : 'rotate-back'}`}
                            style={{ fill: 'white' }}
                            onClick={() => {
                                //console.log('Clicked on PlusSign');
                                toggleModal(); // Call toggleModal directly here
                            }}
                        />
                    </section>

                    {isModalOpen && (
                        <div className="modal-overlay">
                            <NewNoteModal operationMode={'input'} onSave={handleNewNoteSave} onCancel={toggleModal}/>
                        </div>
                    )}

                    {/* <button onClick={()=>{setNotes(prevNotes=>[...prevNotes, {title: "Hello",subject: "No"}])}} > CLick me </button> */}

                </main>
            </div>
        </div>
    )
}

export default Homepage