"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { TextAlign } from '@tiptap/extension-text-align'
import { Image } from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading2, Heading3, List, ListOrdered, Quote, Image as ImageIcon,
  Undo, Redo 
} from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'

export default function TiptapEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      Image,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[1056px] w-[816px] mx-auto p-12 bg-white dark:bg-[#0F1117] shadow-lg border border-gray-200 dark:border-[#2A2D3A]',
      },
    },
  })

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ onClick, isActive, icon: Icon, disabled = false }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md transition-colors flex items-center justify-center ${disabled ? 'opacity-30 cursor-not-allowed' : isActive ? 'bg-[#EAF1FB] text-[#0B57D0] dark:bg-[#4F6DF5]/20 dark:text-[#4F6DF5]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2D3A]'}`}
    >
      <Icon size={18} />
    </button>
  )

  const Divider = () => <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center"></div>

  return (
    <div className="w-full flex flex-col bg-gray-100 dark:bg-[#1A1D27] rounded-xl border border-gray-200 dark:border-[#2A2D3A] overflow-hidden shadow-inner">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F9FBFD] dark:bg-[#0F1117] border-b border-gray-200 dark:border-[#2A2D3A] sticky top-0 z-10 shadow-sm">
        
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} />
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} />
        
        <Divider />

        <select
          onChange={(event) => editor.chain().focus().setFontFamily(event.target.value).run()}
          className="px-2 py-1.5 text-sm border-transparent hover:bg-gray-100 focus:bg-white rounded-md bg-transparent dark:text-white dark:hover:bg-[#2A2D3A] cursor-pointer outline-none transition-colors"
        >
          <option value="Inter">Inter</option>
          <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} />
        
        <div className="flex items-center mx-1 relative overflow-hidden rounded-md border border-gray-300 dark:border-gray-600 w-8 h-8 cursor-pointer hover:border-gray-400">
          <input
            type="color"
            onInput={(event: any) => editor.chain().focus().setColor(event.target.value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0"
            title="Text Color"
          />
        </div>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} />

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} />

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} />

        <Divider />
        
        <CldUploadWidget 
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset"} 
          options={{ maxFiles: 1 }}
          onSuccess={(result: any, { widget }) => {
            if (result.info?.secure_url) {
              editor.chain().focus().setImage({ src: result.info.secure_url }).run()
              widget.close()
            }
          }}
        >
          {({ open }) => (
            <ToolbarButton onClick={() => open()} icon={ImageIcon} />
          )}
        </CldUploadWidget>

      </div>
      
      {/* Editor Canvas Area */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#F3F4F6] dark:bg-[#12141C]">
        <EditorContent editor={editor} className="w-full max-w-[816px]" />
      </div>
    </div>
  )
}
