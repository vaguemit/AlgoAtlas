import { CursorFollowingCharacter } from "@/components/cursor-following-character"

export default function CatDemoPage() {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Meet Whisker - Our Interactive Cat
        </h1>
        
        <div className="bg-[#09061A]/60 p-6 rounded-xl border border-[#3A1E70]/30 shadow-lg backdrop-blur-sm">
          <p className="text-lg text-white/80 mb-8 text-center">
            Interact with Whisker by moving your cursor. Click on the cat to hear a meow!
          </p>
          
          <div className="rounded-xl overflow-hidden border-2 border-[#3A1E70]">
            <CursorFollowingCharacter />
          </div>
          
          <div className="mt-8 text-white/70 text-center text-sm">
            <p>Whisker follows your cursor movement and responds to your clicks with sounds.</p>
            <p className="mt-2">The 3D model adjusts its gaze to follow your mouse position across the screen.</p>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center">
          <a 
            href="/"
            className="relative group bg-gradient-to-r from-[#3A1E70] to-[#4A2085] hover:from-[#4A2085] hover:to-[#5A2A95] text-white px-6 py-3 rounded-md transition-all duration-300 shadow-lg shadow-[#3A1E70]/20 hover:shadow-[#3A1E70]/40"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  )
} 