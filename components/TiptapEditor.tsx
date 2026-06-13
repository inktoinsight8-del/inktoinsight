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

// Catalog of 100 carefully selected fonts
const FONTS_CATALOG = [
  // System / Defaults
  { name: "Default (Inter)", value: "Inter" },
  { name: "Serif", value: "serif" },
  { name: "Monospace", value: "monospace" },
  { name: "Comic Sans", value: "Comic Sans MS, Comic Sans" },

  // Sans-Serif (30 fonts)
  { name: "Roboto", value: "Roboto" },
  { name: "Open Sans", value: "Open Sans" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Poppins", value: "Poppins" },
  { name: "Lato", value: "Lato" },
  { name: "Oswald", value: "Oswald" },
  { name: "Nunito", value: "Nunito" },
  { name: "Rubik", value: "Rubik" },
  { name: "Work Sans", value: "Work Sans" },
  { name: "DM Sans", value: "DM Sans" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
  { name: "Outfit", value: "Outfit" },
  { name: "Satoshi", value: "Satoshi" },
  { name: "Public Sans", value: "Public Sans" },
  { name: "Ubuntu", value: "Ubuntu" },
  { name: "Kanit", value: "Kanit" },
  { name: "Heebo", value: "Heebo" },
  { name: "Mukta", value: "Mukta" },
  { name: "Prompt", value: "Prompt" },
  { name: "Barlow", value: "Barlow" },
  { name: "Cabin", value: "Cabin" },
  { name: "Karla", value: "Karla" },
  { name: "Manrope", value: "Manrope" },
  { name: "Arimo", value: "Arimo" },
  { name: "Quicksand", value: "Quicksand" },
  { name: "Urbanist", value: "Urbanist" },
  { name: "Inter Tight", value: "Inter Tight" },
  { name: "Barlow Condensed", value: "Barlow Condensed" },
  { name: "Noto Sans Display", value: "Noto Sans Display" },
  { name: "Sora", value: "Sora" },

  // Serif (25 fonts)
  { name: "Playfair Display", value: "Playfair Display" },
  { name: "Merriweather", value: "Merriweather" },
  { name: "Lora", value: "Lora" },
  { name: "PT Serif", value: "PT Serif" },
  { name: "Noto Serif", value: "Noto Serif" },
  { name: "EB Garamond", value: "EB Garamond" },
  { name: "Crimson Text", value: "Crimson Text" },
  { name: "Georgia", value: "Georgia" },
  { name: "Baskerville", value: "Baskerville" },
  { name: "Cardo", value: "Cardo" },
  { name: "Libre Baskerville", value: "Libre Baskerville" },
  { name: "Arvo", value: "Arvo" },
  { name: "Josefin Slab", value: "Josefin Slab" },
  { name: "Bitter", value: "Bitter" },
  { name: "DM Serif Display", value: "DM Serif Display" },
  { name: "Fraunces", value: "Fraunces" },
  { name: "Cinzel", value: "Cinzel" },
  { name: "Cormorant Garamond", value: "Cormorant Garamond" },
  { name: "Domine", value: "Domine" },
  { name: "Prata", value: "Prata" },
  { name: "Playfair", value: "Playfair" },
  { name: "Noto Serif Display", value: "Noto Serif Display" },
  { name: "Crimson Pro", value: "Crimson Pro" },
  { name: "Old Standard TT", value: "Old Standard TT" },
  { name: "Lustria", value: "Lustria" },

  // Monospace (15 fonts)
  { name: "Fira Code", value: "Fira Code" },
  { name: "Source Code Pro", value: "Source Code Pro" },
  { name: "JetBrains Mono", value: "JetBrains Mono" },
  { name: "Inconsolata", value: "Inconsolata" },
  { name: "Roboto Mono", value: "Roboto Mono" },
  { name: "Space Mono", value: "Space Mono" },
  { name: "Share Tech Mono", value: "Share Tech Mono" },
  { name: "VT323", value: "VT323" },
  { name: "Ubuntu Mono", value: "Ubuntu Mono" },
  { name: "Anonymous Pro", value: "Anonymous Pro" },
  { name: "Courier Prime", value: "Courier Prime" },
  { name: "Cutive Mono", value: "Cutive Mono" },
  { name: "Share Tech", value: "Share Tech" },
  { name: "Fira Mono", value: "Fira Mono" },
  { name: "Nova Mono", value: "Nova Mono" },

  // Display / Handwriting / Creative (26 fonts)
  { name: "Pacifico", value: "Pacifico" },
  { name: "Lobster", value: "Lobster" },
  { name: "Caveat", value: "Caveat" },
  { name: "Dancing Script", value: "Dancing Script" },
  { name: "Shadows Into Light", value: "Shadows Into Light" },
  { name: "Indie Flower", value: "Indie Flower" },
  { name: "Great Vibes", value: "Great Vibes" },
  { name: "Amatic SC", value: "Amatic SC" },
  { name: "Sacramento", value: "Sacramento" },
  { name: "Satisfy", value: "Satisfy" },
  { name: "Yellowtail", value: "Yellowtail" },
  { name: "Kaushan Script", value: "Kaushan Script" },
  { name: "Gloria Hallelujah", value: "Gloria Hallelujah" },
  { name: "Courgette", value: "Courgette" },
  { name: "Allura", value: "Allura" },
  { name: "Alex Brush", value: "Alex Brush" },
  { name: "Cookie", value: "Cookie" },
  { name: "Cinzel Decorative", value: "Cinzel Decorative" },
  { name: "Comfortaa", value: "Comfortaa" },
  { name: "Syncopate", value: "Syncopate" },
  { name: "Righteous", value: "Righteous" },
  { name: "Bangers", value: "Bangers" },
  { name: "Press Start 2P", value: "Press Start 2P" },
  { name: "Permanent Marker", value: "Permanent Marker" },
  { name: "Special Elite", value: "Special Elite" },
  { name: "Rock Salt", value: "Rock Salt" }
]

// Helper to inject Google Font dynamically in the document head
const loadGoogleFont = (fontName: string) => {
  if (typeof window === "undefined") return
  
  // Clean up font family string to isolate name
  const formattedName = fontName.split(',')[0].trim().replace(/['"]/g, '')
  
  // Avoid loading system fonts via external request
  const systemFonts = ["serif", "sans-serif", "monospace", "Arial", "Courier New", "Georgia", "Times New Roman", "Trebuchet MS", "Verdana", "Inter"]
  if (systemFonts.includes(formattedName)) return

  const fontId = `gfont-${formattedName.replace(/\s+/g, '-').toLowerCase()}`
  if (!document.getElementById(fontId)) {
    const link = document.createElement('link')
    link.id = fontId
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(formattedName)}:wght@400;500;700&display=swap`
    document.head.appendChild(link)
  }
}

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

  const handleFontChange = (fontValue: string) => {
    loadGoogleFont(fontValue)
    editor.chain().focus().setFontFamily(fontValue).run()
  }

  return (
    <div className="w-full flex flex-col bg-gray-100 dark:bg-[#1A1D27] rounded-xl border border-gray-200 dark:border-[#2A2D3A] overflow-hidden shadow-inner">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F9FBFD] dark:bg-[#0F1117] border-b border-gray-200 dark:border-[#2A2D3A] sticky top-0 z-10 shadow-sm">
        
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} />
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} />
        
        <Divider />

        {/* 100 Font Selector Dropdown */}
        <select
          onChange={(event) => handleFontChange(event.target.value)}
          value={editor.getAttributes('textStyle').fontFamily || "Inter"}
          className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-700 hover:bg-gray-100 focus:bg-white rounded-md bg-transparent dark:text-white dark:hover:bg-[#2A2D3A] cursor-pointer outline-none transition-colors max-w-[150px]"
        >
          {FONTS_CATALOG.map((font) => (
            <option key={font.value} value={font.value} className="bg-white dark:bg-[#1A1D27]">
              {font.name}
            </option>
          ))}
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
