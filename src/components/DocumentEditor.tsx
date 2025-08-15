import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Save,
  Users,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Document {
  id: string;
  title: string;
  lastModified: Date;
  content: string;
}

interface DocumentEditorProps {
  document: Document;
  onBack: () => void;
  onSave: (doc: Document) => void;
}

const DocumentEditor = ({ document, onBack, onSave }: DocumentEditorProps) => {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [isSaving, setIsSaving] = useState(false);
  const [collaborators] = useState([
    { id: "1", name: "You", color: "bg-primary", isOnline: true },
    { id: "2", name: "John Doe", color: "bg-green-500", isOnline: true },
    { id: "3", name: "Jane Smith", color: "bg-purple-500", isOnline: false }
  ]);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave({
      ...document,
      title,
      content,
      lastModified: new Date()
    });
    setIsSaving(false);
  };

  const formatText = (command: string, value?: string) => {
    window.document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertList = (ordered: boolean) => {
    const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
    window.document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const alignText = (alignment: string) => {
    window.document.execCommand(`justify${alignment}`, false);
    editorRef.current?.focus();
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content !== document.content || title !== document.title) {
        handleSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [content, title, document.content, document.title]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-none bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Untitled Document"
            />
            <Badge variant="secondary" className="text-xs">
              {isSaving ? "Saving..." : "Saved"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Collaborators */}
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {collaborators.map((user) => (
                  <TooltipProvider key={user.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`relative w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-medium ring-2 ring-background`}>
                          {user.name.charAt(0)}
                          {user.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full ring-2 ring-background"></div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.name} {user.isOnline ? "(Online)" : "(Offline)"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
            
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary-hover">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b border-editor-border bg-editor-toolbar px-6 py-3">
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            {/* Text formatting */}
            <div className="flex items-center space-x-1 pr-4 border-r border-border">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => formatText('bold')}>
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Bold</p></TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => formatText('italic')}>
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Italic</p></TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => formatText('underline')}>
                    <Underline className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Underline</p></TooltipContent>
              </Tooltip>
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-1 pr-4 border-r border-border">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertList(false)}>
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Bullet List</p></TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertList(true)}>
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Numbered List</p></TooltipContent>
              </Tooltip>
            </div>

            {/* Alignment */}
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => alignText('Left')}>
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Align Left</p></TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => alignText('Center')}>
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Align Center</p></TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => alignText('Right')}>
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Align Right</p></TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex justify-center bg-muted/30">
        <div className="w-full max-w-4xl bg-editor-background mx-6 my-8 rounded-lg shadow-md border border-editor-border">
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[600px] p-12 text-foreground focus:outline-none text-base leading-relaxed"
            style={{ fontFamily: 'ui-serif, Georgia, serif' }}
            suppressContentEditableWarning={true}
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;