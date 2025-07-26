import React, { useState } from 'react';
import DraggableNote from './DraggableNote';
import { AnalysisCanvasProps, Note } from '../types';

const AnalysisCanvas: React.FC<AnalysisCanvasProps> = ({ result, onReset }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const initialNotes: Note[] = [];
    let noteId = 0;

    result.categories.forEach((category, categoryIndex) => {
      category.notes.forEach((noteContent, noteIndex) => {
        const note: Note = {
          id: `note-${noteId++}`,
          content: noteContent,
          x: 100 + (categoryIndex * 250) + (noteIndex * 20),
          y: 200 + (noteIndex * 60),
          category: category.name,
          type: category.score >= 80 ? 'positive' : category.score >= 60 ? 'suggestion' : 'negative'
        };
        initialNotes.push(note);
      });
    });

    return initialNotes;
  });

  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleNoteEdit = (noteId: string, content: string) => {
    setEditingNote(noteId);
    setEditContent(content);
  };

  const saveNoteEdit = () => {
    if (editingNote) {
      setNotes(prev => prev.map(note => 
        note.id === editingNote 
          ? { ...note, content: editContent }
          : note
      ));
      setEditingNote(null);
      setEditContent('');
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const addNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content: 'New note',
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 300,
      category: 'Custom',
      type: 'suggestion'
    };
    setNotes(prev => [...prev, newNote]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-500/50 bg-green-500/10';
      case 'negative': return 'border-red-500/50 bg-red-500/10';
      case 'suggestion': return 'border-yellow-500/50 bg-yellow-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header with Overall Score */}
      <div className="flex justify-between items-center">
        <div className="glass-card p-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Overall Score</div>
            <div className={`text-4xl font-bold ${getScoreColor(result.overall_score)}`}>
              {result.overall_score}
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={addNote}
            className="button-secondary"
          >
            Add Note
          </button>
          <button
            onClick={onReset}
            className="button-primary"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Category Scores */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6">Category Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.categories.map((category, index) => (
            <div key={index} className="bg-secondary/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{category.name}</h3>
                <span className={`font-bold ${getScoreColor(category.score)}`}>
                  {category.score}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{category.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6">Interactive Notes Board</h2>
        <div 
          className="relative bg-secondary/20 rounded-lg overflow-hidden"
          style={{ height: '600px', minHeight: '600px' }}
        >
          {notes.map((note) => (
            <DraggableNote
              key={note.id}
              defaultPosition={{ x: note.x, y: note.y }}
              onDrag={(position) => {
                setNotes(prev => prev.map(n => 
                  n.id === note.id 
                    ? { ...n, x: position.x, y: position.y }
                    : n
                ));
              }}
              className={`w-48 ${getNoteTypeColor(note.type)} note-card`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    {note.category}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleNoteEdit(note.id, note.content)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                {editingNote === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-background/50 border border-border rounded px-2 py-1 text-xs resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={saveNoteEdit}
                        className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNote(null)}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{note.content}</p>
                )}
              </div>
            </DraggableNote>
          ))}
          
          {notes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">No notes yet</p>
                <p className="text-sm">Click "Add Note" to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisCanvas;