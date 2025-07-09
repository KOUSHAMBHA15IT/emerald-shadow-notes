
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Moon, Sun, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotesApp = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.map(note => 
        note.id === selectedNote.id 
          ? { ...note, title: editTitle || 'Untitled', content: editContent, updatedAt: new Date() }
          : note
      );
      setNotes(updatedNotes);
      setSelectedNote({ ...selectedNote, title: editTitle || 'Untitled', content: editContent });
      setIsEditing(false);
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const selectNote = (note: Note) => {
    if (isEditing) {
      saveNote();
    }
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
    }
    setIsEditing(false);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-300",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-emerald-50"
    )}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={cn(
          "w-80 backdrop-blur-xl border-r transition-all duration-300",
          isDarkMode
            ? "bg-black/20 border-emerald-800/30"
            : "bg-white/20 border-emerald-200/30"
        )}>
          {/* Header */}
          <div className={cn(
            "p-4 border-b backdrop-blur-sm",
            isDarkMode
              ? "border-emerald-800/30 bg-black/10"
              : "border-emerald-200/30 bg-white/10"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h1 className={cn(
                "text-xl font-semibold",
                isDarkMode ? "text-emerald-100" : "text-emerald-900"
              )}>
                Notes
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className={cn(
                    "p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105",
                    isDarkMode
                      ? "bg-emerald-800/20 hover:bg-emerald-700/30 text-emerald-200"
                      : "bg-emerald-200/20 hover:bg-emerald-300/30 text-emerald-800"
                  )}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={createNote}
                  className={cn(
                    "p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105",
                    isDarkMode
                      ? "bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-200"
                      : "bg-emerald-500/20 hover:bg-emerald-600/30 text-emerald-800"
                  )}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                isDarkMode ? "text-emerald-300" : "text-emerald-600"
              )} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg backdrop-blur-sm border transition-all duration-200 focus:outline-none focus:ring-2",
                  isDarkMode
                    ? "bg-black/20 border-emerald-800/30 text-emerald-100 placeholder-emerald-400 focus:ring-emerald-500/50"
                    : "bg-white/30 border-emerald-200/30 text-emerald-900 placeholder-emerald-600 focus:ring-emerald-500/50"
                )}
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className={cn(
                "p-8 text-center",
                isDarkMode ? "text-emerald-300" : "text-emerald-600"
              )}>
                <p>No notes found</p>
                <p className="text-sm mt-2 opacity-70">Create your first note to get started</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={cn(
                      "p-4 m-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm group",
                      selectedNote?.id === note.id
                        ? isDarkMode
                          ? "bg-emerald-700/30 border border-emerald-600/50"
                          : "bg-emerald-300/30 border border-emerald-400/50"
                        : isDarkMode
                          ? "bg-black/10 hover:bg-emerald-800/20 border border-transparent"
                          : "bg-white/10 hover:bg-emerald-200/20 border border-transparent"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "font-medium truncate",
                          isDarkMode ? "text-emerald-100" : "text-emerald-900"
                        )}>
                          {note.title}
                        </h3>
                        <p className={cn(
                          "text-sm mt-1 line-clamp-2",
                          isDarkMode ? "text-emerald-300" : "text-emerald-700"
                        )}>
                          {note.content || 'No content'}
                        </p>
                        <p className={cn(
                          "text-xs mt-2",
                          isDarkMode ? "text-emerald-400" : "text-emerald-600"
                        )}>
                          {note.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className={cn(
                          "p-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110",
                          isDarkMode
                            ? "text-red-400 hover:text-red-300"
                            : "text-red-600 hover:text-red-500"
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <>
              {/* Note Header */}
              <div className={cn(
                "p-4 border-b backdrop-blur-xl",
                isDarkMode
                  ? "bg-black/10 border-emerald-800/30"
                  : "bg-white/10 border-emerald-200/30"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className={cn(
                          "text-2xl font-bold bg-transparent border-none outline-none w-full",
                          isDarkMode ? "text-emerald-100" : "text-emerald-900"
                        )}
                        placeholder="Note title..."
                      />
                    ) : (
                      <h2 className={cn(
                        "text-2xl font-bold",
                        isDarkMode ? "text-emerald-100" : "text-emerald-900"
                      )}>
                        {selectedNote.title}
                      </h2>
                    )}
                    <p className={cn(
                      "text-sm mt-1",
                      isDarkMode ? "text-emerald-300" : "text-emerald-600"
                    )}>
                      Last updated: {selectedNote.updatedAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveNote}
                          className={cn(
                            "p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105",
                            isDarkMode
                              ? "bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-200"
                              : "bg-emerald-500/20 hover:bg-emerald-600/30 text-emerald-800"
                          )}
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className={cn(
                            "p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105",
                            isDarkMode
                              ? "bg-red-600/20 hover:bg-red-500/30 text-red-300"
                              : "bg-red-500/20 hover:bg-red-600/30 text-red-700"
                          )}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={startEditing}
                        className={cn(
                          "p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105",
                          isDarkMode
                            ? "bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-200"
                            : "bg-emerald-500/20 hover:bg-emerald-600/30 text-emerald-800"
                        )}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Note Content */}
              <div className="flex-1 p-4">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={cn(
                      "w-full h-full resize-none bg-transparent border-none outline-none text-lg leading-relaxed",
                      isDarkMode ? "text-emerald-100" : "text-emerald-900"
                    )}
                    placeholder="Start writing your note..."
                  />
                ) : (
                  <div className={cn(
                    "w-full h-full text-lg leading-relaxed whitespace-pre-wrap",
                    isDarkMode ? "text-emerald-100" : "text-emerald-900"
                  )}>
                    {selectedNote.content || (
                      <span className={cn(
                        "italic",
                        isDarkMode ? "text-emerald-400" : "text-emerald-600"
                      )}>
                        This note is empty. Click the edit button to add content.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className={cn(
                  "w-24 h-24 rounded-full backdrop-blur-xl mb-4 mx-auto flex items-center justify-center",
                  isDarkMode
                    ? "bg-emerald-700/20 border border-emerald-600/30"
                    : "bg-emerald-300/20 border border-emerald-400/30"
                )}>
                  <Edit3 className={cn(
                    "w-8 h-8",
                    isDarkMode ? "text-emerald-300" : "text-emerald-600"
                  )} />
                </div>
                <h3 className={cn(
                  "text-xl font-semibold mb-2",
                  isDarkMode ? "text-emerald-100" : "text-emerald-900"
                )}>
                  Select a note to view
                </h3>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-emerald-300" : "text-emerald-600"
                )}>
                  Choose a note from the sidebar or create a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
