"use client"

import { CursorFollowingCharacter } from "@/components/cursor-following-character"
import { useDeviceType } from "@/hooks/use-device-type"

export default function RobotDemo() {
  const { isDesktop } = useDeviceType()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
        Interactive Robot Character
      </h1>

      {isDesktop ? (
        <>
          <p className="text-center text-white/70 mb-8 max-w-2xl mx-auto">
            This futuristic robot character follows your cursor movements with its eyes and head. Move your cursor
            around to see it react in real-time.
          </p>

          <div className="max-w-3xl mx-auto">
            <CursorFollowingCharacter />
          </div>

          <div className="mt-8 text-center text-white/60 text-sm max-w-2xl mx-auto">
            The character features dynamic eye tracking, subtle head movements, and a gently bobbing animation to create
            a lifelike, playful interaction. The glowing elements and metallic textures give it a futuristic appearance
            that matches the overall aesthetic of AlgoAtlas.
          </div>
        </>
      ) : (
        <div className="text-center text-white/70 p-8 border border-purple-500/20 rounded-lg bg-navy-800/40 max-w-md mx-auto">
          <p className="mb-4">This interactive feature is only available on desktop devices.</p>
          <p>Please visit this page on a computer to experience the cursor-following robot character.</p>
        </div>
      )}
    </div>
  )
}

