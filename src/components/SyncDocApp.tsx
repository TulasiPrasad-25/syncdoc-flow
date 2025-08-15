import { useState } from "react";
import DocumentDashboard from "./DocumentDashboard";
import DocumentEditor from "./DocumentEditor";

interface Document {
  id: string;
  title: string;
  lastModified: Date;
  content: string;
}

type AppView = 'dashboard' | 'editor';

const SyncDocApp = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  const handleCreateDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: "Untitled Document",
      lastModified: new Date(),
      content: `<h1>Welcome to your new document!</h1>
        <p>Start typing to begin collaborating with your team in real-time.</p>
        <p>This is a powerful collaborative document editor that allows multiple users to work together seamlessly.</p>
        <h2>Features:</h2>
        <ul>
          <li>Real-time collaboration</li>
          <li>Rich text formatting</li>
          <li>Auto-save functionality</li>
          <li>User presence indicators</li>
        </ul>
        <p>Try formatting this text using the toolbar above!</p>`
    };
    setCurrentDocument(newDoc);
    setCurrentView('editor');
  };

  const handleOpenDocument = (doc: Document) => {
    setCurrentDocument(doc);
    setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentDocument(null);
  };

  const handleSaveDocument = (doc: Document) => {
    // In a real app, this would save to the database
    console.log('Saving document:', doc);
    setCurrentDocument(doc);
  };

  if (currentView === 'editor' && currentDocument) {
    return (
      <DocumentEditor
        document={currentDocument}
        onBack={handleBackToDashboard}
        onSave={handleSaveDocument}
      />
    );
  }

  return (
    <DocumentDashboard
      onCreateDocument={handleCreateDocument}
      onOpenDocument={handleOpenDocument}
    />
  );
};

export default SyncDocApp;