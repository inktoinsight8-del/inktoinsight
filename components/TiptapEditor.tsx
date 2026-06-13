"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { TextAlign } from '@tiptap/extension-text-align'
import { Image } from '@tiptap/extension-image'

export default function TiptapEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      Image,
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
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 bg-white dark:bg-[#0F1117] rounded-b-lg',
      },
    },
  })

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="w-full border border-gray-200 dark:border-[#2A2D3A] rounded-lg overflow-hidden shadow-sm">
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-[#1A1D27] border-b border-gray-200 dark:border-[#2A2D3A] sticky top-0 z-10">
        
        {/* Font Family */}
        <select
          onChange={(event) => editor.chain().focus().setFontFamily(event.target.value).run()}
          className="px-2 py-1 text-sm border rounded bg-white dark:bg-[#0F1117] dark:border-[#2A2D3A]"
        >
          <option value="Inter">Inter</option>
          <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>

        {/* Text Color */}
        <input
          type="color"
          onInput={(event: any) => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="h-8 w-8 p-0 border-0 rounded cursor-pointer"
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 text-sm font-bold rounded transition-colors ${editor.isActive('bold') ? 'bg-[#4F6DF5] text-white' : 'bg-white dark:bg-[#0F1117] hover:bg-gray-200 dark:hover:bg-[#2A2D3A]'}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 text-sm italic rounded transition-colors ${editor.isActive('italic') ? 'bg-[#4F6DF5] text-white' : 'bg-white dark:bg-[#0F1117] hover:bg-gray-200 dark:hover:bg-[#2A2D3A]'}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 text-sm font-bold rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#4F6DF5] text-white' : 'bg-white dark:bg-[#0F1117] hover:bg-gray-200 dark:hover:bg-[#2A2D3A]'}`}
        >
          H2
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center"></div>

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`px-3 py-1.5 text-sm rounded transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#4F6DF5] text-white' : 'bg-white dark:bg-[#0F1117] hover:bg-gray-200 dark:hover:bg-[#2A2D3A]'}`}
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`px-3 py-1.5 text-sm rounded transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#4F6DF5] text-white' : 'bg-white dark:bg-[#0F1117] hover:bg-gray-200 dark:hover:bg-[#2A2D3A]'}`}
        >
          Center
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 text-sm rounded transition-colors ${editor.isActive('blockquote') ? 'bg-[#4F6DF5] text-white' : 'bg-white dark:bg-[#0F1117] hover:bg-gray-200 dark:hover:bg-[#2A2D3A]'}`}
        >
          Quote
        </button>
        
        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1.5 text-sm rounded transition-colors bg-white dark:bg-[#0F1117] hover:bg-gray-200 dark:hover:bg-[#2A2D3A]"
        >
          Image
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
