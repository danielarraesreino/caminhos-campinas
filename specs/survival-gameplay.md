# Caminhos Campinas - Survival Gameplay Test Plan

## Application Overview

Caminhos Campinas is a survival simulation game that puts players in the shoes of someone experiencing homelessness in Campinas, Brazil. The game features:

- **Survival Mechanics**: Health, sanity, and money management
- **Time Progression**: Day/night cycle with time-based events
- **Interactive Map**: Leaflet-based map with real locations
- **Dilemma System**: Moral choices that affect game state
- **AI Chat**: Conversational AI for guidance and support
- **Voice Reporter**: Audio recording for player feedback
- **Locations Database**: Real social services and resources

---

## Test Scenarios

### 1. Game Initialization & HUD Display

**Seed:** `tests/seed.spec.ts`

#### 1.1 HUD Elements Visibility

**Steps:**
1. Navigate to `/jogar` with game state injected
2. Wait for page load and hydration

**Expected Results:**
- Health stat (`[data-testid="stat-saúde"]`) is visible
- Sanity stat (`[data-testid="stat-mente"]`) is visible
- Money stat (`[data-testid="stat-caixa"]`) is visible
- All stats display correct initial values (Health: 100, Sanity: 100, Money: 20)
- Day counter shows "Dia 1"
- Time display shows "08:00" or similar morning time

#### 1.2 HUD Stat Value Accuracy

**Steps:**
1. Inject game state with specific values (Health: 75, Sanity: 50, Money: 15)
2. Verify displayed values match injected state

**Expected Results:**
- Health bar shows 75% fill
- Sanity bar shows 50% fill
- Money displays "R$ 15"

---

### 2. Map Navigation & Interaction

**Seed:** `tests/seed.spec.ts`

#### 2.1 Map Loads Successfully

**Steps:**
1. Navigate to `/jogar` with game state
2. Wait for Leaflet container to appear

**Expected Results:**
- `.leaflet-container` element is visible
- Map tiles load without errors
- Map is centered on Campinas coordinates
- Zoom controls are visible and functional

#### 2.2 Map Markers Display

**Steps:**
1. Wait for map to fully load
2. Check for location markers on map

**Expected Results:**
- Location markers are visible on map
- Markers have appropriate icons/colors
- Clicking marker shows location information

#### 2.3 Map Zoom and Pan

**Steps:**
1. Click zoom in button
2. Click zoom out button
3. Drag map to pan

**Expected Results:**
- Zoom level increases/decreases appropriately
- Map pans smoothly without errors
- User position (if available) updates correctly

---

### 3. Dilemma System

**Seed:** `tests/seed.spec.ts`

#### 3.1 Dilemma Modal Appears

**Steps:**
1. Inject game state
2. Trigger a dilemma (via time progression or manual trigger)
3. Wait for modal to appear

**Expected Results:**
- Dilemma modal is visible with backdrop
- Modal contains dilemma title and description
- Choice buttons are visible and clickable
- Game is paused while modal is open

#### 3.2 Dilemma Choice Resolution

**Steps:**
1. Wait for dilemma modal
2. Click on a choice button
3. Observe state changes

**Expected Results:**
- Modal closes after choice
- Game state updates based on choice (health/sanity/money changes)
- Game resumes (unpauses)
- Dilemma is marked as resolved

#### 3.3 Dilemma with AI Chat Integration

**Steps:**
1. Open dilemma modal
2. Click "Chat" button (if available)
3. Interact with AI for guidance

**Expected Results:**
- Chat modal opens
- AI provides contextual advice about dilemma
- Can return to dilemma modal
- Choice can still be made after consulting AI

---

### 4. Time Progression & Status Decay

**Seed:** `tests/seed.spec.ts`

#### 4.1 Time Advances Automatically

**Steps:**
1. Inject game state with time = 8:00
2. Wait and observe time display
3. Verify time increments

**Expected Results:**
- Time display updates periodically
- Time advances in realistic increments (e.g., 1 hour per X seconds)
- Day counter increments when time reaches 24:00

#### 4.2 Health Decay Over Time

**Steps:**
1. Inject game state with Health: 100
2. Wait for time to progress
3. Monitor health stat

**Expected Results:**
- Health decreases gradually over time
- Decay rate is consistent with game rules
- Health does not go below 0
- Critical health warning appears when health < 20

#### 4.3 Sanity Decay Over Time

**Steps:**
1. Inject game state with Sanity: 100
2. Wait for time to progress
3. Monitor sanity stat

**Expected Results:**
- Sanity decreases gradually over time
- Visual effects appear when sanity is low (blur, grayscale)
- Sanity does not go below 0

---

### 5. UI Features & Modals

**Seed:** `tests/seed.spec.ts`

#### 5.1 Chat Modal Open/Close

**Steps:**
1. Click chat button in HUD
2. Verify modal opens
3. Click close button
4. Verify modal closes

**Expected Results:**
- Chat modal opens with fade-in animation
- Modal has backdrop blur
- Close button (X) is visible and functional
- Modal closes cleanly without errors
- Game state persists after closing

#### 5.2 Voice Reporter Modal

**Steps:**
1. Click voice/microphone button in HUD
2. Verify voice reporter modal opens
3. Test recording functionality (if available)
4. Close modal

**Expected Results:**
- Voice reporter modal opens
- Recording interface is visible
- Close button works
- Modal closes without affecting game state

#### 5.3 Locations Modal ("Atlas de Realidade")

**Steps:**
1. Click locations button in HUD
2. Verify locations modal opens
3. Scroll through location list
4. Close modal

**Expected Results:**
- Modal opens with title "Atlas de Realidade"
- Location list is populated with real services
- Each location has name, description, and details
- Scroll works smoothly
- Close button works

---

### 6. Game Over Conditions

**Seed:** `tests/seed.spec.ts`

#### 6.1 Game Over - Health Reaches Zero

**Steps:**
1. Inject game state with Health: 1
2. Wait for health to decay to 0 or manually set to 0
3. Observe game over screen

**Expected Results:**
- Game over modal appears
- Reason displayed: health-related death
- Statistics shown (days survived, money earned, etc.)
- Restart button is available
- Can view impact report

#### 6.2 Game Over - Sanity Reaches Zero

**Steps:**
1. Inject game state with Sanity: 1
2. Wait for sanity to decay to 0 or manually set to 0
3. Observe game over screen

**Expected Results:**
- Game over modal appears
- Reason displayed: mental breakdown
- Statistics shown
- Restart button works

#### 6.3 Victory Condition

**Steps:**
1. Trigger victory condition (if available via dilemma or achievement)
2. Observe victory screen

**Expected Results:**
- Victory modal appears with "VITÓRIA_SOCIAL" message
- Celebratory narrative displayed
- Statistics shown
- Can restart or continue

---

### 7. Game Pause/Resume

**Seed:** `tests/seed.spec.ts`

#### 7.1 Game Pauses During Modal

**Steps:**
1. Start game with time progressing
2. Open dilemma or chat modal
3. Observe time progression

**Expected Results:**
- Time stops advancing when modal is open
- Health/sanity decay pauses
- Game resumes when modal closes

#### 7.2 Tutorial Pauses Game

**Steps:**
1. Clear tutorial localStorage flag
2. Navigate to `/jogar`
3. Observe tutorial modal

**Expected Results:**
- Tutorial modal appears on first visit
- Game is paused during tutorial
- Can close tutorial
- Game resumes after tutorial

---

### 8. Mobile Responsiveness

**Seed:** `tests/seed.spec.ts`

#### 8.1 Mobile Layout Adapts

**Steps:**
1. Set viewport to mobile size (Pixel 5)
2. Navigate to `/jogar`
3. Verify UI elements

**Expected Results:**
- HUD elements are visible and accessible
- Buttons are touch-friendly (min 44x44px)
- Map is usable on small screen
- Modals use full screen or bottom sheet pattern
- No horizontal scroll

#### 8.2 Touch Interactions Work

**Steps:**
1. Use mobile viewport
2. Tap on map markers
3. Tap on buttons
4. Swipe to close modals (if applicable)

**Expected Results:**
- All touch targets are accessible
- No double-tap delay
- Gestures work smoothly

---

### 9. Error Handling & Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 9.1 No Console Errors on Load

**Steps:**
1. Navigate to `/jogar`
2. Monitor console for errors

**Expected Results:**
- No critical JavaScript errors
- AuthJS errors are expected and whitelisted
- Geolocation errors are acceptable (user may deny)

#### 9.2 Game State Persistence

**Steps:**
1. Play game for a few minutes
2. Refresh page
3. Verify state is restored (if persistence is enabled)

**Expected Results:**
- Game state persists across refreshes (via localStorage or PouchDB)
- Avatar, stats, and progress are restored
- Can continue from where left off

#### 9.3 Invalid State Handling

**Steps:**
1. Inject invalid game state (negative health, invalid avatar)
2. Observe error handling

**Expected Results:**
- Game handles invalid state gracefully
- Defaults to safe values or prompts re-creation
- No crashes or infinite loops

---

## Success Criteria

- ✅ All HUD elements display correctly on desktop and mobile
- ✅ Map loads and is interactive without errors
- ✅ Dilemmas appear, choices work, and state updates correctly
- ✅ Time progresses and stats decay according to game rules
- ✅ All modals (chat, voice, locations) open/close properly
- ✅ Game over conditions trigger correctly
- ✅ Game pause/resume works during modals
- ✅ Mobile layout is responsive and touch-friendly
- ✅ No critical console errors during normal gameplay

---

## Notes

- Tests should be independent and can run in any order
- Use `tests/seed.spec.ts` to set up consistent game state
- Mock time progression for faster test execution where possible
- Use `data-testid` attributes for reliable selectors
- Test both happy path and edge cases
