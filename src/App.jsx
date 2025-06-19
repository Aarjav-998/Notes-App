import React, { useState, useEffect } from 'react';
import { FaPlus, FaPen, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(storedNotes);
  }, []);

  const saveNotes = (newNotes) => {
    localStorage.setItem('notes', JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  const handleCreate = () => {
    if (!noteText.trim()) return;
    const newNotes = [...notes, { id: Date.now(), text: noteText }];
    saveNotes(newNotes);
    toast.success("Note created!");
    closePopup();
  };

  const handleUpdate = () => {
    const updatedNotes = notes.map(note =>
      note.id === editingNote.id ? { ...note, text: noteText } : note
    );
    saveNotes(updatedNotes);
    toast.info("Note Edited!");
    closePopup();
  };

  const handleDelete = (id) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    saveNotes(filteredNotes);
    toast.error("Note Deleted!");
  };

  const openPopup = (note = null) => {
    setEditingNote(note);
    setNoteText(note ? note.text : '');
    setShowPopup(true);
  };

  const closePopup = () => {
    setEditingNote(null);
    setNoteText('');
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#8c53ff] font-poppins">
      <div className="bg-white rounded-lg shadow-lg w-[827px] h-[600px] p-5 overflow-y-scroll">
        <h1 className="text-4xl font-bold text-purple-900 mb-5 drop-shadow-md text-center">Notes App</h1>

        <div className="flex">
          <div
            onClick={() => openPopup()}
            className="bg-gray-100 border border-gray-300 p-5 rounded-lg h-[200px] w-[200px] m-[10px] flex justify-center items-center text-4xl text-gray-300 cursor-pointer hover:bg-gray-200 transition"
          >
            <FaPlus className='text-lg' />
            <h1 className='text-lg'>Add Note</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          {notes.map(note => (
            <div key={note.id} className="bg-[#fff385] p-5 rounded-lg shadow-md h-[200px] flex flex-col justify-between">
              <span className="text-sm overflow-y-auto max-h-[120px] custom-scrollbar break-words whitespace-pre-wrap">
                {note.text}
              </span>
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => openPopup(note)}
                  className="bg-gray-300 text-white px-2 py-1 mx-1 rounded text-xs hover:bg-gray-400"
                >
                  <FaPen />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-purple-300 text-white px-2 py-1 mx-1 rounded text-xs hover:bg-purple-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg w-[400px] h-[350px] flex flex-col items-center justify-center">
              <h1 className="text-xl font-bold mb-2">{editingNote ? 'Edit Note' : 'New Note'}</h1>

              <div className="flex w-full justify-end mb-1 pr-4">
                <button
                  onClick={() => {
                    setNoteText(prev => prev + (prev.endsWith('\n') || prev === '' ? '• ' : '\n• '));
                  }}
                  className="text-sm text-purple-700 hover:underline"
                >
                  + Bullet
                </button>
              </div>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-[300px] h-[200px] p-2 border-2 border-purple-500 rounded resize-none whitespace-pre-wrap"
                placeholder="Type your note here..."
              ></textarea>

              <div className="flex mt-2">
                <button
                  onClick={editingNote ? handleUpdate : handleCreate}
                  className="bg-purple-600 text-white px-4 py-2 mx-2 rounded"
                >
                  {editingNote ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={closePopup}
                  className="bg-gray-400 text-white px-4 py-2 mx-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
