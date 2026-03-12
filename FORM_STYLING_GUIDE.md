# Form Styling Guide

This guide explains how to apply the beautiful form styling (from styles.css) throughout the app.

## Components Updated

### 1. Input Component (`components/ui/Input/Input.tsx`)
- Updated with rounded corners (borderRadius.xl)
- Added beautiful shadow: `#cff0ff` color with 10px blur
- Added cyan side borders on focus (`#12B1D1`)
- White background instead of secondary background
- Shadow elevation: 3 (Android)

**Usage:**
```tsx
import { Input } from '@/components/ui'
import { Ionicons } from '@expo/vector-icons'

<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  leftIcon={<Ionicons name="mail-outline" size={20} />}
/>
```

### 2. GradientButton Component (`components/GradientButton.tsx`)
- New component with gradient from `rgb(16, 137, 211)` to `rgb(18, 177, 209)`
- Beautiful shadow matching CSS: `rgba(133, 189, 215, 0.8784313725)` with 20px blur
- Smooth press animation with spring physics
- Full width support

**Usage:**
```tsx
import { GradientButton } from '@/components/GradientButton'

<GradientButton
  onPress={handleSubmit}
  loading={isLoading}
>
  Submit
</GradientButton>
```

### 3. Form Styles Constants (`constants/formStyles.ts`)
- Centralized form styling constants
- Use for consistent styling across forms
- Includes container, heading, input, button, and social button styles

## Screens Updated

1. **Login Screen** (`app/auth/login.tsx`)
   - Replaced Button with GradientButton for all action buttons
   - Input fields automatically use beautiful styling

2. **Prayer Requests** (`app/prayer-requests.tsx`)
   - TextInput styled with beautiful shadow
   - GradientButton for submit

3. **Contact Screen** (`app/contact.tsx`)
   - Feedback button uses GradientButton

## How to Apply to Other Screens

### For Text Inputs:
```tsx
import { Input } from '@/components/ui'

<Input
  label="Your Label"
  value={value}
  onChangeText={setValue}
  placeholder="Placeholder text"
/>
// Styling is automatic - no extra code needed!
```

### For Custom TextInput:
```tsx
const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.white,
    // Beautiful shadow matching CSS
    shadowColor: '#cff0ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
  },
})
```

### For Buttons:
```tsx
import { GradientButton } from '@/components/GradientButton'

<GradientButton
  onPress={handleSubmit}
  loading={isLoading}
>
  Submit Form
</GradientButton>
```

## Design Specs from CSS

### Colors
- Primary gradient: `rgb(16, 137, 211)` → `rgb(18, 177, 209)`
- Shadow color: `rgba(133, 189, 215, 0.8784313725)`
- Input shadow: `#cff0ff`
- Border focus: `#12B1D1`
- Text: `rgb(170, 170, 170)` (placeholder)
- Links: `#0099ff`

### Dimensions
- Border radius (container): 40px
- Border radius (inputs): 20px
- Border radius (buttons): 20px
- Padding (container): 25px 35px
- Padding (inputs): 15px 20px
- Padding (buttons): 15px block

### Shadows
- Container: 30px offset, 30px blur, -20px spread
- Inputs: 10px offset, 10px blur, -5px spread
- Buttons: 20px offset, 10px blur, -15px spread
- Social: 12px offset, 10px blur, -8px spread

### Border
- Container: 5px solid white
- Inputs: 2px side borders (transparent → #12B1D1 on focus)
- Buttons: No border

## Font Styling
- Heading: 900 weight, 30px, primary color
- Button text: Bold, white, centered
- Link text: 11px for forgot password, 9px for agreement

## Best Practices

1. **Always use the Input component** for text fields - it handles styling automatically
2. **Use GradientButton** for all primary actions (submit, login, etc.)
3. **Never hardcode colors** - use design tokens from `constants/design.ts`
4. **Keep consistency** by using the provided components
5. **For custom components**, reference the styles in `constants/formStyles.ts`

## File Structure
```
components/
  ├── ui/
  │   ├── Input/
  │   │   └── Input.tsx (Updated with new styling)
  │   └── Button/
  │       └── Button.tsx (Original variants still available)
  ├── GradientButton.tsx (New - for beautiful gradient buttons)
  
constants/
  └── formStyles.ts (New - centralized form styles)
```
