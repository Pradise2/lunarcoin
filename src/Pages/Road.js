import React from 'react'
import Footer from '../Component/Footer'

const Road = () => {
  return (
    <div class="bg-gradient-to-b from-black to-zinc-900 text-white min-h-screen p-4">
  <div class="text-center mb-6">
    <h1 class="text-2xl font-bold">Complete the mission, earn the commission!</h1>
    <p class="text-muted-foreground">But hey, only qualified actions unlock the CEXP galaxy! ✨</p>
  </div>
  <div class="flex justify-center mb-6">
    <button class="bg-secondary text-secondary-foreground py-2 px-4 rounded-l-full">New</button>
    <button class="bg-zinc-800 text-background py-2 px-4 rounded-r-full">Completed</button>
  </div>
  <div class="space-y-4">
    <div class="bg-zinc-800 p-4 rounded-lg flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">Register in CEX.IO App</h2>
        <p class="text-primary">🪙 10'000 CEXP</p>
      </div>
      <div class="flex items-center space-x-2">
        <button class="bg-primary text-primary-foreground py-2 px-4 rounded-lg">Go</button>
        <img aria-hidden="true" alt="check-mark" src="https://openui.fly.dev/openui/24x24.svg?text=✔" />
      </div>
    </div>
<div class="bg-zinc-800 p-4 rounded-lg flex items-center justify-between">
  <div>
    <h2 class="text-lg font-semibold">Invite 1 Friend</h2>
    <p class="text-primary">🪙 5'000 CEXP</p>
  </div>
  <div class="flex items-center space-x-2">
  <button class="bg-primary text-primary-foreground py-2 px-4 rounded-lg">Go</button>
    <img aria-hidden="true" alt="check-mark" src="https://openui.fly.dev/openui/24x24.svg?text=✔" />
  </div>
</div>

<div class="bg-zinc-800 p-4 rounded-lg flex items-center justify-between">
  <div>
    <h2 class="text-lg font-semibold">Subscribe to CEX.IO Telegram</h2>
    <p class="text-primary">🪙 3'000 CEXP</p>
  </div>
  <div class="flex items-center space-x-2">
    <button class="bg-primary text-primary-foreground py-2 px-4 rounded-lg">Go</button>
    <img aria-hidden="true" alt="check-mark" src="https://openui.fly.dev/openui/24x24.svg?text=✔" />
  </div>
</div>
  </div>
  <div className="w-full max-w-md fixed bottom-0 left-0 flex justify-around py-1">
    <Footer />
  </div>
</div>
  )
}

export default Road